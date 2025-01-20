import { GetStaticProps, GetStaticPaths } from "next";
import { CompetitionSkeleton } from "@/types/used/CompetitionTypes"; // ✅ Corrected imports
import client from "@/lib/contentful";
import { ParsedUrlQuery } from "querystring";

interface CompetitionFields {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isGrant?: boolean;
}

interface LocalCompetitionEntry {
  fields: CompetitionFields;
}

interface Props {
  competition: LocalCompetitionEntry;
}

// ✅ Type the params correctly
interface Params extends ParsedUrlQuery {
  slug: string;
}

// ✅ Fetch all competition slugs for static generation
export const getStaticPaths: GetStaticPaths = async () => {
  const response = await client.getEntries<CompetitionSkeleton>({
    // ✅ Use CompetitionSkeleton
    content_type: "competitions",
    select: ["fields.title"]
  });

  const paths = response.items.map((item: { fields: { title: string } }) => ({
    params: { slug: item.fields.title.replace(/\s+/g, "-").toLowerCase() } // Convert title to slug
  }));

  return { paths, fallback: "blocking" };
};

// ✅ Fetch competition data based on slug
export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params
}) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  // Fetch all competitions and find the one that matches the slug
  const response = await client.getEntries<CompetitionSkeleton>({
    // ✅ Use CompetitionSkeleton
    content_type: "competitions"
  });

  const competition = response.items.find(
    (item: { fields: { title: string } }) =>
      item.fields.title.replace(/\s+/g, "-").toLowerCase() === params.slug
  );

  if (!competition) {
    return { notFound: true };
  }

  return {
    props: { competition },
    revalidate: 60 // ISR: Regenerate the page every 60 seconds
  };
};

// ✅ Page Component
export default function CompetitionPage({ competition }: Props) {
  if (!competition || !competition.fields) {
    return <div>Competition data is not available.</div>;
  }

  return (
    <div>
      <h1>{competition.fields.title}</h1>
      <p>{competition.fields.description}</p>
      <p>
        <strong>Start Date:</strong> {competition.fields.startDate}
      </p>
      <p>
        <strong>End Date:</strong> {competition.fields.endDate}
      </p>
      {competition.fields.isGrant && <p> This competition is a grant</p>}
    </div>
  );
}
