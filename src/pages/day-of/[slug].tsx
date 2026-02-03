import { GetStaticProps, GetStaticPaths } from "next";
import {
  CompetitionSkeleton,
  CompetitionFields
} from "@/types/used/CompetitionTypes";
import client from "@/lib/contentful";
import { ParsedUrlQuery } from "querystring";

import Hero from "@/ui/components/brandeisBranding/hero/Hero";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import Button from "@/ui/components/brandeisBranding/buttons/button";
import CustomHead from "@/ui/components/seo/head";
import CalendarEventsList from "@/ui/components/googleCalendarComponents/calendar";
import PitchSummitLiveInfo from "@/ui/components/contentfulComponents/pitchSummit/PitchSummitLiveInfo";

interface LocalCompetitionEntry {
  fields: CompetitionFields;
}

interface Props {
  competition: LocalCompetitionEntry;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await client.getEntries<CompetitionSkeleton>({
    content_type: "competitions",
    select: ["fields.title"]
  });

  const paths = response.items.map((item: { fields: { title: string } }) => ({
    params: { slug: item.fields.title.replace(/\s+/g, "-").toLowerCase() }
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params
}) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  const response = await client.getEntries<CompetitionSkeleton>({
    content_type: "competitions"
  });

  const competition = response.items.find(
    (item: { fields: { title: string } }) =>
      item.fields.title.replace(/\s+/g, "-").toLowerCase() === params.slug
  );

  if (!competition) {
    return { notFound: true };
  }

  // Check if event should have a live info page
  const isEventLive = () => {
    if (competition.fields.liveInfoAlwaysVisible) {
      return true;
    }

    const today = new Date();
    const startDate = new Date(competition.fields.startDate);
    const endDate = new Date(competition.fields.endDate);
    return today >= startDate && today <= endDate;
  };

  // Return 404 if event is not live or doesn't have useLiveInfo enabled
  if (!competition.fields.showLiveInfo || !isEventLive()) {
    return { notFound: true };
  }

  return {
    props: { competition },
    revalidate: 60
  };
};

export default function DayOfPage({ competition }: Props) {
  if (!competition || !competition.fields) {
    return <div>Competition data is not available.</div>;
  }

  const eventSlug = competition.fields.title.replace(/\s+/g, "-").toLowerCase();

  return (
    <>
      <CustomHead
        title={`${competition.fields.title} - Live Info`}
        description={`Live information for ${competition.fields.title}`}
        url="https://www.brandeisstartup.com"
        image={competition.fields.heroImage.fields.file.url}
        imageAlt={competition.fields.description}
        type="website"
        siteName="Brandeis Startup Hub"
        twitterCard="summary_large_image"
      />
      <div className="bg-white">
        {competition.fields.heroImage &&
        competition.fields.heroImage.fields.file.url != "" &&
        competition.fields.title ? (
          <Hero
            heroImage={competition.fields.heroImage.fields.file.url}
            description={competition.fields.description}
            header={`Live Info - ${competition.fields.title}`}
            primaryLabel="Back to Event Info"
            primaryLink={`/events/${eventSlug}`}
            secondaryLabel={competition.fields.heroSecondaryButtonLabel}
            secondaryLink={competition.fields.heroSecondaryButtonLink}
            isLive={false}
          />
        ) : (
          <section className="pt-10 pb-20">
            <div className="flex justify-center">
              <div className="wrapper flex w-full justify-center flex-col px-4 md:px-8 max-w-8xl">
                <div className="mx-auto max-w-8xl lg:mx-0">
                  <Heading label={`${competition.fields.title} - Live Info`} />
                  <p className="text-center md:text-left my-6 text-lg leading-8 text-gray-600">
                    {competition.fields.description}
                  </p>
                </div>
                <div className="max-w-[18rem]">
                  <Button
                    label="Go to Event Info"
                    color="blue"
                    href={`/events/${eventSlug}`}></Button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="live">
          <div className="flex justify-center">
            <div className="wrapper flex w-full justify-center flex-col pt-10 pb-20 px-4 md:px-8 max-w-8xl">
              <CalendarEventsList
                startDate={competition.fields.startDate}
                endDate={competition.fields.endDate}
              />
              {competition.fields.pitchSummitLiveInfoSheetUrl && (
                <PitchSummitLiveInfo
                  sheetUrl={competition.fields.pitchSummitLiveInfoSheetUrl}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
