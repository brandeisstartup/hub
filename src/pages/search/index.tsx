import { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import client from "@/lib/apolloClient";
import contentfulClient from "@/lib/contentful";
import { GET_ALL_PROJECTS } from "@/lib/graphql/queries";
import slugify from "slugify";
import Link from "next/link";
import { useCompetitions } from "@/context/EventContext";
import { CompetitionFields } from "@/types/used/CompetitionTypes";
import Image from "next/image";
import Breadcrumb, {
  BreadcrumbItem
} from "@/ui/components/brandeisBranding/breadcrumbs";

// Helper: ensure protocol on Contentful image URLs
function formatImageUrl(url: string): string {
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  return url;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Skeleton loader for initial loading state
function SkeletonLoader() {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-4">
      {Array.from({ length: 17 }).map((_, i) => (
        <li key={i} className="border p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded bg-gray-300 h-24 w-24" />
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

// TypeScript interfaces
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
  videoUrl?: string;
  image?: { fields: { file: { url: string } } };
  createdAt: string; // pulled from sys.createdAt
}

interface GraphQLProject {
  id: string;
  title?: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  created_date?: string;
  teamMembers?: User[];
  video_url?: string;
  image_url?: string;
}

export interface ProjectData {
  id?: string;
  title: string;
  tagline?: string;
  about?: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  created_date?: string;
  createdAt?: string;
  members?: string[];
  teamMembers?: User[];
  video_url?: string;
  imageUrl?: string;
  isContentful?: boolean;
}

interface SearchPageProps {
  initialProjects: ProjectData[];
}

function parseYear(raw: string): string {
  if (!raw) return "N/A";
  let ms: number;

  // purely numeric? assume seconds if ≤10 digits, else milliseconds
  if (/^\d+$/.test(raw)) {
    ms = raw.length <= 10 ? Number(raw) * 1000 : Number(raw);
  } else {
    // ISO‑string or other
    const parsed = Date.parse(raw);
    ms = isNaN(parsed) ? 0 : parsed;
  }

  const d = new Date(ms);
  return isNaN(d.getTime()) ? "N/A" : d.getFullYear().toString();
}

export default function SearchPage({ initialProjects }: SearchPageProps) {
  const { competitions, loading: compLoading } = useCompetitions();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<{
    [group: string]: string[];
  }>({ Year: [], Competition: [] });

  const crumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Projects" }
  ];

  // simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const startYear = 2024;
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => (startYear + i).toString()
  );
  const competitionOptions = compLoading
    ? []
    : competitions.map((c: CompetitionFields) => c.title.trim());

  const FILTERS = {
    Year: yearOptions,
    Competition: competitionOptions
  };

  const handleFilterChange = (group: string, value: string) => {
    setSelectedFilters((prev) => {
      const set = new Set(prev[group] || []);
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
      return {
        ...prev,
        [group]: Array.from(set)
      };
    });
  };

  const filteredProjects = initialProjects.filter((project) => {
    // 1) trim & lowercase once
    const cleanSearch = debouncedSearchTerm.trim().toLowerCase();

    // 2) title match
    const title = project.title.trim().toLowerCase();
    let ok = title.includes(cleanSearch);

    // 3) competition filter (if applied)
    if (ok && selectedFilters.Competition.length) {
      // trim any whitespace on the project’s competition
      const comp = project.competition?.trim() ?? "";
      // also trim the selected filter values just in case
      const active = selectedFilters.Competition.map((v) => v.trim());
      ok = active.includes(comp);
    }

    // 4) year filter (unchanged, since years don’t have spaces)
    if (ok && selectedFilters.Year.length) {
      const raw = project.createdAt || project.created_date || "";
      const year = parseYear(raw);
      ok = selectedFilters.Year.includes(year);
    }

    return ok;
  });

  return (
    <>
      <div className=" w-full ">
        <div className="max-w-8xl mx-auto p-6 font-sans mt-5">
          {" "}
          <Breadcrumb items={crumbs} />
        </div>
      </div>
      <div className="max-w-8xl mx-auto p-6 font-sans">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-60">
            <input
              type="text"
              className="border rounded p-2 w-full text-sm mb-4"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <h2 className="text-lg font-medium mb-2">Filter Projects</h2>
            <div className="space-y-4">
              {Object.entries(FILTERS).map(([group, opts]) => (
                <Disclosure key={group} defaultOpen>
                  {() => (
                    <div className="border rounded p-2">
                      <Disclosure.Button className="w-full text-left font-semibold">
                        {group}
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2">
                        {opts.map((opt) => {
                          const isSel =
                            selectedFilters[group]?.includes(opt) || false;
                          return (
                            <label
                              key={opt}
                              className="flex items-center mb-2 text-sm ">
                              <input
                                type="checkbox"
                                checked={isSel}
                                className="mr-2"
                                onChange={() => handleFilterChange(group, opt)}
                              />
                              {opt}
                            </label>
                          );
                        })}
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>
              ))}
            </div>
          </div>
          <div
            className="  flex-1 flex flex-col 
    min-h-[750px] 
    flex-shrink-0 
    xs:min-w-full 
    sm:min-w-[690px] 
    lg:min-w-[1060px] mb-20
">
            {/* <h1 className="text-3xl font-medium mb-2">Startup Hub Search</h1> */}
            {/* <p className="text-gray-700 mb-6">
            Jumpstart your app development process with pre-built solutions from
            Vercel and our community.
          </p> */}
            <div className="flex-1 l">
              {loading ? (
                <SkeletonLoader />
              ) : (
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredProjects.length ? (
                    filteredProjects.map((project) => {
                      const raw =
                        project.createdAt || project.created_date || "";
                      const year = parseYear(raw);

                      // —— DESCRIPTION TRUNCATION LOGIC ——
                      const fullDesc =
                        project.short_description || project.tagline || "";
                      const maxLen = 100;
                      const isLong = fullDesc.length > maxLen;
                      const summary = isLong
                        ? fullDesc.slice(0, maxLen).trimEnd() + "…"
                        : fullDesc;

                      // —— SLUG FOR “READ MORE” LINK ——
                      const slug = project.isContentful
                        ? slugify(project.title, { lower: true, strict: true })
                        : slugify(project.title, { strict: true });

                      return (
                        <li
                          key={project.title}
                          className="border hover:bg-gray-100 transition">
                          <Link href={`/projects/${slug}`} className="block">
                            <div className="flex items-start space-x-4">
                              {/* Image */}
                              <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden ">
                                {project.imageUrl != "" || project.imageUrl ? (
                                  <Image
                                    src={`${project.imageUrl}`}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                  />
                                ) : (
                                  // fallback gradient + title
                                  <div
                                    className="
                                  flex items-center justify-center
                                  w-full h-full
                                  text-white text-xs font-semibold text-center p-2
                                  bg-gradient-to-br
                                  from-blue-800
                                  to-blue-600
                                ">
                                    {project.title}
                                  </div>
                                )}
                              </div>

                              {/* Text */}
                              <div className="flex-1">
                                <h2 className="text-md font-semibold mt-2">
                                  {project.title}{" "}
                                </h2>
                                <span className="text-sm text-gray-500 ">
                                  {year}
                                </span>
                                <p className="text-sm text-gray-700 mt-1">
                                  {summary}
                                </p>

                                {isLong && (
                                  <Link
                                    href={`/projects/${slug}`}
                                    className="text-blue-500 text-xs hover:underline  block">
                                    Read more
                                  </Link>
                                )}
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p>No projects found.</p>
                    </div>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  // 1) Fetch GraphQL projects
  let graphqlProjects: GraphQLProject[] = [];
  try {
    const { data } = await client.query({
      query: GET_ALL_PROJECTS,
      fetchPolicy: "no-cache"
    });
    graphqlProjects = data?.projects ?? [];
  } catch (err) {
    console.error("Error fetching GraphQL projects:", err);
  }

  // 2) Fetch Contentful projects and force‑cast to FlattenedContentfulFields[]
  let contentfulProjects: FlattenedContentfulFields[] = [];
  try {
    const resp = await contentfulClient.getEntries({
      content_type: "projects"
    });

    contentfulProjects = resp.items.map((item) => ({
      title: String(item.fields.title),
      tagline: item.fields.tagline as string,
      about: item.fields.about as string,
      members: item.fields.members as string[],
      competition: item.fields.competition as string | null,
      videoUrl: item.fields.videoUrl as string,
      image: item.fields.image as { fields: { file: { url: string } } },
      createdAt: item.sys.createdAt
    })) as FlattenedContentfulFields[];
  } catch (err) {
    console.error("Error fetching Contentful projects:", err);
  }

  // 3) Merge GraphQL + Contentful into a single map by slug
  const mergedMap: Record<string, ProjectData> = {};

  graphqlProjects.forEach((g) => {
    const slug = slugify((g.title || "untitled").toLowerCase(), {
      lower: true,
      strict: true
    });
    mergedMap[slug] = {
      id: g.id,
      title: g.title || "Untitled Project",
      short_description: g.short_description || "",
      long_description: g.long_description || "",
      competition: g.competition || "",
      created_date: g.created_date || "",
      teamMembers: g.teamMembers || [],
      video_url: g.video_url || "",
      imageUrl: g.image_url || "",
      isContentful: false
    };
  });

  contentfulProjects.forEach((c) => {
    const slug = slugify(c.title.toLowerCase(), {
      lower: true,
      strict: true
    });

    if (mergedMap[slug]) {
      mergedMap[slug] = {
        ...mergedMap[slug],
        short_description: c.tagline ?? mergedMap[slug].tagline,
        about: c.about ?? mergedMap[slug].about,
        competition: c.competition ?? mergedMap[slug].competition,
        createdAt: c.createdAt,
        video_url: c.videoUrl ?? mergedMap[slug].video_url,
        imageUrl: c.image?.fields?.file?.url
          ? formatImageUrl(c.image.fields.file.url)
          : "",

        isContentful: true
      };
    } else {
      mergedMap[slug] = {
        title: c.title,
        short_description: c.tagline ?? "",
        about: c.about ?? "",
        competition: c.competition ?? "",
        createdAt: c.createdAt,
        video_url: c.videoUrl ?? "",
        imageUrl: c.image?.fields?.file?.url
          ? formatImageUrl(c.image.fields.file.url)
          : "",

        isContentful: true
      };
    }
  });

  return {
    props: {
      initialProjects: Object.values(mergedMap)
    }
  };
}
