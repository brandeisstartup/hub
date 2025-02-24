import { gql } from "@apollo/client";

// ✅ Fetch a project by slug
export const GET_PROJECT_BY_SLUG = gql`
  query GetProjectBySlug($slug: String!) {
    project(slug: $slug) {
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

// ✅ Fetch all projects (for a list page)
export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    projects {
      id
      title
      short_description
    }
  }
`;
