// pages/help/[slug].tsx

import { GetStaticPaths, GetStaticProps } from "next";
import client from "@/lib/contentful";
import { ArticleSkeleton } from "@/types/article-types";
import ArticleLayout from "@/ui/components/organisms/ArticleLayout";
import slugify from "slugify";

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await client.getEntries<ArticleSkeleton>({
    content_type: "articles",
    select: ["fields.title"]
  });

  const paths = response.items.map((item) => ({
    params: {
      slug: slugify(item.fields.title, { lower: true, strict: true })
    }
  }));

  return {
    paths,
    fallback: "blocking"
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.slug || typeof params.slug !== "string") {
    return { notFound: true };
  }

  const response = await client.getEntries<ArticleSkeleton>({
    content_type: "articles",
    select: [
      "sys.updatedAt",
      "sys.createdAt",
      "fields.title",
      "fields.content",
      "fields.thumbnail",
      "fields.authors",
      "fields.type"
    ]
  });

  const entry = response.items.find(
    (item) =>
      slugify(item.fields.title, { lower: true, strict: true }) === params.slug
  );

  if (!entry) return { notFound: true };

  return {
    props: {
      article: {
        ...entry.fields,
        publishedDate: entry.sys?.updatedAt || entry.sys?.createdAt || null
      }
    },
    revalidate: 60
  };
};

interface ArticlePageProps {
  article: ArticleSkeleton["fields"];
}

export default function HelpPage({ article }: ArticlePageProps) {
  return <ArticleLayout article={article} />;
}
