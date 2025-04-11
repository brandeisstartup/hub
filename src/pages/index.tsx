import { GetServerSideProps } from "next";
import client from "@/lib/contentful";

import { useCompetitions } from "@/context/EventContext";
import YouTubePage from "@/ui/components/organisms/youtube/YouTubePage";
import IbsGrid from "@/ui/components/brandeisBranding/data-display/3Column/IbsGrid";
import SimpleImageGrid from "@/ui/components/brandeisBranding/data-display/4Column/SimpleImageGrid";
import Hero from "@/ui/components/brandeisBranding/hero/Hero";
import { ImageFile } from "@/types/used/CompetitionTypes";
import CustomHead from "@/ui/components/seo/head";

type HomePageProps = {
  homepageContent: {
    name: string;
    header: string;
    description: string;
    showAllEventsListBlock: boolean;
    showYoutubeVideos: boolean;
    heroImage: ImageFile;
    heroPrimaryButtonLabel: string;
    heroPrimaryButtonLink: string;
    heroSecondaryButtonLabel: string;
    heroSecondaryButtonLink: string;
  };
};

export default function Home({ homepageContent }: HomePageProps) {
  const { upcomingEvents, competitions, loading } = useCompetitions();

  return (
    <>
      <CustomHead
        title={"Home"}
        description={homepageContent.description}
        // replace with your real site URL, or derive from NEXT_PUBLIC_SITE_URL
        url="https://www.brandeisstartup.com"
        image={homepageContent.heroImage.fields.file.url}
        imageAlt={homepageContent.header}
        type="website"
        siteName="Brandeis Startup Hub"
        twitterCard="summary_large_image"
      />
      <Hero
        heroImage={homepageContent.heroImage.fields.file.url}
        header={homepageContent.header}
        description={homepageContent.description}
        primaryLabel={homepageContent.heroPrimaryButtonLabel}
        primaryLink={homepageContent.heroPrimaryButtonLink}
        secondaryLabel={homepageContent.heroSecondaryButtonLabel}
        secondaryLink={homepageContent.heroSecondaryButtonLink}
      />
      {!loading &&
        homepageContent.showAllEventsListBlock &&
        upcomingEvents.length > 0 && (
          <>
            <IbsGrid
              label="Upcoming"
              href="#programs"
              data={upcomingEvents}
              // showButton={true}
              // buttonLabel={"Learn More"}
              // buttonLink="/about"
            />
          </>
        )}
      <SimpleImageGrid label={"All Events"} projects={competitions} />
      {homepageContent.showYoutubeVideos && <YouTubePage />}
    </>
  );
}

// ✅ Fetch homepage content server-side
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await client.getEntries({
      content_type: "homePage",
      limit: 1
    });

    if (!response.items.length) {
      return {
        notFound: true
      };
    }

    const homepageContent = response.items[0].fields;

    return {
      props: {
        homepageContent
      }
    };
  } catch (error) {
    console.error("❌ Error fetching homepage content:", error);
    return {
      props: {
        homepageContent: {
          title: "Brandeis Startup Hub",
          description: "Brandeis Startup Hub",
          keywords:
            "brandeis, startup, projects, technology, university, harvard, mit, entrpreneuship, brandeis international business school",
          author: "Brandeis Startup Hub"
        }
      }
    };
  }
};
