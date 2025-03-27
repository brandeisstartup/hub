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
    clerkId: String!
    email: String!
    secondaryEmail: String
    firstName: String
    lastName: String
    bio: String
    imageUrl: String
    graduationYear: Int
    major: String
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

    createUser(
      clerkId: String!
      email: String!
      secondaryEmail: String
      firstName: String
      lastName: String
      bio: String
      imageUrl: String
      graduationYear: Int
      major: String
    ): User!

    updateUser(
      email: String!
      clerkId: String
      secondaryEmail: String
      firstName: String
      lastName: String
      bio: String
      imageUrl: String
      graduationYear: Int
      major: String
    ): User!

    deleteUser(id: Int!): User!
    deleteUserByEmail(email: String!): User!
    deleteUserByClerkId(clerkId: String!): User!

    updateProjectField(id: Int!, key: String!, newValue: String): Project!
    deleteProject(id: Int!): Project!
    addTeamMember(id: Int!, email: String!): Project!
    removeTeamMember(id: Int!, email: String!): Project!
  }
`;
