// import { useState, useEffect } from "react";
// import { Disclosure } from "@headlessui/react";
// import client from "@/lib/apolloClient";
// import { GET_ALL_PROJECTS } from "@/lib/graphql/queries";
// import slugify from "slugify";
// import Link from "next/link";

// // Define a simple User interface (adjust as needed)
// interface User {
//   id: string;
//   name?: string;
//   email: string;
// }

// // Updated Project interface to match your GraphQL schema
// interface Project {
//   id: string;
//   title: string;
//   created_date?: string; // Mark as optional in case it's missing
//   creator_email: string;
//   short_description?: string;
//   long_description: string;
//   competition: string;
//   team_members_emails: string[];
//   video_url: string;
//   image_url: string;
//   teamMembers: User[];
// }

// // Debounce Hook for search input
// function useDebounce(value: string, delay: number = 300) {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   return debouncedValue;
// }

// // Hard-coded filters
// const FILTERS = {
//   Year: ["2021", "2022", "2023", "2024", "2025"],
//   Competition: ["Internal", "External", "Global"]
// };

// interface SearchPageProps {
//   initialProjects: Project[];
// }

// export default function SearchPage({ initialProjects }: SearchPageProps) {
//   // State for the sidebar search input (for filtering by project title)
//   const [searchTerm, setSearchTerm] = useState("");
//   // State for the checkbox filters
//   const [selectedFilters, setSelectedFilters] = useState<{
//     [group: string]: string[];
//   }>({
//     Year: [],
//     Competition: []
//   });

//   const debouncedSearchTerm = useDebounce(searchTerm);

//   // Toggle filter selection
//   const handleFilterChange = (group: string, value: string) => {
//     setSelectedFilters((prev) => {
//       const groupSet = new Set(prev[group] || []);
//       groupSet.has(value) ? groupSet.delete(value) : groupSet.add(value);
//       return { ...prev, [group]: Array.from(groupSet) };
//     });
//   };

//   // Filter projects based on search term and selected filters
//   const filteredProjects = initialProjects.filter((project) => {
//     const matchesSearch = project.title
//       .toLowerCase()
//       .includes(debouncedSearchTerm.toLowerCase());

//     let matchesFilters = true;

//     // Competition filter check
//     if (selectedFilters.Competition.length > 0) {
//       if (!selectedFilters.Competition.includes(project.competition)) {
//         matchesFilters = false;
//       }
//     }

//     // Year filter check: safely extract the year using optional chaining
//     if (selectedFilters.Year.length > 0) {
//       const projectYear = project.created_date?.substring(0, 4);
//       // If projectYear is undefined or not included in filters, reject it.
//       if (!projectYear || !selectedFilters.Year.includes(projectYear)) {
//         matchesFilters = false;
//       }
//     }

//     return matchesSearch && matchesFilters;
//   });

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Left Side: Tiny Search Input & Filters */}
//         <div className="w-full lg:w-64">
//           <div className="mb-4">
//             <input
//               type="text"
//               className="border rounded p-2 w-full text-sm"
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <h2 className="text-lg font-semibold mb-2">Filter Templates</h2>
//           <div className="space-y-4">
//             {Object.entries(FILTERS).map(([group, options]) => (
//               <Disclosure key={group} defaultOpen>
//                 {() => (
//                   <div className="border rounded p-2">
//                     <Disclosure.Button className="w-full text-left font-medium">
//                       {group}
//                     </Disclosure.Button>
//                     <Disclosure.Panel className="mt-2">
//                       {options.map((option) => {
//                         const isSelected =
//                           selectedFilters[group]?.includes(option) || false;
//                         return (
//                           <div key={option} className="flex items-center mb-2">
//                             <input
//                               type="checkbox"
//                               className="mr-2"
//                               checked={isSelected}
//                               onChange={() => handleFilterChange(group, option)}
//                             />
//                             <label className="text-sm">{option}</label>
//                           </div>
//                         );
//                       })}
//                     </Disclosure.Panel>
//                   </div>
//                 )}
//               </Disclosure>
//             ))}
//           </div>
//         </div>

//         {/* Right Side: Header and Project Cards */}
//         <div className="flex-1 flex flex-col min-h-[600px]">
//           <h1 className="text-3xl font-bold mb-2">Find your Template</h1>
//           <p className="text-gray-700 mb-6">
//             Jumpstart your app development process with pre-built solutions from
//             Vercel and our community.
//           </p>
//           <div className="flex-1">
//             {filteredProjects.length > 0 ? (
//               <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {filteredProjects.map((project) => {
//                   // Safely extract the year; if undefined, use a fallback like "N/A"
//                   const projectYear = project.created_date
//                     ? project.created_date.substring(0, 4)
//                     : "N/A";
//                   return (
//                     <li
//                       key={project.id}
//                       className="border p-4 rounded hover:bg-gray-50 transition">
//                       <Link
//                         href={`/projects/${slugify(project.title)}`}
//                         className="block">
//                         <h2 className="text-xl font-semibold">
//                           {project.title}
//                         </h2>
//                         <p className="text-sm text-gray-600">
//                           {project.short_description ||
//                             "No description available"}
//                         </p>
//                         {project.competition && (
//                           <p className="mt-1 text-sm text-gray-500">
//                             Competition: {project.competition}
//                           </p>
//                         )}
//                         <p className="mt-1 text-sm text-gray-500">
//                           Year: {projectYear}
//                         </p>
//                       </Link>
//                     </li>
//                   );
//                 })}
//               </ul>
//             ) : (
//               // When there are no results, this placeholder fills the available space
//               <div className="flex items-center justify-center h-full">
//                 <p>No projects found.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Fetch data on the server side
// export async function getServerSideProps() {
//   try {
//     const { data } = await client.query({
//       query: GET_ALL_PROJECTS,
//       fetchPolicy: "no-cache"
//     });

//     return {
//       props: {
//         initialProjects: data?.projects ?? []
//       }
//     };
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     return {
//       props: {
//         initialProjects: []
//       }
//     };
//   }
// }
