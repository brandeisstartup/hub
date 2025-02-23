import { GetServerSideProps } from "next";
import client from "@/lib/apolloClient";
import { GET_PROJECT_BY_SLUG } from "@/lib/graphql/queries"; // ✅ Import reusable query
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import Link from "next/link";

interface ProjectProps {
  project: {
    id: string;
    title: string;
    short_description?: string;
    long_description?: string;
    competition?: string;
    team_members_emails: string[];
    video_url: string;
  };
}

// ✅ Fetch Data on Server Side
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  const { data } = await client.query({
    query: GET_PROJECT_BY_SLUG,
    variables: { slug: params.slug }
  });

  if (!data?.project) {
    return { notFound: true };
  }

  return {
    props: { project: data.project }
  };
};

// ✅ Page Component
export default function ProjectPage({ project }: ProjectProps) {
  return (
    <div className="py-24 sm:pt-32">
      <div className="mx-auto max-w-8xl px-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
        <div
          id="fixed"
          className="w-full lg:sticky lg:top-36 h-fit lg:max-h-[90vh] overflow-auto lg:overflow-visible p-4">
          <Heading label={`${project.title}`} />
          <p className="md:text-left my-6 text-lg leading-8 text-gray-600">
            {project.competition}
          </p>
          <p className="md:text-left my-6 text-lg leading-8 text-gray-600">
            {project.short_description}
          </p>
        </div>

        {/* Scrollable Content */}
        <section className="w-full flex flex-col gap-6  lg:max-h-[90vh]">
          <div className="p-4">
            <Heading label={`Description`} />
            <p className="md:text-left my-6 text-lg leading-8 text-gray-600">
              {project.long_description}
            </p>
          </div>

          {project.video_url && (
            <div className="p-4">
              <Heading label={`Video`} />

              {/* ✅ Responsive iFrame Wrapper */}
              <div className="relative w-full aspect-video">
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${project.video_url}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen></iframe>
              </div>
            </div>
          )}

          <div className="p-4">
            <Heading label={`Team Members`} />
            <ul className="list-disc list-inside">
              {project.team_members_emails.map((email) => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
