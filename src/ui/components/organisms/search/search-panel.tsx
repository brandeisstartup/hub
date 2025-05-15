import React from "react";
import { Disclosure } from "@headlessui/react";
import Breadcrumb, {
  BreadcrumbItem
} from "@/ui/components/brandeisBranding/breadcrumbs";
import ProjectCard from "@/ui/components/organisms/search/search-card";

export type FilterGroup = "Competition" | "Year";

interface SearchLayoutProps {
  crumbs: BreadcrumbItem[];
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  filterEntries: [FilterGroup, string[]][];
  selectedFilters: Record<FilterGroup, string[]>;
  handleFilterChange: (group: FilterGroup, value: string) => void;
  loading: boolean;
  filteredProjects: Array<{
    title: string;
    imageUrl?: string;
    createdAt?: string;
    created_date?: string;
    short_description?: string;
    tagline?: string;
    isContentful?: boolean;
  }>;
  parseYear: (raw: string) => string;
}
function SkeletonLoader() {
  return (
    <ul className="grid grid-cols-1  gap-4">
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

export default function SearchLayout({
  crumbs,
  searchTerm,
  setSearchTerm,
  filterEntries,
  selectedFilters,
  handleFilterChange,
  loading,
  filteredProjects,
  parseYear
}: SearchLayoutProps) {
  return (
    <>
      <div className="w-full">
        <div className="max-w-8xl mx-auto p-6 font-sans mt-5">
          <Breadcrumb items={crumbs} />
        </div>
      </div>

      <div className="max-w-8xl mx-auto p-6 font-sans">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Column */}
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
              {filterEntries.map(([group, opts]) => (
                <Disclosure key={group} defaultOpen>
                  {() => (
                    <div className="border rounded p-2">
                      <Disclosure.Button className="w-full text-left font-semibold">
                        {group}
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2">
                        {opts.map((opt) => (
                          <label
                            key={opt}
                            className="flex items-center mb-2 text-sm">
                            <input
                              type="checkbox"
                              checked={selectedFilters[group].includes(opt)}
                              className="mr-2"
                              onChange={() => handleFilterChange(group, opt)}
                            />
                            {opt}
                          </label>
                        ))}
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>
              ))}
            </div>
          </div>

          {/* Results Column */}
          <div className="flex-1 flex flex-col min-h-[750px] flex-shrink-0 xs:min-w-full sm:min-w-[690px] lg:min-w-[1060px] mb-20">
            <div className="flex-1">
              {loading ? (
                <SkeletonLoader />
              ) : (
                <ul className="grid grid-cols-1 gap-4">
                  {filteredProjects.length ? (
                    filteredProjects.map((project) => {
                      const raw =
                        project.createdAt || project.created_date || "";
                      const year = parseYear(raw);
                      const fullDesc =
                        project.short_description || project.tagline || "";
                      const maxLen = 200;
                      const isLong = fullDesc.length > maxLen;
                      const summary = isLong
                        ? fullDesc.slice(0, maxLen).trimEnd() + "…"
                        : fullDesc;

                      return (
                        <ProjectCard
                          key={project.title}
                          title={project.title}
                          imageUrl={project.imageUrl || ""}
                          year={year}
                          summary={summary}
                          isLong={isLong}
                          isContentful={project.isContentful}
                        />
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
