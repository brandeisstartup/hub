import { GetStaticProps, GetStaticPaths } from "next";
import {
  CompetitionSkeleton,
  CompetitionFields
} from "@/types/used/CompetitionTypes"; // ✅ Corrected imports
import client from "@/lib/contentful";
import { ParsedUrlQuery } from "querystring";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import Link from "next/link";

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
    <div className="bg-white">
      <div className="">
        <div className="mx-auto max-w-8xl divide-y divide-gray-900/10 px-4 py-24 sm:py-32 lg:px-4 lg:py-22">
          <Heading label={`${competition.fields.title} Display`} />
        </div>
      </div>
    </div>
  );
}
