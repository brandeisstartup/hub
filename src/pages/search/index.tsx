import { useState, useEffect } from "react";
import client from "@/lib/apolloClient";
import contentfulClient from "@/lib/contentful";
import { GET_ALL_PROJECTS } from "@/lib/graphql/queries";
import slugify from "slugify";
import Link from "next/link";
import CustomHead from "@/ui/components/seo/head";

// Define TypeScript Interfaces

function formatImageUrl(url: string): string {
  // If the URL is protocol-relative, add "https:".
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  return url;
}

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
  competition?: string | null;
  image?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
}

interface GraphQLProject {
  id: string;
  title?: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  teamMembers?: User[];
  video_url?: string;
  image_url?: string;
}

export interface ProjectData {
  title: string;
  tagline?: string;
  about?: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  members?: string[];
  teamMembers?: User[];
  video_url?: string;
  imageUrl?: string;
  image_url?: string;
  isContentful?: boolean;
}

// ----- Debounce Hook for Search Input -----
function useDebounce(value: string, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// ----- Skeleton Loader Component -----
function SkeletonLoader() {
  // Using TailwindCSS classes to create pulsating skeleton boxes
  return (
    <ul className="mt-4 grid grid-cols-3 gap-4">
      {Array.from({ length: 17 }).map((_, i) => (
        <li key={i} className="border p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded bg-gray-300 h-24 w-24"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

interface SearchPageProps {
  initialProjects: ProjectData[];
}

export default function SearchPage({ initialProjects }: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [loading, setLoading] = useState(true);

  // Simulate a short loading state on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, []);

  // Filter projects based on search term
  const filteredProjects = initialProjects.filter((project) =>
    project.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <>
      <CustomHead
        title={"Search"}
        description={"Search"}
        url="https://www.brandeisstartup.com"
        image={"/lemberg.webp"}
        imageAlt={"Search"}
        type="website"
        siteName="Brandeis Startup Hub"
        twitterCard="summary_large_image"
      />
      <div className="flex justify-center items-center">
        <div className="p-6 relative w-full max-w-8xl font-sans">
          <h1 className="text-2xl font-bold mb-4">Search Projects</h1>

          {/* Search Input */}
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Search for projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Render Skeleton Loader or Results */}
          {loading ? (
            <SkeletonLoader />
          ) : (
            <ul className="mt-4 grid grid-cols-3 gap-4">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <li
                    key={project.title}
                    className="border p-4 hover:bg-gray-100 transition">
                    <Link
                      href={`/projects/${
                        project.isContentful
                          ? slugify(project.title, {
                              lower: true,
                              strict: true
                            })
                          : slugify(project.title, { strict: true })
                      }`}
                      className="block">
                      <div className="flex items-center space-x-4">
                        {/* Render the image if one is available */}
                        {(project.imageUrl || project.image_url) && (
                          <img
                            src={formatImageUrl(
                              project.imageUrl || project.image_url || ""
                            )}
                            alt="Project Image"
                            className="w-24 h-24 object-cover rounded" // Adjust size here (w-24/h-24)
                          />
                        )}
                        <div>
                          <h2 className="text-xl font-semibold">
                            {project.title}
                          </h2>
                          {project.competition && (
                            <p className="text-sm text-gray-500">
                              Competition: {project.competition}
                            </p>
                          )}
                          <p>
                            {project.short_description ||
                              project.tagline ||
                              "No description available"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <p>No projects found.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

// ----- Fetch Data on Server Side -----
export async function getServerSideProps() {
  // ----- A) FETCH GRAPHQL PROJECTS -----
  let graphqlProjects: GraphQLProject[] = [];
  try {
    const { data } = await client.query({
      query: GET_ALL_PROJECTS,
      fetchPolicy: "no-cache" // ensures fresh data for SSR
    });
    graphqlProjects = data?.projects ?? [];
  } catch (error) {
    console.error("Error fetching projects from GraphQL:", error);
  }

  // ----- B) FETCH CONTENTFUL PROJECTS -----
  let contentfulProjects: FlattenedContentfulFields[] = [];
  try {
    const contentfulResponse = await contentfulClient.getEntries({
      content_type: "projects"
    });
    contentfulProjects = contentfulResponse.items.map(
      (item) => item.fields as unknown as FlattenedContentfulFields
    );
  } catch (error) {
    console.error("Error fetching projects from Contentful:", error);
  }

  // ----- C) MERGE PROJECTS FROM BOTH SOURCES -----
  const mergedMap: Record<string, ProjectData> = {};

  // Add GraphQL projects to the merged map (set isContentful to false)
  graphqlProjects.forEach((gProject) => {
    const slug = slugify((gProject.title || "untitled").toLowerCase(), {
      lower: true,
      strict: true
    });
    mergedMap[slug] = {
      title: gProject.title || "Untitled Project",
      tagline: "",
      about: "",
      short_description: gProject.short_description || "",
      long_description: gProject.long_description || "",
      competition: gProject.competition?.trim() || "",
      members: [],
      teamMembers: gProject.teamMembers || [],
      video_url: gProject.video_url || "",
      imageUrl: gProject.image_url || "",
      isContentful: false
    };
  });

  // Merge Contentful projects into the merged map (set isContentful to true)
  contentfulProjects.forEach((cProject) => {
    const slug = slugify(cProject.title.toLowerCase(), {
      lower: true,
      strict: true
    });
    if (mergedMap[slug]) {
      // Merge fields from Contentful into the existing GraphQL project.
      mergedMap[slug] = {
        title: cProject.title || mergedMap[slug].title,
        tagline: cProject.tagline ?? mergedMap[slug].tagline,
        about: cProject.about ?? mergedMap[slug].about,
        short_description: mergedMap[slug].short_description, // from GraphQL
        long_description: mergedMap[slug].long_description, // from GraphQL
        competition:
          (cProject.competition?.trim() && cProject.competition.trim()) ||
          mergedMap[slug].competition ||
          "",
        members: cProject.members || [],
        teamMembers: mergedMap[slug].teamMembers,
        video_url: mergedMap[slug].video_url,
        imageUrl: cProject.image?.fields?.file?.url || mergedMap[slug].imageUrl,
        isContentful: true
      };
    } else {
      mergedMap[slug] = {
        title: cProject.title,
        tagline: cProject.tagline ?? "",
        about: cProject.about ?? "",
        short_description: "",
        long_description: "",
        competition: cProject.competition?.trim() || "",
        members: cProject.members || [],
        teamMembers: [],
        video_url: "",
        imageUrl: cProject.image?.fields?.file?.url || "",
        isContentful: true
      };
    }
  });

  // Convert mergedMap to an array
  const mergedProjects: ProjectData[] = Object.values(mergedMap);

  return {
    props: {
      initialProjects: mergedProjects
    }
  };
}
