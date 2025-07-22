// pages/articles/[slug].tsx
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import client from "@/lib/contentful";
import { BLOCKS } from "@contentful/rich-text-types";
import { Options } from "@contentful/rich-text-react-renderer";

import { ArticleSkeleton, ContentfulUser } from "@/types/article-types";
import Breadcrumb, {
  BreadcrumbItem
} from "@/ui/components/brandeisBranding/breadcrumbs";

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
    select: [
      "fields.title",
      "fields.content",
      "fields.thumbnail",
      "fields.authors",
      "fields.type"
    ]
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

const renderOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="text-5xl mt-8 mb-4 font-medium">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="text-3xl font-medium mt-6 mb-3">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="text-2xl font-medium mt-5 mb-2">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
      <h4 className="text-xl font-medium mt-4 mb-2 text-gray-800">
        {children}
      </h4>
    ),

    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="text-lg leading-8 mb-4 ">{children}</p>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { file, title } = node.data.target.fields;
      return (
        <Image
          src={`https:${file.url}`}
          alt={title || "Article image"}
          width={file.details.image.width}
          height={file.details.image.height}
          className="my-6"
        />
      );
    }
    // Add more overrides as needed...
  }
};

export default function ArticlePage({
  article
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const crumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/articles" },
    { label: article.title }
  ];
  console.log(article);
  return (
    <main className="flex flex-col items-center  py-12 px-4 font-sans">
      <div className=" w-full ">
        <div className="max-w-6xl mx-auto py-6 font-sans mt-5 mb-5">
          {" "}
          <Breadcrumb items={crumbs} />
        </div>
      </div>
      <div className="flex flex-col items-start w-full  max-w-6xl">
        <h1 className="text-left text-6xl font-medium mb-6 ">
          {article.title}
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 items-start w-full  max-w-6xl">
        By:
        {article.authors?.map((author: ContentfulUser, index: number) => (
          <div key={index} className="flex items-center space-x-3">
            {author.fields.image?.fields.file.url && (
              <Image
                src={`https:${author.fields.image.fields.file.url}`}
                alt={`${author.fields.firstName} ${author.fields.lastName}`}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            )}
            <span className="text-lg font-medium">
              {author.fields.firstName} {author.fields.lastName}
            </span>
          </div>
        ))}
      </div>
      <Image
        className="w-full max-w-6xl rounded-lg"
        src={`https:${article.thumbnail.fields.file.url}`}
        alt={""}
        width={300}
        height={300}></Image>
      <main className="mx-auto max-w-8xl py-12 px-4 font-sans">
        <article className="prose prose-xl">
          {documentToReactComponents(article.content, renderOptions)}
        </article>
      </main>
    </main>
  );
}
