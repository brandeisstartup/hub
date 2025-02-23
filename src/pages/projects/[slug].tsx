import { GetServerSideProps } from "next";
import client from "@/lib/apolloClient";
import { GET_PROJECT_BY_SLUG } from "@/lib/graphql/queries"; // ✅ Import reusable query
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import Button from "@/ui/components/brandeisBranding/buttons/button";
import slugify from "slugify";

interface ProjectProps {
  project: {
    id: string;
    title: string;
    short_description?: string;
    long_description?: string;
    competition?: string;
    team_members_emails: string[];
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
    // <div className="bg-white p-6">
    //   <h1 className="text-2xl font-bold">{project.title}</h1>
    //   {project.short_description && (
    //     <p className="text-gray-600">{project.short_description}</p>
    //   )}
    //   {project.long_description && (
    //     <p className="mt-4">{project.long_description}</p>
    //   )}
    //   {project.competition && (
    //     <p className="mt-2 font-bold">Competition: {project.competition}</p>
    //   )}

    //   {project.team_members_emails.length > 0 && (
    //     <div className="mt-4">
    //       <h3 className="font-bold">Team Members:</h3>
    //       <ul>
    //         {project.team_members_emails.map((email) => (
    //           <li key={email}>{email}</li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}
    // </div>

    <div className="py-24 sm:pt-32">
      <div className="mx-auto max-w-8xl px-4 flex flex-col gap-10 justify-start">
        <div className="mx-auto max-w-8xl lg:mx-0">
          <Heading label={`${project.title}`} />
          <p className="md:text-left my-6 text-lg leading-8 text-gray-600">
            {project.competition}
          </p>
          <p className="md:text-left my-6 text-lg leading-8 text-gray-600">
            {project.short_description}
          </p>
        </div>

        <div className="mx-auto max-w-8xl lg:mx-0">
          <Heading label={`Description`} />
          <p className="md:text-left my-6 text-lg leading-8 text-gray-600">
            {project.long_description}
          </p>
        </div>

        <div className="mx-auto max-w-8xl lg:mx-0">
          <Heading label={`Team Members`} />
          <ul>
            {project.team_members_emails.map((email) => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
