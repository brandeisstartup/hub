import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useMergedUser } from "@/context/UserContext";
type ProjectData = {
  id: number;
  title: string;
  tagline?: string;
  about?: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  members?: string[];
  teamMembers?: string[]; // Updated as well
  video_url?: string;
  imageUrl?: string;
};

// Define your GraphQL query
const PROJECTS_BY_EMAIL = gql`
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

const MyProjects = () => {
  // Get the user from your merged user context
  const { user, loading: userLoading } = useMergedUser();
  const email = user?.email;

  // Run the query using the email as a variable; skip if there's no email
  const { data, loading, error } = useQuery(PROJECTS_BY_EMAIL, {
    variables: { email },
    skip: !email
  });

  // Show loading states or error messages
  if (userLoading) {
    return <div>Loading user data...</div>;
  }

  if (!email) {
    return <div>Please sign in to view your projects.</div>;
  }

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error loading projects: {error.message}</div>;
  }

  const projects = data?.projectsByEmail;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>
      {projects && projects.length > 0 ? (
        <ul className="space-y-4">
          {projects.map((project: ProjectData) => (
            <li key={project.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p>{project.short_description}</p>
              {/* Add more project details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects found for {email}.</p>
      )}
    </div>
  );
};

export default MyProjects;
