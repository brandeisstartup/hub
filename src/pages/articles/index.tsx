import { GetServerSideProps } from "next";
import client from "@/lib/contentful";
import { Entry } from "contentful";
import CustomHead from "@/ui/components/seo/head";

type Article = {
  title: string;
  type: string;
  thumbnail?: { fields: { file: { url: string } } };
  authors?: Entry<any>[];
  content: any; // Rich text or markdown
};

type ArticlesPageProps = {
  articles: Article[];
};

export default function ArticlesPage({ articles }: ArticlesPageProps) {
  return (
    <>
      <CustomHead
        title="All Articles"
        description="Explore our latest insights and stories"
        url="https://www.brandeisstartup.com/articles"
        image="https://www.brandeisstartup.com/articles"
        siteName="Brandeis Startup"
      />

      <section className="wrapper max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10">Latest Articles</h1>
        <ul className="space-y-4">
          {articles.map((article, idx) => (
            <li key={idx} className="text-xl font-medium text-gray-800">
              {article.title}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await client.getEntries({
      content_type: "articles" // your content type slug
    });

    return {
      props: {
        articles: res.items.map((item) => item.fields)
      }
    };
  } catch (error) {
    console.error("❌ Failed to load articles:", error);
    return { props: { articles: [] } };
  }
};
