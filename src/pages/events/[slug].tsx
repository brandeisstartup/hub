import { GetStaticProps, GetStaticPaths } from "next";
import {
  CompetitionSkeleton,
  CompetitionFields
} from "@/types/used/CompetitionTypes"; // ✅ Corrected imports
import client from "@/lib/contentful";
import { ParsedUrlQuery } from "querystring";
import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

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
    <>
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

      <div className="bg-white" id="faq">
        <div className="mx-auto max-w-8xl px-6 py-24 sm:py-32 lg:px-4 lg:py-16">
          <div className="mx-auto max-w-8xl">
            <Heading label="FAQ" />
            <dl className="mt-10 space-y-3 ">
              {competition.fields.faqs.map((faq) => (
                <Disclosure
                  as="div"
                  key={faq.question}
                  className="pt-6 pb-6 px-5 bg-BrandeisBackgroundAlt">
                  {({ open }) => (
                    <>
                      <dt>
                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                          <span className="font-sans font-semibold leading-7">
                            {faq.question}
                          </span>
                          <span className="ml-6 flex h-8 items-center">
                            {open ? (
                              <MinusSmallIcon
                                className="h-8 w-8"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusSmallIcon
                                className="h-8 w-8"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        {Array.isArray(faq.answer) ? (
                          faq.answer.map((item, index) => (
                            <p
                              key={index}
                              className="text-base leading-7 text-gray-600 mb-2">
                              {index + 1}. {item}
                            </p>
                          ))
                        ) : (
                          <p className="text-base leading-7 text-gray-600">
                            {faq.answer}
                          </p>
                        )}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
