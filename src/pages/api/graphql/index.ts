import { ApolloServer, gql } from "apollo-server-micro";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// ✅ Initialize Prisma Client
const prisma = new PrismaClient();

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
  }

  type User {
    id: ID!
    email: String!
    name: String
    bio: String
  }

  type Query {
    projects: [Project!]!
    project(id: Int, slug: String): Project
    users: [User!]! # ✅ Fetch all users
    user(id: Int!): User # ✅ Fetch user by ID
  }

  type Mutation {
    createProject(
      title: String!
      creator_email: String!
      short_description: String
      long_description: String
      competition: String
      team_members_emails: [String!]!
    ): Project!

    createUser(email: String!, name: String, bio: String): User! # ✅ Create user
    updateUser(id: Int!, name: String, bio: String): User! # ✅ Update user
    deleteUser(id: Int!): User! # ✅ Delete user
  }
`;

// ✅ Resolvers
const resolvers = {
  Query: {
    projects: async () => prisma.projects.findMany(),
    // project: async (_: unknown, { id }: { id: number }) =>
    //   prisma.projects.findUnique({ where: { id } }),
    project: async (
      _: unknown,
      { id, slug }: { id?: number; slug?: string }
    ) => {
      if (id) {
        return prisma.projects.findUnique({ where: { id } });
      }
      if (slug) {
        return prisma.projects.findFirst({
          where: { title: slug.replace(/-/g, " ") }
        });
      }
      throw new Error("Either 'id' or 'slug' must be provided.");
    },
    users: async () => prisma.users.findMany(),
    user: async (_: unknown, { id }: { id: number }) =>
      prisma.users.findUnique({ where: { id } })
  },

  Mutation: {
    createProject: async (_: unknown, args: any) => {
      const { id, ...data } = args; // ✅ Dynamically remove `id`

      return prisma.projects.create({
        data // ✅ Insert all other fields dynamically
      });
    },

    createUser: async (_: unknown, args: any) =>
      prisma.users.create({ data: args }),

    updateUser: async (_: unknown, args: any) =>
      prisma.users.update({
        where: { id: args.id },
        data: { name: args.name, bio: args.bio }
      }),

    deleteUser: async (_: unknown, { id }: { id: number }) =>
      prisma.users.delete({ where: { id } })
  }
};

// ✅ Singleton Apollo Server
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

// ✅ Disable Next.js Body Parser
export const config = {
  api: {
    bodyParser: false
  }
};
