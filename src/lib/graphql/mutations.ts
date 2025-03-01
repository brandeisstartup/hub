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
export const UPDATE_PROJECT_FIELD = gql`
  mutation UpdateProjectField($id: Int!, $key: String!, $newValue: String) {
    updateProjectField(id: $id, key: $key, newValue: $newValue) {
      id
      title
      short_description
      long_description
      competition
      video_url
      image_url
    }
  }
`;
export const DELETE_PROJECT_FIELD = gql`
  mutation DeleteProjectById($id: Int!) {
    deleteProject(id: $id) {
      id
      title
    }
  }
`;
