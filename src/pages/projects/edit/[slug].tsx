import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";

import EditProject from "@/ui/components/forms/complete-forms/edit-project";

// ----- APOLLO CLIENT & QUERY -----
import apolloClient from "@/lib/apolloClient";
import { GET_PROJECT_BY_SLUG } from "@/lib/graphql/queries";

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

  // Function to generate and download the QR Code for the current URL

  return (
    <main className="py-24">
      <div className="mx-auto max-w-4xl px-4 grid grid-cols-1 font-sans ">
        <EditProject
          id={Number(id)}
          title={title}
          short_description={short_description || ""}
          long_description={long_description || ""}
          competition={competition || ""}
          video_url={video_url || ""}
          imageUrl={imageUrl || ""}
        />
      </div>
    </main>
  );
}
