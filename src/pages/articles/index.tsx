// pages/articles/index.tsx
import { GetServerSideProps } from "next";
import client from "@/lib/contentful";
import { Entry, EntrySkeletonType } from "contentful";
import { Document } from "@contentful/rich-text-types";
import CustomHead from "@/ui/components/seo/head";

// Define types
export interface ArticleFields {
  title: string;
  type: string;
  thumbnail?: { fields: { file: { url: string } } };
  authors?: AuthorFields[]; // You can define a proper AuthorSkeleton if needed
  content: Document;
}
export interface AuthorFields {
  name: string;
  image?: { fields: { file: { url: string } } };
  bio?: string;
}

export type ArticleSkeleton = EntrySkeletonType<ArticleFields, "articles">;
export type ArticleEntry = Entry<ArticleSkeleton>;

type ArticlesPageProps = {
  articles: ArticleFields[];
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

export const getServerSideProps: GetServerSideProps<
  ArticlesPageProps
> = async () => {
  try {
    const res = await client.getEntries<ArticleSkeleton>({
      content_type: "articles"
    });

    const articles = res.items.map((item) => item.fields);

    return {
      props: {
        articles
      }
    };
  } catch (error) {
    console.error("❌ Failed to load articles:", error);
    return { props: { articles: [] } };
  }
};
