import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import EditProject from "@/ui/components/forms/complete-forms/edit-project";
import apolloClient from "@/lib/apolloClient";
import { GET_PROJECT_BY_SLUG } from "@/lib/graphql/queries";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import { useDeleteProject } from "@/hooks/useDeleteProject";
import { useState } from "react";

// ----- GRAPHQL INTERFACES -----
interface GraphQLProject {
  id: string;
  title?: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  team_members_emails?: string[];
  video_url?: string;
  image_url?: string;
}

// ----- PAGE DATA INTERFACE -----
interface ProjectData {
  id: string;
  title: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  team_members_emails?: string[];
  video_url?: string;
  image_url?: string;
}

// ----- SSR PROPS & PARAMS -----
interface ServerSideProps {
  project: ProjectData;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

// ----- GET SERVER SIDE PROPS -----
export const getServerSideProps: GetServerSideProps<
  ServerSideProps,
  Params
> = async ({ params }) => {
  if (!params?.slug) {
    return { notFound: true };
  }
  const { slug } = params;

  let graphQLProject: GraphQLProject | null = null;
  try {
    const { data } = await apolloClient.query({
      query: GET_PROJECT_BY_SLUG,
      variables: { slug },
      fetchPolicy: "no-cache"
    });
    graphQLProject = data?.project || null;
  } catch (err) {
    console.error("Error fetching from GraphQL:", err);
  }

  if (!graphQLProject) {
    return { notFound: true };
  }

  const mergedData: ProjectData = {
    id: graphQLProject.id,
    title: graphQLProject.title || "Untitled Project",
    short_description: graphQLProject.short_description || "",
    long_description: graphQLProject.long_description || "",
    competition: graphQLProject.competition || "",
    team_members_emails: graphQLProject.team_members_emails || [],
    video_url: graphQLProject.video_url || "",
    image_url: graphQLProject.image_url || ""
  };

  return {
    props: {
      project: mergedData
    }
  };
};

// ----- PAGE COMPONENT -----
export default function ProjectPage({ project }: ServerSideProps) {
  const {
    id,
    title,
    short_description,
    long_description,
    competition,
    video_url,
    image_url,
    team_members_emails
  } = project;
  const router = useRouter();
  const { deleteProject, error } = useDeleteProject();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteProject(Number(id));
      setLoading(false);
      router.push("/search"); // Redirect after deletion
    } catch (err) {
      console.error("Failed to delete project:", err, error);
      alert("Failed to delete project. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="py-24">
      <div className="mx-auto max-w-8xl px-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
        {/* Left Column */}
        <section
          id="fixed"
          className="w-full border p-8  h-fit lg:max-h-[90vh] overflow-auto lg:overflow-visible">
          <Heading label={title} />

          <dd className="flex flex-row gap-1 font-sans flex-wrap">
            By:{" "}
            {(team_members_emails || []).map((email) => (
              <dl key={email}>{email}</dl>
            ))}
          </dd>

          {/* Share, Copy Link, and Delete Button */}
          <aside>
            <menu className="w-full flex justify-start gap-2">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: title,
                      text: `Check out this project: ${title}`,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("URL copied to clipboard!");
                  }
                }}
                className="mt-4 px-4 py-2 font-sans border rounded hover:bg-gray-100 transition">
                🔗 Share Project
              </button>

              <button
                onClick={() => setIsModalOpen(true)} // Open modal instead of confirm
                className="mt-4 px-4 py-2 text-white font-sans border rounded bg-red-700 hover:bg-red-600 transition">
                Delete Project
              </button>
            </menu>
          </aside>
        </section>

        {/* Right Column */}
        <section className="w-full flex flex-col gap-6 border p-8">
          <EditProject
            id={Number(id)}
            title={title}
            short_description={short_description || ""}
            long_description={long_description || ""}
            competition={competition || ""}
            video_url={video_url || ""}
            image_url={image_url || ""}
            team_members_emails={team_members_emails || []}
          />
        </section>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-sans">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex flex-row gap-1">
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                )}
                {loading ? "Deleting" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
