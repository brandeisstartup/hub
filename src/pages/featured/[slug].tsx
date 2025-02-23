import { GetStaticProps, GetStaticPaths } from "next";
import { ProjectEntry, Projectskeleton } from "@/types/used/CompetitionTypes"; // Our updated types
import client from "@/lib/contentful";
import { ParsedUrlQuery } from "querystring";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

interface Props {
  project: ProjectEntry;
}

// Correctly type the params
interface Params extends ParsedUrlQuery {
  slug: string;
}

// 1) Generate all paths (project slugs) for static pages
export const getStaticPaths: GetStaticPaths = async () => {
  const response = await client.getEntries<Projectskeleton>({
    content_type: "projects",
    select: ["fields.title"] // Only fetch what we need
  });

  // Convert each "title" to a slug
  const paths = response.items.map((item) => ({
    params: {
      slug: (item.fields.title as string).replace(/\s+/g, "-").toLowerCase()
    }
  }));

  return { paths, fallback: "blocking" };
};

// 2) Get project data for each slug
export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params
}) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  // Fetch all project entries
  const response = await client.getEntries<Projectskeleton>({
    content_type: "projects"
  });

  // Match the slug by comparing lowercased, hyphenated titles
  const project = response.items.find(
    (item) =>
      (item.fields.title as string).replace(/\s+/g, "-").toLowerCase() ===
      params.slug
  );

  if (!project) {
    return { notFound: true };
  }

  // Return the found project
  return {
    props: { project },
    revalidate: 60 // Re-generate every 60 seconds
  };
};

// 3) The actual page component
export default function ProjectPage({ project }: Props) {
  if (!project || !project.fields) {
    return <div>Project data is not available.</div>;
  }

  // Destructure the fields for convenience
  const { title, tagline, about, members, image } = project.fields as {
    title: string;
    tagline?: string;
    about: string;
    members: string[];
    image?: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
  };

  return (
    <div className="py-24 sm:pt-32">
      <div className="mx-auto max-w-8xl px-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
        {/* Left Column (sticky on large screens) */}
        <div
          id="fixed"
          className="w-full lg:sticky lg:top-36 h-fit lg:max-h-[90vh] overflow-auto lg:overflow-visible p-4">
          <Heading label={`${title}`} />
          {tagline && (
            <p className="md:text-left my-6 text-lg leading-8 text-gray-600">
              {typeof tagline === "string" ? tagline : ""}
            </p>
          )}
          {image?.fields?.file?.url && (
            <img
              src={image.fields.file.url}
              alt={image.fields.title}
              className="w-full max-w-lg rounded-lg"
            />
          )}
        </div>

        {/* Right Column (scrollable content) */}
        <section className="w-full flex flex-col gap-6 lg:max-h-[90vh]">
          <div className="p-4">
            <Heading label="About the Project" />
            <p className="md:text-left my-6 text-lg leading-8 text-gray-600">
              {about}
            </p>
          </div>

          <div className="p-4">
            <Heading label="Team Members" />
            <ul className="list-disc list-inside">
              {members?.map((member) => (
                <li key={member}>{member}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
