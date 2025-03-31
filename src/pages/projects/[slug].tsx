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
  teamMembers?: User[]; // Updated as well
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
    title:
      contentfulFlattened?.title || graphQLProject?.title || "Untitled Project",
    tagline: contentfulFlattened?.tagline ?? "",
    about: contentfulFlattened?.about ?? "",
    short_description: graphQLProject?.short_description ?? "",
    long_description: graphQLProject?.long_description ?? "",
    competition: graphQLProject?.competition ?? "",
    members: contentfulFlattened?.members ?? [],
    teamMembers: graphQLProject?.teamMembers ?? [], // NEW: Full team members data from GraphQL
    video_url: graphQLProject?.video_url ?? "",
    imageUrl:
      contentfulFlattened?.image?.fields?.file?.url || graphQLProject?.image_url
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
    members,
    teamMembers,
    video_url,
    imageUrl
  } = project;

  // Function to generate and download the QR Code for the current URL
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
    <main className="py-24">
      <div className="mx-auto max-w-8xl px-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
        {/* Left Column */}
        <section
          id="fixed"
          className=" w-full  h-fit lg:max-h-[90vh] overflow-auto lg:overflow-visible ">
          <Heading label={title} />

          <dd className="flex flex-row gap-1 font-sans flex-wrap">
            By:
            {(members || []).map((member) => (
              <dl key={member}>{member}</dl>
            ))}
            {(teamMembers || []).map((member, index) => (
              <dl key={index}>{member.firstName + " " + member.lastName}</dl>
            ))}
          </dd>
          {competition && (
            <p className="font-sans leading-8 text-sm">
              <span className="font-semibold">Competition:</span> {competition}
            </p>
          )}

          {/* Render image if available from Contentful */}
          {imageUrl && (
            <img src={imageUrl} alt="Project Image" className="w-full mt-5" />
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
        <section className="w-full flex flex-col gap-6">
          {/* Combined descriptions */}
          <div className="">
            <Heading label="Project Description" />
            {tagline && (
              <p className="my-6 text-lg leading-8 text-gray-600">{tagline}</p>
            )}
            {short_description && !long_description && (
              <p className="my-6 text-lg leading-8 text-gray-600">
                {short_description}
              </p>
            )}
            {about && (
              <p className="my-6 text-lg leading-8 text-gray-600">{about}</p>
            )}

            {/* Show GraphQL fields if they exist */}
            {long_description && (
              <p className="my-6 text-lg leading-8 text-gray-600">
                {long_description}
              </p>
            )}
          </div>

          {/* Possibly show video from GraphQL */}
          {video_url && (
            <div className="">
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

          {/* Combine or list both sets of team members */}
          <div className="">
            <Heading label="Team Members" />
            <dd className="list-disc list-inside">
              {(members || []).map((member, index) => (
                <dl key={index} className="flex mt-2">
                  <div className="flex flex-row gap-2">
                    <div className="w-24 h-24 bg-BrandeisBrandShade"></div>
                    <div className="flex flex-col gap-1 justify-around py-2">
                      <div>{member}</div>
                      <div>Year/Major</div>
                      <div className="max-w-2xl text-wrap">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Ex minus beatae quod modi! Quaerat aspernatur ad,
                        quam dolorum voluptate assumenda esse id illo quis magni
                        quibusdam commodi atque, praesentium omnis?
                      </div>
                    </div>
                  </div>
                </dl>
              ))}
              {(teamMembers || []).map((member, index) => (
                <dl key={index} className="flex mt-2">
                  <div className="flex flex-row gap-2">
                    <div className="w-24 h-24">
                      <Image
                        src={member.imageUrl || "/default-image.png"}
                        alt={`${member.firstName} ${member.lastName}`}
                        width={96}
                        height={96}
                      />
                    </div>
                    <div className="flex flex-col gap-1 ">
                      <div>{member.firstName + " " + member.lastName}</div>
                      <div>
                        {member.graduationYear &&
                          member.major &&
                          member.major + " " + member.graduationYear}
                      </div>
                      <div className="max-w-2xl">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Ex minus beatae quod modi.
                      </div>
                    </div>
                  </div>
                </dl>
              ))}
            </dd>
          </div>
        </section>
      </div>
    </main>
  );
}
