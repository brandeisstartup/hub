// pages/projects/[slug].tsx

import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import QRCode from "qrcode";

// ----- CONTENTFUL TYPES & CLIENT -----
import contentfulClient from "@/lib/contentful";
import { Projectskeleton } from "@/types/used/CompetitionTypes";

// ----- APOLLO CLIENT & QUERY -----
import apolloClient from "@/lib/apolloClient";
import { GET_PROJECT_BY_SLUG } from "@/lib/graphql/queries";

// ----- UI COMPONENTS -----
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import Image from "next/image";

// ----- 1) FLATTENED INTERFACES -----

/** Flattened shape of your Contentful fields (instead of nesting inside `fields`). */
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  imageUrl?: string;
  graduationYear?: number;
  major?: string;
}

interface ContentfulUser {
  fields: {
    id: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    graduationYear?: number;
    major?: string;
    image?: {
      fields: {
        file: {
          url: string;
        };
      };
    };
  };
}

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
  teamMembers?: ContentfulUser[];
}

/** GraphQL shape from your `GET_PROJECT_BY_SLUG` query. */
interface GraphQLProject {
  id: string;
  title?: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  teamMembers?: User[]; // Updated: now an array of User objects
  video_url?: string;
  image_url?: string;
}

interface ProjectData {
  title: string;
  tagline?: string;
  about?: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  members?: string[];
  teamMembers?: (User | ContentfulUser)[];
  video_url?: string;
  imageUrl?: string;
  isFeatured: boolean;
}

// ----- 2) SSR PROPS & PARAMS -----
interface ServerSideProps {
  project: ProjectData;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

// ------------------------------
// Helper to format image URLs
// ------------------------------
function formatImageUrl(url: string): string {
  // If the URL is protocol-relative, add "https:".
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  return url;
}

// ------------------------------
// TYPE GUARD & UNIFY FUNCTIONS
// ------------------------------

/**
 * Type guard to determine if a team member is a ContentfulUser.
 */
function isContentfulUser(
  member: User | ContentfulUser
): member is ContentfulUser {
  return (member as ContentfulUser).fields !== undefined;
}

/**
 * Unify the user data from GraphQL (User) or Contentful (ContentfulUser)
 * into a single, type-safe object that the component can render.
 */
function unifyTeamMember(member: User | ContentfulUser) {
  if (isContentfulUser(member)) {
    // It's a ContentfulUser
    return {
      firstName: member.fields.firstName || "",
      lastName: member.fields.lastName || "",
      bio: member.fields.bio || "",
      graduationYear: member.fields.graduationYear,
      major: member.fields.major,
      imageUrl: member.fields.image?.fields.file.url || ""
    };
  } else {
    // It's a GraphQL User
    return {
      firstName: member.firstName || "",
      lastName: member.lastName || "",
      bio: member.bio || "",
      graduationYear: member.graduationYear,
      major: member.major,
      imageUrl: member.imageUrl || ""
    };
  }
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
    // Debug: Uncomment to inspect the raw response
    // console.log(contentfulResponse);
    // Find the matching item by slug
    const match = contentfulResponse.items.find((item) => {
      return (
        (item.fields.title as string).toLowerCase().replace(/\s+/g, "-") ===
        slug
      );
    });
    // Flatten its fields if found
    if (match) {
      contentfulFlattened = {
        title: match.fields.title,
        tagline: match.fields.tagline,
        about: match.fields.about,
        members: match.fields.members,
        image: match.fields.image,
        teamMembers: match.fields.teamMembers // New complex object field
      };
      // Debug: console.log(contentfulFlattened.teamMembers);
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
    title:
      contentfulFlattened?.title || graphQLProject?.title || "Untitled Project",
    tagline:
      contentfulFlattened?.tagline || graphQLProject?.short_description || "",
    about: contentfulFlattened?.about ?? "",
    short_description:
      graphQLProject?.short_description || contentfulFlattened?.tagline || "",
    long_description: graphQLProject?.long_description ?? "",
    competition: graphQLProject?.competition ?? "",
    members: contentfulFlattened?.members ?? [],
    teamMembers:
      contentfulFlattened?.teamMembers || graphQLProject?.teamMembers || [],
    video_url: graphQLProject?.video_url ?? "",
    imageUrl:
      contentfulFlattened?.image?.fields?.file?.url ||
      graphQLProject?.image_url,
    isFeatured: contentfulFlattened ? true : false
  };

  return {
    props: {
      project: mergedData
    }
  };
};

// ----- 4) PAGE COMPONENT -----
export default function ProjectPage({ project }: ServerSideProps) {
  console.log(project);
  const {
    title,
    tagline,
    about,
    short_description,
    long_description,
    competition,
    teamMembers,
    video_url,
    imageUrl
  } = project;

  // Generate and download QR Code for the current URL
  const downloadQRCode = async () => {
    if (typeof window !== "undefined") {
      try {
        const currentUrl = window.location.href;
        const qrDataUrl = await QRCode.toDataURL(currentUrl);
        const link = document.createElement("a");
        link.href = qrDataUrl;
        link.download = `${title}-qr-code.png`;
        link.click();
      } catch (error) {
        console.error("Error generating QR Code", error);
      }
    }
  };

  return (
    <main className="py-24 font-sans">
      <div className="mx-auto max-w-8xl px-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
        {/* Left Column */}
        <section
          id="fixed"
          className="w-full h-fit lg:max-h-[90vh] overflow-auto lg:overflow-visible">
          <Heading label={title} />

          <dd className="flex flex-row gap-1 font-sans flex-wrap">
            By:
            {(teamMembers || []).map((member, index) => {
              const unified = unifyTeamMember(member);
              return (
                <dl key={index}>
                  {unified.firstName} {unified.lastName}
                </dl>
              );
            })}
          </dd>

          {competition && (
            <p className="font-sans leading-8 text-sm">
              <span className="font-semibold">Competition:</span> {competition}
            </p>
          )}

          {/* Render main project image if available */}
          {imageUrl && (
            <img
              src={formatImageUrl(imageUrl)}
              alt="Project Image"
              className="w-full mt-5"
            />
          )}

          {/* Share, Copy Link, and QR Code Buttons */}
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
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("🔗 Project link copied to clipboard!");
                }}
                className="mt-4 px-4 py-2 font-sans border rounded hover:bg-gray-100 transition">
                📋 Copy Link
              </button>

