"use client";

// import { useRouter } from "next/router";
// import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import { useMergedUser } from "@/context/UserContext";
import Link from "next/link";

// -----------------------------
// Hard-coded data for the Left Column
// -----------------------------
const projectLeft = {
  title: "Hard Coded Project",
  team_members_emails: ["member1@example.com", "member2@example.com"],
  short_description: "This is a short description for the hard-coded project."
};

// -----------------------------
// GraphQL Query to fetch projects by email
// -----------------------------
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

// -----------------------------
// Component to render the list of projects for the signed-in user
// -----------------------------
function ProjectsList() {
  const { user, loading: userLoading } = useMergedUser();
  const email = user?.email;

  const { data, loading, error } = useQuery(PROJECTS_BY_EMAIL, {
    variables: { email },
    skip: !email
  });

  if (userLoading) return <div>Loading user data...</div>;
  if (!email) return <div>Please sign in to view your projects.</div>;
  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects: {error.message}</div>;

  const projects = data?.projectsByEmail;

  return (
    <div className="p-4">
      <Heading label={"My Projects"} />
      {projects && projects.length > 0 ? (
        <ul className="space-y-4">
          {projects.map(
            (
              project: { title: string; short_description: string },
              index: number
            ) => (
              <div
                key={index}
                className="mt-6 border-t divide-gray-100 pt-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  {project.title}
                </dt>
                <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">{project.short_description}</span>
                  <span className="ml-4 flex-shrink-0">
                    <Link
                      className="rounded-md bg-white font-medium text-BrandeisBrand hover:text-BrandeisBrandeTint"
                      href={`/projects/${project.title}`}>
                      View
                    </Link>
                  </span>
                  <span className="ml-4 flex-shrink-0">
                    <Link
                      className="rounded-md bg-white font-medium text-BrandeisBrand hover:text-BrandeisBrandeTint"
                      href={`/projects/edit/${project.title}`}>
                      Edit
                    </Link>
                  </span>
                </dd>
              </div>
            )
          )}
        </ul>
      ) : (
        <p>No projects found for {email}.</p>
      )}
    </div>
  );
}

// -----------------------------
// Main Page Component
// -----------------------------
export default function ProjectPage() {
  return (
    <main className="py-24">
      <div className="mx-auto max-w-8xl px-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
        {/* Left Column: Hard-coded project info */}
        <section className="w-full border p-8 lg:sticky lg:top-36 h-fit lg:max-h-[90vh] overflow-auto lg:overflow-visible">
          <Heading label={projectLeft.title} />
          <dd className="flex flex-row gap-1 font-sans flex-wrap">
            <span>By: </span>
            {projectLeft.team_members_emails.map((email) => (
              <span key={email}>{email} </span>
            ))}
          </dd>
          <div className="mt-4 text-sm text-gray-700">
            <p>{projectLeft.short_description}</p>
          </div>
          {/* You can add more static project info here */}
        </section>

        {/* Right Column: List of Projects from GraphQL */}
        <section className="w-full flex flex-col gap-6 border p-8">
          <ProjectsList />
        </section>
      </div>
    </main>
  );
}
