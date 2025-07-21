// pages/articles/[slug].tsx
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import client from "@/lib/contentful";

import { ArticleSkeleton } from "@/types/article-types";

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await client.getEntries<ArticleSkeleton>({
    content_type: "articles",
    select: ["fields.title"]
  });

  const paths = response.items.map((item) => {
    // cast to string so TS knows .trim() exists
    const title = item.fields.title as string;
    const slug = title.trim().toLowerCase().replace(/\s+/g, "-");

    return { params: { slug } };
  });

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.slug) return { notFound: true };

  const response = await client.getEntries<ArticleSkeleton>({
    content_type: "articles",
    select: ["fields.title", "fields.content"]
  });

  // use a type‑guard so TS knows `entry` is an ArticleEntry
  const entry = response.items.find(
    (item: { fields: { title: string } }) =>
      item.fields.title.replace(/\s+/g, "-").toLowerCase() === params.slug
  );

  if (!entry) return { notFound: true };

  return {
    props: { article: entry.fields },
    revalidate: 60
  };
};

export default function ArticlePage({
  article
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main className="mx-auto max-w-5xl py-12 px-4 font-sans">
      <h1 className="text-4xl font-bold mb-6">{article.title}</h1>
      <article className="prose prose-xl">
        {documentToReactComponents(article.content)}
      </article>
    </main>
  );
}
