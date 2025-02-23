import { GetServerSideProps } from "next";
import client from "@/lib/apolloClient";
import { GET_PROJECT_BY_SLUG } from "@/lib/graphql/queries"; // ✅ Import reusable query
import Heading from "@/ui/components/brandeisBranding/headings/heading";

interface ProjectProps {
  project: {
    id: string;
    title: string;
    short_description?: string;
    long_description?: string;
    competition?: string;
    team_members_emails: string[];
    video_url: string;
    teamMembers: TeamMembers[];
  };
}
type TeamMembers = {
  id: string;
  name: string;
  bio: string;
  email: string;
};

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
      <div className="mb-20 mx-auto max-w-8xl px-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
        <div
          id="fixed"
          className="w-full lg:sticky lg:top-36 h-fit lg:max-h-[90vh] overflow-auto lg:overflow-visible p-4">
          <Heading label={`${project.title}`} />
          <div className=" max-w-xs mt-4 grid grid-cols-1 md:grid-cols-2">
            {project.teamMembers.map((email) => (
              <div key={email.id}>
                <h4>{email.name}</h4>
              </div>
            ))}
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2">
              {project.teamMembers.map((email) => (
                <div key={email.id}>
                  <h4>{email.name}</h4>
                  <p>{email.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
