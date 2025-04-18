import { GetServerSideProps } from "next";
import client from "@/lib/contentful";

import { useCompetitions } from "@/context/EventContext";
import YouTubePage from "@/ui/components/organisms/youtube/YouTubePage";
import IbsGrid from "@/ui/components/brandeisBranding/data-display/3Column/IbsGrid";
import SimpleImageGrid from "@/ui/components/brandeisBranding/data-display/4Column/SimpleImageGrid";
import Hero from "@/ui/components/brandeisBranding/hero/Hero";
import { ImageFile } from "@/types/used/CompetitionTypes";
import CustomHead from "@/ui/components/seo/head";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

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
        image={"https://www.brandeisstartup.com/logo.png"}
        imageAlt={homepageContent.header}
        type="website"
        siteName="Brandeis Startup Hub"
        twitterCard="summary_large_image"
        ogLogo={"https://www.brandeisstartup.com/logo.png"}
        locale="en_US"
      />
      {/* <Hero
        heroImage={homepageContent.heroImage.fields.file.url}
        header={homepageContent.header}
        description={homepageContent.description}
        primaryLabel={homepageContent.heroPrimaryButtonLabel}
        primaryLink={homepageContent.heroPrimaryButtonLink}
        secondaryLabel={homepageContent.heroSecondaryButtonLabel}
        secondaryLink={homepageContent.heroSecondaryButtonLink}
      /> */}

      <div className="flex justify-center" id="abou">
        <div className="wrapper flex w-full justify-center flex-col pt-20 pb-20 px-4 max-w-8xl">
          <Heading label={"What is the Brandeis Startup Hub?"} />

          <p className="mb-4">
            The Brandeis Entrepreneurship and Collaboration Hub is a dynamic
            space designed to empower students to discover grants, awards, and
            unique opportunities that will help them grow as entrepreneurs.
          </p>

          <p className="mb-4">
            Here, students can collaborate on innovative projects, building
            skills that will serve them in their careers and beyond. This hub is
            not only a place for fostering entrepreneurship and teamwork, but
            also for students to easily display their work and share it with
            potential employers.
          </p>

          <p className="mb-4">
            Whether it's through events, collaborative projects, or individual
            achievements, the Hub offers a platform for students to showcase
            their efforts and expand their professional network. The Hub is run
            by <strong>Philippe Wells</strong> at the{" "}
            <strong>Brandeis International Business School</strong>, providing
            mentorship and guidance to help students thrive in the fast-paced
            world of entrepreneurship. Philippe's leadership has shaped the Hub
            into a space where innovation and collaboration thrive, making it an
            essential resource for all Brandeis students looking to launch their
            entrepreneurial careers.
          </p>
        </div>
      </div>
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
