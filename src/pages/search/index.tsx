import { useState, useEffect } from "react";
import client from "@/lib/apolloClient";
import {
  FlattenedContentfulFields,
  GraphQLProject,
  ProjectData,
  SearchPageProps
} from "@/types/search-types";
import contentfulClient from "@/lib/contentful";
import { GET_ALL_PROJECTS } from "@/lib/graphql/queries";
import slugify from "slugify";
import { useCompetitions } from "@/context/EventContext";
import { CompetitionFields } from "@/types/used/CompetitionTypes";
import { formatImageUrl, parseYear } from "@/utils";
import SearchLayout from "@/ui/components/organisms/search/search-panel";

function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchPage({ initialProjects }: SearchPageProps) {
  const { competitions, loading: compLoading } = useCompetitions();
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const saved = sessionStorage.getItem("projectSearchState");
      return saved ? JSON.parse(saved).searchTerm : "";
    } catch {
      return "";
    }
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<FilterGroup, string[]>
  >(() => {
    if (typeof window === "undefined") return { Year: [], Competition: [] };
    try {
      const saved = sessionStorage.getItem("projectSearchState");
      return saved
        ? JSON.parse(saved).selectedFilters
        : { Year: [], Competition: [] };
    } catch {
      return { Year: [], Competition: [] };
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(
      "projectSearchState",
      JSON.stringify({ searchTerm, selectedFilters })
    );
  }, [searchTerm, selectedFilters]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => (currentYear - i).toString()
  );
  const competitionOptions = compLoading
    ? []
    : competitions
        .filter((c: CompetitionFields) => c.showInSearch)
        .map((c: CompetitionFields) => c.title.trim());

  const FILTERS = {
    Competition: competitionOptions,
    Year: yearOptions
  };

  type FilterGroup = keyof typeof FILTERS;
  const filterEntries = Object.entries(FILTERS) as [FilterGroup, string[]][];

  const handleFilterChange = (group: FilterGroup, value: string) => {
    setSelectedFilters((prev) => {
      const s = new Set(prev[group]);
      if (s.has(value)) s.delete(value);
      else s.add(value);

      return {
        ...prev,
        [group]: Array.from(s)
      };
    });
  };

  const filteredProjects = initialProjects.filter((project) => {
    const cleanSearch = debouncedSearchTerm.trim().toLowerCase();

    const title = project.title.trim().toLowerCase();
    let ok = title.includes(cleanSearch);

    if (ok && selectedFilters.Competition.length) {
      const comp = project.competition?.trim() ?? "";

      const active = selectedFilters.Competition.map((v) => v.trim());
      ok = active.includes(comp);
    }

    if (ok && selectedFilters.Year.length) {
      const raw = project.createdAt || project.created_date || "";
      const year = parseYear(raw);
      ok = selectedFilters.Year.includes(year);
    }

    return ok;
  });

  return (
    <SearchLayout
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filterEntries={filterEntries}
      selectedFilters={selectedFilters}
      handleFilterChange={handleFilterChange}
      loading={loading}
      filteredProjects={filteredProjects}
      parseYear={parseYear}
    />
  );
}

export async function getServerSideProps() {
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
      createdAt: String(item.fields.year)
    })) as FlattenedContentfulFields[];
  } catch (err) {
    console.error("Error fetching Contentful projects:", err);
  }

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

  const allProjects = Object.values(mergedMap);

  const contentfulFirst = allProjects
    .filter((p) => p.isContentful)
    .sort((a, b) => a.title.localeCompare(b.title));

  const graphqlNext = allProjects
    .filter((p) => !p.isContentful)
    .sort((a, b) => a.title.localeCompare(b.title));

  const sortedProjects = [...contentfulFirst, ...graphqlNext];

  return {
    props: {
      initialProjects: sortedProjects
    }
  };
}
