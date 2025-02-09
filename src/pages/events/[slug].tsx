import { GetStaticProps, GetStaticPaths } from "next";
import {
  CompetitionSkeleton,
  CompetitionFields
} from "@/types/used/CompetitionTypes";
import client from "@/lib/contentful";
import { ParsedUrlQuery } from "querystring";
import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import Link from "next/link";
import About from "@/ui/components/contentfulComponents/about/about";
import IntroVideo from "@/ui/components/contentfulComponents/IntroVideo/introVideo";
import Requirements from "@/ui/components/contentfulComponents/requirements/Requirements";
import Schedule from "@/ui/components/contentfulComponents/schedule/schedule";
import PersonSpotlight from "@/ui/components/contentfulComponents/personSpotlight/personSpotlight";
import ResponsiveGrid from "@/ui/components/brandeisBranding/data-display/4Column/ResponsiveGrid";
import ResponsiveGridItem from "@/ui/components/brandeisBranding/data-display/4Column/ResponsiveGridItem";

// import { pitchSummitData } from "@/data/competition";

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
        <div className="mx-auto max-w-8xl divide-y divide-gray-900/10 px-4 py-24 sm:py-32 lg:py-22">
          <Heading label={`${competition.fields.title}`} />
        </div>
      </div>
      {competition.fields.showAbout && (
        <About
          title="about"
          heading={`How this works `}
          description={competition.fields.about}
        />
      )}
      {competition.fields.showIntroVideo &&
        competition.fields.introVideoYoutubeId && (
          <IntroVideo YoutubeId={`${competition.fields.introVideoYoutubeId}`} />
        )}
      {competition.fields.showRequirements && (
        <Requirements
          heading={"Requirements"}
          requirements={competition.fields.requirements}
        />
      )}
      {competition.fields.showSchedule &&
        competition.fields.scheduleEvents.length > 1 &&
        competition.fields.scheduleLabel != "" && (
          <Schedule
            heading={`${competition.fields.scheduleLabel}`}
            scheduleEvents={competition.fields.scheduleEvents}
          />
        )}
      {competition.fields.showWinnersYoutubeGrid &&
        competition.fields.winnersYoutubeGridLabel &&
        competition.fields.winnersYoutubeGrid.length >= 1 && (
          <ResponsiveGrid
            headingLabel={`${competition.fields.winnersYoutubeGridLabel}`}>
            {competition.fields.winnersYoutubeGrid.map((item, index) => (
              <ResponsiveGridItem
                key={`${item.youtubeUrl}-${index}`}
                youtubeUrl={item.youtubeUrl}
                overlayText={item.overlayText}
                topLabel={item.topLabel}
              />
            ))}
          </ResponsiveGrid>
        )}
      {competition.fields.showPersonSpotlight && (
        <>
          <PersonSpotlight
            label={competition.fields.personSpotlightFirstName}
            title={competition.fields.personSpotlightImage.fields.title}
            imageUrl={competition.fields.personSpotlightImage.fields.file.url}
            personSpotlightText={competition.fields.personSpotlightText}
            personSpotlightLInk={competition.fields.personSpotlightLInk}
            firstName={competition.fields.personSpotlightFirstName}
            lastName={competition.fields.personSpotlightLastName}
          />
        </>
      )}

      {competition.fields.showPeople &&
        competition.fields.people &&
        competition.fields.people.length >= 1 && (
          <div className="bg-white py-24 px- sm:py-32">
            <div className="mx-auto max-w-8xl px-4">
              <Heading label={`${competition.fields.peopleSectionLabel}`} />
              <ul
                role="list"
                className=" font-sans mx-auto mt-20 grid  grid-cols-2 gap-x-8 gap-y-16 max-w-7xl justify-center  lg:mx-0 lg:max-w-none  ">
                {competition.fields.people.map((person) => (
                  <li
                    key={`${person.fields.firstName}-${person.fields.lastName}`}
                    className="flex flex-col max-w-5xl md:flex-row gap-8">
                    <img
                      className="w-40 h-40 rounded-2xl object-cover"
                      src={person.fields.image.fields.file.url}
                      alt={`${person.fields.image.fields.file.details}`}
                    />
                    <div>
                      {" "}
                      <h3 className=" font-sans text-lg font-semibold leading-8 tracking-tight text-gray-900">
                        {`${person.fields.firstName} ${person.fields.lastName}`}
                      </h3>
                      <h5 className="text-md text-blue-700">
                        {person.fields.role}
                      </h5>
                      <p className=" font-serif text-sm leading-7 text-gray-600">
                        {person.fields.about}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      {competition.fields.showFaq && (
        <div className="bg-white" id="faq">
          <div className="mx-auto max-w-8xl px-6 py-24 sm:py-32 lg:px-4 lg:py-16">
            <div className="mx-auto max-w-8xl">
              <Heading label="FAQ" />
              <dl className="mt-10 space-y-3 ">
                {competition.fields.faqs.map((faq, index) => (
                  <Disclosure
                    as="div"
                    key={`${faq.question}-${faq.answer}-${index}`}
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
                                key={`${item ?? "empty"}-${index}`}
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
      )}
      {competition.fields.showContactInformation && (
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-8xl px-6 lg:px-4">
            <div className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
                <div>
                  <Heading label="Get in touch" />
                  <p className="text-center md:text-left mt-4 leading-7 text-gray-600">
                    Contact the organizers for any questions
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
                  {competition.fields.contactInformation.map(
                    (contact, index) => (
                      <div
                        key={`${contact.name}-${index}`}
                        className="rounded-2xl bg-gray-50 p-10">
                        <h3 className="text-base font-semibold leading-7 text-gray-900">
                          {contact.name}
                        </h3>
                        <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                          <div>
                            <dt className="sr-only">Email</dt>
                            <dd>
                              <Link
                                className="font-semibold text-blue-600"
                                href={`mailto:${contact.email}`}>
                                {contact.email}
                              </Link>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
