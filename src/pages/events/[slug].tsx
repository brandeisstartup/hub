import { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
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
import BodyText from "@/ui/components/brandeisBranding/text/bodyText";
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
  const name =
    competition.fields.personSpotlightFirstName +
    " " +
    competition.fields.personSpotlightLastName;
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
        <BodyText
          title="about"
          heading={`How this works `}
          description={competition.fields.about}
        />
      )}
      {competition.fields.showIntroVideo &&
        competition.fields.introVideoYoutubeId && (
          <div className="  flex justify-center items-center">
            <iframe
              width="888"
              height="500"
              src={`https://www.youtube.com/embed/${competition.fields.introVideoYoutubeId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen></iframe>
          </div>
        )}
      {competition.fields.showRequirements && (
        <div className="" id="reqs">
          <div className="mx-auto max-w-8xl divide-y divide-gray-900/10 px-4 py-24 sm:py-32 lg:px-4 lg:py-22">
            <Heading label="Requirements" />
            <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
              {competition.fields.requirements.map((req) => (
                <div
                  key={req.requirement}
                  className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                  <dt className="font-sans text-xl leading-7 text-gray-900 lg:col-span-5">
                    {" "}
                    {req.requirement}
                  </dt>
                  <dd className="mt-4 lg:col-span-7 lg:mt-0">
                    <ol className="text-base leading-7 text-gray-600">
                      {req.explanation.map((exp) => (
                        <li key={exp} className="">
                          {exp}
                        </li>
                      ))}
                    </ol>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
      {competition.fields.showSchedule &&
        competition.fields.scheduleEvents.length > 1 &&
        competition.fields.scheduleLabel != "" && (
          <div className="mx-auto max-w-8xl lg:px-4">
            <Heading
              label={`${competition.fields.scheduleLabel}`}
              alignStart={false}
            />
            <div
              className=" p-20 rounded-lg mx-auto mt-20 max-w-8xl px-6 lg:px-14"
              id="dates">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
                {competition.fields.scheduleEvents.map((item) => (
                  <div key={item.title}>
                    <time
                      dateTime={item.dateTime}
                      className="flex items-center text-lg font-sans  leading-6 text-blue-600">
                      <svg
                        viewBox="0 0 4 4"
                        className="mr-4 h-1 w-1 flex-none"
                        aria-hidden="true">
                        <circle cx={2} cy={2} r={2} fill="currentColor" />
                      </svg>
                      {item.date} at {item.dateTime}
                      <div
                        className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                        aria-hidden="true"
                      />
                    </time>
                    <p className="font-sans mt-6 text-lg  leading-8 tracking-tight text-gray-900">
                      {item.title}
                    </p>
                    <p className="mt-1 leading-7 text-gray-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      {competition.fields.showWinnersYoutubeGrid &&
        competition.fields.winnersYoutubeGridLabel &&
        competition.fields.winnersYoutubeGrid.length >= 1 && (
          <ResponsiveGrid
            headingLabel={`${competition.fields.winnersYoutubeGridLabel}`}>
            {competition.fields.winnersYoutubeGrid.map((item) => (
              <ResponsiveGridItem
                key={item.youtubeUrl}
                youtubeUrl={item.youtubeUrl}
                overlayText={item.overlayText}
                topLabel={item.topLabel}
              />
            ))}
          </ResponsiveGrid>
        )}
      {competition.fields.showPersonSpotlight && (
        <div className="bg-white ">
          <div className="mx-auto max-w-8xl lg:px-4">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <Heading label={`Meet ${name}`} />
            </div>
            <div className=" mt-4  overflow-hidden bg-white  text-center   grid grid-cols-1 md:grid-cols-3 gap-2">
              <Image
                src={`https:${competition.fields.personSpotlightImage.fields.file.url}`}
                alt={`https:${competition.fields.personSpotlightImage.fields.title}`}
                layout="responsive"
                width={100}
                height={100}
                className="h-1/2"
              />
              <div className="col-span-1 md:col-span-2  h-full flex flex-col items-start justify-start px-4 gap-4">
                <p className="text-left ">
                  {competition.fields.personSpotlightText}
                </p>
                <div className="underline text-orange-500">
                  <a
                    target="_blank"
                    href={`${competition.fields.personSpotlightLInk}`}>
                    Learn more about
                    {` ${name}`}
                    &apos;s insipiring story.
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                    key={`${person.fields.firstName} ${person.fields.lastName}`}
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
                        key={contact.name + index}
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
