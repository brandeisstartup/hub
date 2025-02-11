import { ApolloServer, gql } from "apollo-server-micro";
//@ts-ignore
import { PrismaClient, Projects } from "@prisma/client";
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
    team_member_emails: [String!]!
  }

  type Query {
    projects: [Project!]!
    project(id: ID!): Project
  }

  type Mutation {
    createProject(
      title: String!
      creator_email: String!
      short_description: String
      long_description: String
      competition: String
      team_member_emails: [String!]!
    ): Project!
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
  team_member_emails: string[];
}

// GraphQL Resolvers with Typings
const resolvers = {
  Query: {
    projects: async (): Promise<Projects[]> => {
      return await prisma.projects.findMany();
    },
    project: async (
      _: unknown,
      { id }: { id: string }
    ): Promise<Projects | null> => {
      return await prisma.projects.findUnique({
        where: { id: Number(id) }
      });
    }
  },
  Mutation: {
    createProject: async (_: unknown, args: ProjectArgs): Promise<Projects> => {
      return await prisma.projects.create({
        data: {
          title: args.title,
          creator_email: args.creator_email,
          short_description: args.short_description,
          long_description: args.long_description,
          competition: args.competition,
          team_members_emails: args.team_member_emails
        }
      });
    }
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
