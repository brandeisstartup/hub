import { ApolloServer, gql } from "apollo-server-micro";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize Prisma Client
const prisma = new PrismaClient();

// GraphQL Type Definitions
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
    project(id: ID!): Project
    users: [User!]! # ✅ Fetch all users
    user(id: ID!): User # ✅ Fetch user by ID
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
    updateUser(id: ID!, name: String, bio: String): User! # ✅ Update user
    deleteUser(id: ID!): User! # ✅ Delete user
  }
`;

// TypeScript Interfaces for Args
interface ProjectArgs {
  id?: string;
  title: string;
  creator_email: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  team_members_emails: string[];
}

interface UserArgs {
  id?: string;
  email?: string;
  name?: string;
  bio?: string;
}

// GraphQL Resolvers with Typings
const resolvers = {
  Query: {
    projects: async () => prisma.projects.findMany(),
    project: async (_: unknown, { id }: { id: string }) =>
      prisma.projects.findUnique({ where: { id: Number(id) } }),

    // ✅ User Queries
    users: async () => prisma.users.findMany(),
    user: async (_: unknown, { id }: { id: string }) =>
      prisma.users.findUnique({ where: { id: Number(id) } })
  },

  Mutation: {
    createProject: async (_: unknown, args: ProjectArgs) => {
      const { id, ...data } = args;
      return prisma.projects.create({ data });
    },

    // ✅ User Mutations
    createUser: async (_: unknown, args: UserArgs) =>
      prisma.users.create({
        data: {
          email: args.email!,
          name: args.name || "",
          bio: args.bio || ""
        }
      }),

    updateUser: async (_: unknown, args: UserArgs) =>
      prisma.users.update({
        where: { id: Number(args.id) },
        data: {
          name: args.name,
          bio: args.bio
        }
      }),

    deleteUser: async (_: unknown, { id }: { id: string }) =>
      prisma.users.delete({ where: { id: Number(id) } })
  }
};

// Apollo Server Configuration
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
});

// Start Apollo Server
const startServer = apolloServer.start();

// ✅ Next.js API Route Config with CORS Settings
export const config = {
  api: {
    bodyParser: false
  }
};

// Apollo Handler with CORS Fix
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await startServer;

  // CORS Configuration
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*"); // Replace '*' with your frontend URL for production
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );

  // Handle preflight requests (OPTIONS method)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return apolloServer.createHandler({
    path: "/api/graphql"
  })(req, res);
}
