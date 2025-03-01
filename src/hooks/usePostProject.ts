import { useCallback } from "react";

const CREATE_PROJECT_MUTATION = `
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

interface PostProjectVariables {
  title: string;
  creator_email: string;
  short_description: string;
  long_description: string;
  competition: string;
  team_members_emails: string[];
  video_url?: string | null;
  image_url?: string | null;
}

export const usePostProject = () => {
  const postProject = useCallback(async (variables: PostProjectVariables) => {
    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: CREATE_PROJECT_MUTATION,
          variables
        })
      });
      const json = await response.json();
      if (json.errors) {
        console.error("GraphQL errors:", json.errors);
        throw new Error("There was an error creating the project.");
      }
      return json.data.createProject;
    } catch (error) {
      console.error("Request error:", error);
      throw error;
    }
  }, []);

  return { postProject };
};
