import { GetServerSideProps } from "next";
import client from "@/lib/contentful";

import { useCompetitions } from "@/context/EventContext";
import YouTubePage from "@/ui/components/organisms/youtube/YouTubePage";
import IbsGrid from "@/ui/components/brandeisBranding/data-display/3Column/IbsGrid";
import SimpleImageGrid from "@/ui/components/brandeisBranding/data-display/4Column/SimpleImageGrid";
import Hero from "@/ui/components/brandeisBranding/hero/Hero";
import { ImageFile } from "@/types/used/CompetitionTypes";

type HomePageProps = {
  homepageContent: {
    name: string;
    header: string;
    description: string;
    showAllEventsListBlock: boolean;
    showYoutubeVideos: boolean;
    heroImage: ImageFile;
  };
};

export default function Home({ homepageContent }: HomePageProps) {
  const { upcomingEvents, competitions, loading } = useCompetitions();

  return (
    <>
      <Hero
        heroImage={homepageContent.heroImage.fields.file.url}
        header={homepageContent.header}
        description={homepageContent.description}
      />
      {!loading && homepageContent.showAllEventsListBlock && (
        <>
          <IbsGrid
            label="Upcoming"
            href="#programs"
            data={upcomingEvents}
            showButton={true}
            buttonLabel={"Learn More"}
            buttonLink="/about"
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
          title: "Default Homepage Title",
          description: "Default description in case of error"
        }
      }
    };
  }
};
