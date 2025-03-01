import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import EditProject from "@/ui/components/forms/complete-forms/edit-project";

// ----- APOLLO CLIENT & QUERY -----
import apolloClient from "@/lib/apolloClient";
import { GET_PROJECT_BY_SLUG } from "@/lib/graphql/queries";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

// ----- Custom Delete Hook -----
import { useDeleteProject } from "@/hooks/useDeleteProject";

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
  imageUrl?: string;
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

  // ----- FETCH FROM GRAPHQL -----
  let graphQLProject: GraphQLProject | null = null;
  try {
    const { data } = await apolloClient.query({
      query: GET_PROJECT_BY_SLUG,
      variables: { slug },
      fetchPolicy: "no-cache" // ensures fresh data for SSR
    });
    graphQLProject = data?.project || null;
  } catch (err) {
    console.error("Error fetching from GraphQL:", err);
  }

  // If no data was fetched, return 404
  if (!graphQLProject) {
    return { notFound: true };
  }

  // ----- MERGE DATA INTO A SINGLE ProjectData SHAPE -----
  const mergedData: ProjectData = {
    id: graphQLProject.id,
    title: graphQLProject.title || "Untitled Project",
    short_description: graphQLProject.short_description || "",
    long_description: graphQLProject.long_description || "",
    competition: graphQLProject.competition || "",
    team_members_emails: graphQLProject.team_members_emails || [],
    video_url: graphQLProject.video_url || "",
    imageUrl: graphQLProject.image_url || ""
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
    imageUrl
  } = project;
  const router = useRouter();
  const { deleteProject, error } = useDeleteProject();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(Number(id));
        // Redirect to project list page after deletion
        router.push("/search");
      } catch (err) {
        console.error("Failed to delete project:", err, error);
        alert("Failed to delete project. Please try again.");
      }
    }
  };

  return (
    <main className="py-24">
      <div className="mx-auto max-w-8xl px-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
        {/* Left Column */}
        <section
          id="fixed"
          className="w-full lg:sticky lg:top-36 h-fit lg:max-h-[90vh] overflow-auto lg:overflow-visible">
          <Heading label={title} />

          <dd className="flex flex-row gap-1 font-sans flex-wrap">By:</dd>

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
                onClick={handleDelete}
                className="mt-4 px-4 py-2 text-white font-sans border rounded bg-red-700 hover:bg-red-600 transition">
                Delete Project
              </button>
            </menu>
          </aside>
        </section>

        {/* Right Column */}
        <section className="w-full flex flex-col gap-6">
          <EditProject
            id={Number(id)}
            title={title}
            short_description={short_description || ""}
            long_description={long_description || ""}
            competition={competition || ""}
            video_url={video_url || ""}
            imageUrl={imageUrl || ""}
          />
        </section>
      </div>
    </main>
  );
}
