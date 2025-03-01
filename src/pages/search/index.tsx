import { useState, useEffect } from "react";
import client from "@/lib/apolloClient";
import { GET_ALL_PROJECTS } from "@/lib/graphql/queries";
import slugify from "slugify";
import Link from "next/link";

// Define TypeScript Interfaces
interface Project {
  id: string;
  title: string;
  short_description?: string;
  competition?: string;
}

// Debounce Hook for Search Input
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

interface SearchPageProps {
  initialProjects: Project[];
}

export default function SearchPage({ initialProjects }: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter projects based on search term
  const filteredProjects = initialProjects.filter((project) =>
    project.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
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

        {/* Results */}
        <ul className="mt-4 grid grid-cols-3 gap-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <li
                key={project.id}
                className="border p-4 hover:bg-gray-100 transition">
                {/* Link to project details */}
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
