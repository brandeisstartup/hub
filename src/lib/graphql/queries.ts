import { gql } from "@apollo/client";

export const GET_PROJECT_BY_SLUG = gql`
  query GetProjectBySlug($slug: String!) {
    project(slug: $slug) {
      id
      title
      short_description
      long_description
      competition
      video_url
      image_url
      team_members_emails
      teamMembers {
        clerkId
        firstName
        lastName
        imageUrl
        bio
        major
        graduationYear
      }
    }
  }
`;

export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    projects {
      id
      title
      short_description
      image_url
      competition
    }
  }
`;

export const GET_PROJECT_BY_ID = gql`
  query GetProjectById($id: Int!) {
    project(id: $id) {
      id
      title
      short_description
      long_description
      competition
      team_members_emails
      video_url
      image_url
    }
  }
`;

export const GET_USER_BY_CLERK_ID = gql`
  query GetUserByClerkId($clerkId: String!) {
    getUserByClerkId(clerkId: $clerkId) {
      id
      clerkId
      email
      secondaryEmail
      firstName
      lastName
      bio
      imageUrl
      graduationYear
      major
    }
  }
`;

export const PROJECTS_BY_EMAIL = gql`
  query ProjectsByEmail($email: String!) {
    projectsByEmail(email: $email) {
      id
      title
      created_date
      creator_email
      short_description
      long_description
      competition
      team_members_emails
      video_url
      image_url
    }
  }
`;
