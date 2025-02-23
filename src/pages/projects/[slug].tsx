// pages/projects/[slug].tsx

import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";

// ----- CONTENTFUL TYPES & CLIENT -----
import contentfulClient from "@/lib/contentful";
import { Projectskeleton } from "@/types/used/CompetitionTypes";

// ----- APOLLO CLIENT & QUERY -----
import apolloClient from "@/lib/apolloClient";
import { GET_PROJECT_BY_SLUG } from "@/lib/graphql/queries";

// ----- UI COMPONENTS -----
import Heading from "@/ui/components/brandeisBranding/headings/heading";

// ----- 1) FLATTENED INTERFACES -----

/** Flattened shape of your Contentful fields (instead of nesting inside `fields`). */
interface FlattenedContentfulFields {
  title: string;
  tagline?: string;
  about?: string;
  members?: string[];
  image?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
}

/** GraphQL shape from your `GET_PROJECT_BY_SLUG` query. */
interface GraphQLProject {
  id: string;
  title?: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  team_members_emails?: string[];
  video_url?: string;
}

/** Final shape for the page to render. */
interface ProjectData {
  title: string;
  tagline?: string;
  about?: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  members?: string[];
  team_members_emails?: string[];
  video_url?: string;
  imageUrl?: string;
}

// ----- 2) SSR PROPS & PARAMS -----
interface ServerSideProps {
  project: ProjectData;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

// ----- 3) GET SERVER SIDE PROPS -----
export const getServerSideProps: GetServerSideProps<
  ServerSideProps,
  Params
> = async ({ params }) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  const { slug } = params;

  // -- A) FETCH FROM CONTENTFUL (STORE FLATTENED) --
  let contentfulFlattened: FlattenedContentfulFields | null = null;

  try {
    const contentfulResponse =
      await contentfulClient.getEntries<Projectskeleton>({
        content_type: "projects"
      });

    // 1) Find the matching item by slug
    const match = contentfulResponse.items.find((item) => {
      return (
        (item.fields.title as string).toLowerCase().replace(/\s+/g, "-") ===
        slug
      );
    });

    // 2) Flatten its fields into `contentfulFlattened` if found
    if (match) {
      contentfulFlattened = {
        title: match.fields.title,
        tagline: match.fields.tagline,
        about: match.fields.about,
        members: match.fields.members,
        image: match.fields.image
      };
    }
  } catch (err) {
    console.error("Error fetching from Contentful:", err);
  }

  // -- B) FETCH FROM GRAPHQL (STORE DIRECTLY) --
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

  // If both are null, return 404
  if (!contentfulFlattened && !graphQLProject) {
    return { notFound: true };
  }

  // -- C) MERGE INTO A SINGLE ProjectData SHAPE --
  const mergedData: ProjectData = {
    // 1) Title: prefer Contentful, fallback GraphQL
    title:
      contentfulFlattened?.title || graphQLProject?.title || "Untitled Project",

    // 2) Tagline & About from Contentful (if any)
    tagline: contentfulFlattened?.tagline ?? "",
    about: contentfulFlattened?.about ?? "",

    // 3) Descriptions from GraphQL
    short_description: graphQLProject?.short_description ?? "",
    long_description: graphQLProject?.long_description ?? "",
    competition: graphQLProject?.competition ?? "",

    // 4) Combine or keep separate (here, we keep them separate)
    members: contentfulFlattened?.members ?? [],
    team_members_emails: graphQLProject?.team_members_emails ?? [],

    // 5) Video from GraphQL
    video_url: graphQLProject?.video_url ?? "",

    // 6) Flattened image URL from Contentful
    imageUrl: contentfulFlattened?.image?.fields?.file?.url ?? ""
  };

  return {
    props: {
      project: mergedData
    }
  };
};

// ----- 4) PAGE COMPONENT -----
export default function ProjectPage({ project }: ServerSideProps) {
  const {
    title,
    tagline,
    about,
    short_description,
    long_description,
    competition,
    members,
    team_members_emails,
    video_url,
    imageUrl
  } = project;

  return (
    <div className="py-24 sm:pt-32">
      <div className="mx-auto max-w-8xl px-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
        {/* Left Column */}
        <div
          id="fixed"
          className="w-full lg:sticky lg:top-36 h-fit lg:max-h-[90vh] overflow-auto lg:overflow-visible p-4">
          <Heading label={title} />

          {tagline && (
            <p className="my-6 text-lg leading-8 text-gray-600">{tagline}</p>
          )}

          {competition && (
            <p className="my-6 text-lg leading-8 text-gray-600">
              Competition: {competition}
            </p>
          )}

          {/* Render image if available from Contentful */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Project Image"
              className="w-full max-w-lg rounded-lg"
            />
          )}
        </div>

        {/* Right Column */}
        <section className="w-full flex flex-col gap-6 lg:max-h-[90vh]">
          {/* Combined descriptions */}
          <div className="p-4">
            <Heading label="Project Description" />
            {about && (
              <p className="my-6 text-lg leading-8 text-gray-600">{about}</p>
            )}
            {/* Show GraphQL fields if they exist */}
            {long_description && (
              <p className="my-6 text-lg leading-8 text-gray-600">
                {long_description}
              </p>
            )}
            {short_description && !long_description && (
              <p className="my-6 text-lg leading-8 text-gray-600">
                {short_description}
              </p>
            )}
          </div>

          {/* Possibly show video from GraphQL */}
          {video_url && (
            <div className="p-4">
              <Heading label="Video" />
              <div className="relative w-full aspect-video">
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${video_url}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Combine or list both sets of team members */}
          <div className="p-4">
            <Heading label="Team Members" />
            <ul className="list-disc list-inside">
              {(members || []).map((member) => (
                <li key={member}>{member}</li>
              ))}
              {(team_members_emails || []).map((email) => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
