import { NextApiRequest, NextApiResponse } from "next";
import { gql } from "apollo-server-micro";
import { ApolloServer } from "apollo-server-micro";
import { PrismaClient } from "@prisma/client";

// ✅ Initialize Prisma
const prisma = new PrismaClient();

// ✅ Define GraphQL Schema
const typeDefs = gql`
  type Project {
    id: ID!
    title: String!
    short_description: String
    long_description: String
    competition: String
  }

  type Query {
    project(slug: String!): Project
  }
`;

// ✅ Define Resolvers
const resolvers = {
  Query: {
    project: async (_: unknown, { slug }: { slug: string }) =>
      prisma.projects.findFirst({ where: { title: slug.replace(/-/g, " ") } })
  }
};

// ✅ Singleton Apollo Server to Prevent Multiple Starts
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
  const server = await getApolloServer();
  return server.createHandler({ path: "/api/v1/projects/[slug]" })(req, res);
}

// ✅ Disable Body Parser for Apollo Server
export const config = {
  api: {
    bodyParser: false
  }
};
