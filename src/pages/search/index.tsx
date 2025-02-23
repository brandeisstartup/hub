import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";
import client from "@/lib/apolloClient";
import slugify from "slugify";
import Link from "next/link";

// GraphQL Query to Fetch All Projects
const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    projects {
      id
      title
      short_description
      competition
    }
  }
`;

// Debounce Hook
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

export default function SearchPage({
  initialProjects = []
}: {
  initialProjects?: any[];
}) {
  const router = useRouter();
  const initialQuery = (router.query.query as string) || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Ensure initialProjects is always an array before filtering
  const filteredProjects = (initialProjects ?? []).filter((project) =>
    project?.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // ✅ FIX: Do NOT block full navigation when users click on other links
  useEffect(() => {
    if (debouncedSearchTerm) {
      router.replace(
        { pathname: router.pathname, query: { query: debouncedSearchTerm } },
        undefined,
        { shallow: true }
      );
    } else {
      router.replace({ pathname: router.pathname }, undefined, {
        shallow: true
      });
    }
  }, [debouncedSearchTerm]);

  // ✅ FIX: Use `router.push()` for external links to ensure full navigation
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex justify-center items-center">
      {" "}
      <div className="p-6 relative w-full max-w-8xl font-sans ">
        <h1 className="text-2xl font-bold mb-4">Search Projects</h1>

        {/* Search Input */}
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Search for projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Results */}
        <ul className="mt-4 grid grid-cols-3 gap-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project: any) => (
              <li
                key={project.id}
                className="border p-4 hover:bg-gray-100 transition">
                {/* Ensure full navigation works */}
                <Link
                  href={`/projects/${slugify(project.title)}`}
                  className="block">
                  <h2 className="text-xl font-semibold">{project.title}</h2>
                  <p>
                    {project.short_description || "No description available"}
                  </p>
                  {project.competition && (
                    <p className="text-sm text-gray-500">
                      Competition: {project.competition}
                    </p>
                  )}
                </Link>
              </li>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

// **Fetch Data on Server Side**
export async function getServerSideProps() {
  try {
    const { data } = await client.query({
      query: GET_ALL_PROJECTS,
      fetchPolicy: "no-cache" // 🔥 Ensures fresh data is always fetched
    });

    return {
      props: {
        initialProjects: data?.projects ?? []
      }
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      props: {
        initialProjects: []
      }
    };
  }
}
