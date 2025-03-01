import { ApolloServer, gql } from "apollo-server-micro";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// ✅ Initialize Prisma Client
const prisma = new PrismaClient();

// ✅ Define TypeScript Interfaces for Query & Mutation Arguments
interface ProjectArgs {
  id?: number;
  slug?: string;
}

interface UpdateProjectFieldArgs {
  id: number;
  key: string;
  newValue?: string;
}

interface CreateProjectArgs {
  title: string;
  creator_email: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  team_members_emails: string[];
  video_url: string;
  image_url: string;
}

interface UserArgs {
  id: number;
}

interface CreateUserArgs {
  email: string;
  name?: string;
  bio?: string; // ❌ This caused an error
}

interface UpdateUserArgs {
  id: number;
  name?: string;
  bio?: string;
}

// ✅ GraphQL Type Definitions
const typeDefs = gql`
  type Project {
    id: ID!
    title: String!
    created_date: String!
    creator_email: String!
    short_description: String
    long_description: String
    competition: String
    team_members_emails: [String!]!
    video_url: String
    image_url: String

    teamMembers: [User!]!
  }

  type User {
    id: ID!
    email: String!
    name: String
    bio: String
  }

  type Query {
    projects(search: String): [Project!]!
    project(id: Int, slug: String): Project
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    createProject(
      title: String!
      creator_email: String!
      short_description: String
      long_description: String
      competition: String
      team_members_emails: [String!]!
      video_url: String
      image_url: String
    ): Project!

    createUser(email: String!, name: String, bio: String): User!
    updateUser(id: Int!, name: String, bio: String): User!
    deleteUser(id: Int!): User!
    updateProjectField(id: Int!, key: String!, newValue: String): Project!
  }
`;

// ✅ Fully Typed Resolvers
const resolvers = {
  Query: {
    // projects: async () => prisma.projects.findMany(),
    projects: async (_: unknown, { search }: { search?: string }) => {
      if (!search) return prisma.projects.findMany();

      return prisma.projects.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { competition: { contains: search, mode: "insensitive" } },
            { creator_email: { contains: search, mode: "insensitive" } }
          ]
        }
      });
    },

    project: async (_: unknown, { id, slug }: ProjectArgs) => {
      if (id) return prisma.projects.findUnique({ where: { id } });
      if (slug) {
        return prisma.projects.findFirst({
          where: { title: slug.replace(/-/g, " ") }
        });
      }
      throw new Error("Either 'id' or 'slug' must be provided.");
    },

    users: async () => prisma.users.findMany(),
    user: async (_: unknown, { id }: UserArgs) =>
      prisma.users.findUnique({ where: { id } })
  },

  Mutation: {
    createProject: async (_: unknown, args: CreateProjectArgs) => {
      return prisma.projects.create({ data: args });
    },

    createUser: async (_: unknown, args: CreateUserArgs) => {
      return prisma.users.create({
        data: {
          email: args.email,
          name: args.name || "", // ✅ Default empty string if undefined
          bio: args.bio ?? "" // ✅ Fix: Ensure `bio` is always a string
        }
      });
    },

    updateUser: async (_: unknown, args: UpdateUserArgs) => {
      return prisma.users.update({
        where: { id: args.id },
        data: {
          name: args.name,
          bio: args.bio ?? "" // ✅ Ensure `bio` is a string
        }
      });
    },

    deleteUser: async (_: unknown, { id }: UserArgs) => {
      return prisma.users.delete({ where: { id } });
    },

    updateProjectField: async (_: unknown, args: UpdateProjectFieldArgs) => {
      const { id, key, newValue } = args;
      const allowedFields = [
        "title",
        "short_description",
        "long_description",
        "competition",
        "video_url",
        "image_url"
      ];
      if (!allowedFields.includes(key)) {
        throw new Error(`Field ${key} cannot be updated.`);
      }

      const updateData: { [key: string]: any } = { [key]: newValue };

      return prisma.projects.update({
        where: { id },
        data: updateData
      });
    }
  }
};

// ✅ Singleton Apollo Server to prevent multiple instances
let apolloServer: ApolloServer | null = null;
const getApolloServer = async () => {
  if (!apolloServer) {
    apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();
  }
  return apolloServer;
};

// ✅ API Route Handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ✅ Set CORS headers BEFORE Apollo handles the request
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*"); // Change to your frontend URL in production
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const server = await getApolloServer();
  return server.createHandler({ path: "/api/graphql" })(req, res);
}

// ✅ Disable Next.js Body Parser for Apollo Server
export const config = {
  api: {
    bodyParser: false
  }
};
