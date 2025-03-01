import { gql } from "@apollo/client";

export const CREATE_PROJECT_MUTATION = `
  mutation CreateProject(
    $title: String!, 
    $creator_email: String!,
    $short_description: String,
    $long_description: String,
    $competition: String,
    $team_members_emails: [String!]!,
    $video_url: String,
    $image_url: String
  ) {
    createProject(
      title: $title,
      creator_email: $creator_email,
      short_description: $short_description,
      long_description: $long_description,
      competition: $competition,
      team_members_emails: $team_members_emails,
      video_url: $video_url,
      image_url: $image_url
    ) {
      id
      title
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
export const ADD_PROJECT_TEAM_MEMBER = gql`
  mutation AddTeamMember($id: Int!, $email: String!) {
    addTeamMember(id: $id, email: $email) {
      id
      team_members_emails
    }
  }
`;

export const REMOVE_PROJECT_TEAM_MEMBER = gql`
  mutation RemoveTeamMember($id: Int!, $email: String!) {
    removeTeamMember(id: $id, email: $email) {
      id
      team_members_emails
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
