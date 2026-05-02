import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";

import contentfulClient from "@/lib/contentful";
import { Projectskeleton } from "@/types/used/CompetitionTypes";

import apolloClient from "@/lib/apolloClient";
import { GET_PROJECT_BY_SLUG } from "@/lib/graphql/queries";

import Heading from "@/ui/components/brandeisBranding/headings/heading";
import Image from "next/image";
import CustomHead from "@/ui/components/seo/head";
import Breadcrumb, {
  BreadcrumbItem
} from "@/ui/components/brandeisBranding/breadcrumbs";

import { formatImageUrl, slugifyTitle } from "@/utils";

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
  videoUrl?: string;
  image?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  teamMembers?: ContentfulUser[];
  video_url?: string;
}

/** GraphQL shape from your `GET_PROJECT_BY_SLUG` query. */
interface GraphQLProject {
  id: string;
  title?: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  team_members_emails?: string[];
  teamMembers?: User[];
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
  team_members_emails?: string[];
  teamMembers?: (User | ContentfulUser)[];
  video_url?: string;
  imageUrl?: string;
  isFeatured: boolean;
}

interface ServerSideProps {
  project: ProjectData;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

function isContentfulUser(
  member: User | ContentfulUser
): member is ContentfulUser {
  return (member as ContentfulUser).fields !== undefined;
}

function unifyTeamMember(member: User | ContentfulUser) {
  if (isContentfulUser(member)) {
    return {
      firstName: member.fields.firstName || "",
      lastName: member.fields.lastName || "",
      bio: member.fields.bio || "",
      graduationYear: member.fields.graduationYear,
      major: member.fields.major,
      imageUrl: member.fields.image?.fields.file.url || ""
    };
  } else {
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

export const getServerSideProps: GetServerSideProps<
  ServerSideProps,
  Params
> = async ({ params }) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  const { slug } = params;

  let contentfulFlattened: FlattenedContentfulFields | null = null;

  try {
    const contentfulResponse =
      await contentfulClient.getEntries<Projectskeleton>({
        content_type: "projects"
      });

    const match = contentfulResponse.items.find((item) => {
      return slugifyTitle(item.fields.title as string) === slugifyTitle(slug);
    });

    if (match) {
      contentfulFlattened = {
        title: match.fields.title,
        tagline: match.fields.tagline,
        about: match.fields.about,
        members: match.fields.members,
        image: match.fields.image,
        teamMembers: match.fields.teamMembers,
        video_url: match.fields.videoUrl
      };
    }
  } catch (err) {
    console.error("Error fetching from Contentful:", err);
  }

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

  if (!contentfulFlattened && !graphQLProject) {
    return { notFound: true };
  }

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
    team_members_emails:
      graphQLProject?.team_members_emails || contentfulFlattened?.members || [],
    teamMembers:
      contentfulFlattened?.teamMembers || graphQLProject?.teamMembers || [],
    video_url:
      graphQLProject?.video_url ||
      contentfulFlattened?.videoUrl ||
      contentfulFlattened?.video_url ||
      "",
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

export default function ProjectPage({ project }: ServerSideProps) {
  const {
    title,
    tagline,
    about,
    short_description,
    long_description,
    competition,
    teamMembers,
    team_members_emails,
    video_url,
    imageUrl
  } = project;

  // 1. Unify and de-duplicate registered profiles
  const registeredProfiles = (teamMembers || []).reduce((acc, curr) => {
    const email = (isContentfulUser(curr) ? curr.fields.id : curr.email)?.toLowerCase();
    if (!email) return acc;

    // Avoid duplicates in the profile list itself
    if (!acc.some(m => (isContentfulUser(m) ? m.fields.id : m.email)?.toLowerCase() === email)) {
      acc.push(curr);
    }
    return acc;
  }, [] as (User | ContentfulUser)[]);

  // 2. Identify strings in teammate list that aren't represented by a profile
  const pendingEntries = (team_members_emails || [])
    .filter(entry => {
      if (!entry) return false;
      const normalizedEntry = entry.trim().toLowerCase();

      // Is this entry (name or email) already represented by one of our full profiles?
      const isAlreadyRepresented = registeredProfiles.some(m => {
        const unified = unifyTeamMember(m);
        const mEmail = (isContentfulUser(m) ? m.fields.id : m.email)?.toLowerCase();
        const mFullName = `${unified.firstName} ${unified.lastName}`.trim().toLowerCase();
        
        // Match if the entry is the user's email OR their full name
        return mEmail === normalizedEntry || mFullName === normalizedEntry;
      });

      return !isAlreadyRepresented;
    })
    // Also de-duplicate the pending list itself (case-insensitive)
    .filter((entry, index, self) => 
      self.findIndex(e => e.trim().toLowerCase() === entry.trim().toLowerCase()) === index
    );

  const crumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/search" },
    { label: project.title }
  ];

  return (
    <>
      <CustomHead
        title={project.title}
        description={short_description}
        image={imageUrl}
        imageAlt={project.title}
        type="article"
        siteName={project.title}
        twitterCard="summary_large_image"
      />
      <div className=" w-full ">
        <div className="max-w-8xl mx-auto p-6 font-sans">
          {" "}
          <Breadcrumb items={crumbs} />
        </div>
      </div>
      <main className="py-6 font-sans">
        <div className="mx-auto max-w-8xl px-4 md:px-8 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
          {/* Left Column */}
          <section
            id="fixed"
            className="border p-8 w-full h-fit lg:max-h-[90vh] overflow-auto lg:overflow-visible">
            <Heading label={title} />

            <dd className="flex flex-row gap-1 font-sans flex-wrap">
              By:
              {registeredProfiles.map((member, index) => {
                const unified = unifyTeamMember(member);
                const displayName = (unified.firstName || unified.lastName) 
                  ? `${unified.firstName} ${unified.lastName}`.trim()
                  : (isContentfulUser(member) ? member.fields.id : member.email);

                return (
                  <dl key={index}>
                    {displayName}
                    {index < registeredProfiles.length - 1 || pendingEntries.length > 0
                      ? ", "
                      : ""}
                  </dl>
                );
              })}
              {pendingEntries.map((entry, index) => (
                <dl key={entry}>
                  {entry}
                  {index < pendingEntries.length - 1 ? ", " : ""}
                </dl>
              ))}
            </dd>

            {!project.isFeatured && tagline && (
              <p className="my-6 ">{tagline}</p>
            )}
            {project.isFeatured && short_description && !long_description && (
              <p className="my-6 ">{short_description}</p>
            )}

            {competition && (
              <p className="font-sans leading-8 text-sm">
                <span className="font-semibold">Competition:</span>{" "}
                {competition}
              </p>
            )}

            {imageUrl && (
              <img
                src={formatImageUrl(imageUrl)}
                alt="Project Image"
                className="w-full mt-5 "
              />
            )}

            {(imageUrl == "" || !imageUrl) && (
              <div
                className="
                                  flex items-center justify-center
                                  w-full h-[400px]
                                  text-white text-4xl font-semibold text-center p-2
                                  bg-gradient-to-br
                                  from-blue-800
                                  to-blue-600
                                ">
                {project.title}
              </div>
            )}

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
              </menu>
            </aside>
          </section>

          {/* Right Column */}
          <section className="w-full flex flex-col gap-10 border p-8">
            <div>
              <Heading label="Project Description" />

              {about && (
                <p className="my-3 text-lg leading-8 text-gray-600">{about}</p>
              )}
              {long_description && (
                <p className="my-3 text-lg leading-8 text-gray-600">
                  {long_description}
                </p>
              )}
            </div>
            <hr />
            {video_url && (
              <>
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
                <hr />
              </>
            )}
            <div className="flex gap-4 flex-col">
              <Heading label="Team Members" />
              {registeredProfiles.map((member, index) => {
                const unified = unifyTeamMember(member);
                const email = isContentfulUser(member) ? member.fields.id : member.email;
                const displayName = (unified.firstName || unified.lastName)
                  ? `${unified.firstName} ${unified.lastName}`.trim()
                  : email;

                return (
                  <dl key={index} className="flex mt-2">
                    <div className="flex flex-row gap-2 font-sans">
                      <div className="w-24 h-24">
                        <Image
                          src={formatImageUrl(
                            unified.imageUrl || "/default-image.png"
                          )}
                          alt={displayName}
                          width={96}
                          height={96}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="font-semibold">
                          {displayName}
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
              {pendingEntries.map((entry) => (
                <dl key={entry} className="flex mt-2">
                  <div className="flex flex-row gap-2 font-sans">
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-200 text-gray-400">
                      <svg
                        className="w-12 h-12"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1 justify-center">
                      <div className="font-semibold">{entry}</div>
                      <div className="text-sm text-gray-500 italic">
                        Pending registration
                      </div>
                    </div>
                  </div>
                </dl>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
