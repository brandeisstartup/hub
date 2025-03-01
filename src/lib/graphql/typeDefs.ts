// /lib/graphql/typeDefs.ts
import { gql } from "apollo-server-micro";

export const typeDefs = gql`
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
    deleteProject(id: Int!): Project!
    addTeamMember(id: Int!, email: String!): Project!
    removeTeamMember(id: Int!, email: String!): Project!
  }
`;
