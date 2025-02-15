// import { useCompetitions } from "@/context/EventContext";
// import YouTubePage from "@/ui/components/organisms/youtube/YouTubePage";
// import IbsGrid from "@/ui/components/brandeisBranding/data-display/3Column/IbsGrid";

// export default function Home() {
//   const { competitions, loading } = useCompetitions();

//   return (
//     <>
//       {!loading && (
//         <IbsGrid label="Test" href="#programs" data={competitions} />
//       )}
//       <YouTubePage />
//     </>
//   );
// }

import { GetServerSideProps } from "next";
import client from "@/lib/contentful";
import { useCompetitions } from "@/context/EventContext";
import YouTubePage from "@/ui/components/organisms/youtube/YouTubePage";
import IbsGrid from "@/ui/components/brandeisBranding/data-display/3Column/IbsGrid";

type HomePageProps = {
  homepageContent: {
    name: string;
    description: string;
    showAllEventsListBlock: boolean;
    showYoutubeVideos: boolean;
  };
};

export default function Home({ homepageContent }: HomePageProps) {
  console.log(homepageContent);
  const { competitions, loading } = useCompetitions();

  return (
    <>
      {homepageContent.showAllEventsListBlock && (
        <IbsGrid label="Test" href="#programs" data={competitions} />
      )}
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
