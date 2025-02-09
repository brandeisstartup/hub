import { GetStaticProps, GetStaticPaths } from "next";
import {
  CompetitionSkeleton,
  CompetitionFields
} from "@/types/used/CompetitionTypes";
import client from "@/lib/contentful";
import { ParsedUrlQuery } from "querystring";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import About from "@/ui/components/contentfulComponents/about/about";
import IntroVideo from "@/ui/components/contentfulComponents/IntroVideo/introVideo";
import Requirements from "@/ui/components/contentfulComponents/requirements/Requirements";
import Schedule from "@/ui/components/contentfulComponents/schedule/schedule";
import PersonSpotlight from "@/ui/components/contentfulComponents/personSpotlight/personSpotlight";
import ResponsiveGrid from "@/ui/components/brandeisBranding/data-display/4Column/ResponsiveGrid";
import ResponsiveGridItem from "@/ui/components/brandeisBranding/data-display/4Column/ResponsiveGridItem";
import ContactInfo from "@/ui/components/contentfulComponents/contactInfo/contactInfo";
import People from "@/ui/components/contentfulComponents/people/people";
import Faq from "@/ui/components/contentfulComponents/faq/faq";

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
        <PersonSpotlight
          label={competition.fields.personSpotlightFirstName}
          title={competition.fields.personSpotlightImage.fields.title}
          imageUrl={competition.fields.personSpotlightImage.fields.file.url}
          personSpotlightText={competition.fields.personSpotlightText}
          personSpotlightLInk={competition.fields.personSpotlightLInk}
          firstName={competition.fields.personSpotlightFirstName}
          lastName={competition.fields.personSpotlightLastName}
        />
      )}

      {competition.fields.showPeople &&
        competition.fields.people &&
        competition.fields.people.length >= 1 && (
          <People
            label={competition.fields.peopleSectionLabel}
            people={competition.fields.people}
          />
        )}

      {competition.fields.showFaq && (
        <Faq label={"FAQ"} faqs={competition.fields.faqs} />
      )}
      {competition.fields.showContactInformation && (
        <ContactInfo
          label="Get in touch"
          sectionBlurb={"Contact the organizers for any questions"}
          contacts={competition.fields.contactInformation}
        />
      )}
    </div>
  );
}