              <button
                onClick={downloadQRCode}
                className="mt-4 px-4 py-2 font-sans border rounded hover:bg-gray-100 transition">
                📥 QR Code
              </button>
            </menu>
          </aside>
        </section>

        {/* Right Column */}
        <section className="w-full flex flex-col gap-20">
          {/* Combined descriptions */}
          <div>
            <Heading label="Project Description" />
            {!project.isFeatured && tagline && (
              <p className="my-6 text-lg leading-8 text-gray-600">{tagline}</p>
            )}
            {project.isFeatured && short_description && !long_description && (
              <p className="my-6 text-lg leading-8 text-gray-600">
                {short_description}
              </p>
            )}
            {about && (
              <p className="my-6 text-lg leading-8 text-gray-600">{about}</p>
            )}
            {long_description && (
              <p className="my-6 text-lg leading-8 text-gray-600">
                {long_description}
              </p>
            )}
          </div>

          {/* Possibly show video from GraphQL */}
          {video_url && (
            <div>
              <Heading label="Video" />
              <div className="relative w-full aspect-video mt-5">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video_url}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          )}
          {(teamMembers || []).map((member, index) => {
            const unified = unifyTeamMember(member);
            return (
              <dl key={index} className="flex mt-2">
                <div className="flex flex-row gap-2 font-sans">
                  <div className="w-24 h-24">
                    <Image
                      src={formatImageUrl(
                        unified.imageUrl || "/default-image.png"
                      )}
                      alt={`${unified.firstName} ${unified.lastName}`}
                      width={96}
                      height={96}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold">
                      {unified.firstName} {unified.lastName}
                    </div>
                    <div>
                      {unified.major && unified.graduationYear
                        ? `${unified.major} ${unified.graduationYear}`
                        : ""}
                    </div>
                    <div className="max-w-2xl">{unified.bio}</div>
                  </div>
                </div>
              </dl>
            );
          })}
        </section>
      </div>
    </main>
  );
}
