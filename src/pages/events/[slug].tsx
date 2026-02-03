import { GetStaticProps, GetStaticPaths } from "next";
import {
  CompetitionSkeleton,
  CompetitionFields
} from "@/types/used/CompetitionTypes";
import client from "@/lib/contentful";
import { ParsedUrlQuery } from "querystring";

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
import Projects from "@/ui/components/contentfulComponents/projects/projects";
import Hero from "@/ui/components/brandeisBranding/hero/Hero";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import Button from "@/ui/components/brandeisBranding/buttons/button";
import CustomHead from "@/ui/components/seo/head";
import PrizesList from "@/ui/components/brandeisBranding/data-display/prizes/prizesList";
import Raffle from "@/ui/components/brandeisBranding/data-display/prizes/raffle";

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

  return {
    props: { competition },
    revalidate: 60
  };
};

export default function CompetitionPage({ competition }: Props) {
  if (!competition || !competition.fields) {
    return <div>Competition data is not available.</div>;
  }
  
  const eventSlug = competition.fields.title.replace(/\s+/g, "-").toLowerCase();
  
  const isEventLive = () => {
    const today = new Date();
    const startDate = new Date(competition.fields.startDate);
    const endDate = new Date(competition.fields.endDate);
    return today >= startDate && today <= endDate;
  };

  return (
    <>
      <CustomHead
        title={competition.fields.title}
        description={competition.fields.description}
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
        competition.fields.title &&
        competition.fields.ctaButtonLabel &&
        competition.fields.ctaButtonLink ? (
          <Hero
            heroImage={competition.fields.heroImage.fields.file.url}
            description={competition.fields.description}
            header={competition.fields.title}
            primaryLabel={
              competition.fields.showLiveInfo && isEventLive()
                ? "See Live Info"
                : competition.fields.ctaButtonLabel
            }
            primaryLink={
              competition.fields.showLiveInfo && isEventLive()
                ? `/day-of/${eventSlug}`
                : competition.fields.ctaButtonLink
            }
            secondaryLabel={competition.fields.heroSecondaryButtonLabel}
            secondaryLink={competition.fields.heroSecondaryButtonLink}
            isLive={false}
          />
        ) : (
          <section className="py-24 sm:pt-32">
            <div className="mx-auto max-w-8xl px-4 md:px-8">
              <div className="mx-auto max-w-8xl lg:mx-0">
                <Heading label={`${competition.fields.title}`} />
                <p className="text-center md:text-left my-6 text-lg leading-8 text-gray-600">
                  {competition.fields.description}
                </p>
              </div>
              {competition.fields.showLiveInfo && isEventLive() ? (
                <div className="max-w-[18rem]">
                  <Button
                    label="See Live Info"
                    color="green"
                    href={`/day-of/${eventSlug}`}></Button>
                </div>
              ) : (
                <div className="max-w-[18rem]">
                  <Button
                    label={competition.fields.ctaButtonLabel}
                    color="blue"
                    href={competition.fields.ctaButtonLink}></Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Content wrapper to match site-wide margins while keeping Hero full-bleed */}
        <div className="mx-auto max-w-8xl px-4 md:px-8 pt-10">
          {competition.fields.about && competition.fields.aboutLabel && (
            <About
              title="about"
              heading={competition.fields.aboutLabel}
              description={competition.fields.about}
            />
          )}
          {competition.fields.introVideoYoutubeId && (
            <IntroVideo YoutubeId={`${competition.fields.introVideoYoutubeId}`} />
          )}
          {competition.fields.requirements && (
            <Requirements
              heading={"Requirements"}
              requirements={competition.fields.requirements}
            />
          )}
          {competition.fields.scheduleEvents &&
            competition.fields.scheduleLabel != "" && (
              <Schedule
                heading={`${competition.fields.scheduleLabel}`}
                scheduleEvents={competition.fields.scheduleEvents}
              />
            )}
          {competition.fields.winnersYoutubeGridLabel &&
            competition.fields.winnersYoutubeGrid &&
            competition.fields.winnersYoutubeGrid.length >= 1 && (
              <ResponsiveGrid
                headingLabel={`${competition.fields.winnersYoutubeGridLabel}`}>
                {competition.fields.winnersYoutubeGrid.map((item, index) => (
                  <ResponsiveGridItem
                    key={`${item.fields.youtubeId}-${index}`}
                    youtubeUrl={item.fields.youtubeId}
                    overlayText={item.fields.overlayText}
                    topLabel={item.fields.topLabel}
                  />
                ))}
              </ResponsiveGrid>
            )}

          {competition.fields.prizesLabel && competition.fields.prizes && (
            <section className="bg-white" id="prizes">
              <div className="mx-auto max-w-8xl py-24 sm:py-32 lg:py-16">
                <div className="mx-auto max-w-8xl">
                  <Heading label={competition.fields.prizesLabel} />

                  {/* prize grid */}
                  <PrizesList prizes={competition.fields.prizes} />

                  {/* raffle card */}
                  {competition.fields.raffleMainText &&
                    competition.fields.raffleSubText &&
                    competition.fields.raffleImage?.fields?.file?.url && (
                      <Raffle
                        raffleHeading={competition.fields.raffleMainText}
                        raffleSubtext={competition.fields.raffleSubText}
                        raffleImage={
                          competition.fields.raffleImage.fields.file.url
                        }
                      />
                    )}
                </div>
              </div>
            </section>
          )}

          {competition.fields.projects && (
            <Projects
              label={"Project Block"}
              projects={competition.fields.projects}
              extend={true}
            />
          )}
          {competition.fields.personSpotlightFirstName &&
            competition.fields.personSpotlightLastName &&
            competition.fields.personSpotlightImage?.fields?.title &&
            competition.fields.personSpotlightImage?.fields?.file?.url &&
            competition.fields.personSpotlightText && (
              <PersonSpotlight
                label={competition.fields.personSpotlightLabel}
                title={competition.fields.personSpotlightImage.fields.title}
                imageUrl={competition.fields.personSpotlightImage.fields.file.url}
                personSpotlightText={competition.fields.personSpotlightText}
                personSpotlightLInk={competition.fields.personSpotlightLInk}
                firstName={competition.fields.personSpotlightFirstName}
                lastName={competition.fields.personSpotlightLastName}
                linkText={competition.fields.personSpotlightLinkText}
              />
            )}

          {competition.fields.people && competition.fields.people.length >= 1 && (
            <People
              label={competition.fields.peopleSectionLabel}
              people={competition.fields.people}
            />
          )}

          {competition.fields.faqs && (
            <Faq label={"FAQ"} faqs={competition.fields.faqs} />
          )}
          {competition.fields.contactInformation && (
            <ContactInfo
              label="Get in touch"
              sectionBlurb={"Contact the organizers for any questions"}
              contacts={competition.fields.contactInformation}
            />
          )}
        </div>
      </div>
    </>
  );
}
