// pages/articles/[slug].tsx

import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import client from "@/lib/contentful";
import { BLOCKS } from "@contentful/rich-text-types";
import { Options } from "@contentful/rich-text-react-renderer";

import { ArticleSkeleton, ContentfulUser } from "@/types/article-types";
import Breadcrumb, {
  BreadcrumbItem
} from "@/ui/components/brandeisBranding/breadcrumbs";
import slugify from "slugify";
import Head from "next/head";

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
    props: { article: entry.fields }
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
      <p className="text-lg leading-8 mb-4">{children}</p>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { file, title } = node.data.target.fields;
      return (
        <Image
          src={`https:${file.url}`}
          alt={title || "Embedded Image"}
          width={file.details.image.width}
          height={file.details.image.height}
          className="my-6"
        />
      );
    }
  }
};

interface ArticlePageProps {
  article: ArticleSkeleton["fields"];
}

export default function ArticlePage({ article }: ArticlePageProps) {
  const crumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/articles" },
    { label: article.title }
  ];

  const slug = slugify(article.title, { lower: true, strict: true });
  const imageUrl = `https:${article.thumbnail.fields.file.url}`;
  console.log(article.authors[0]);

  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.title} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.title} />
        <meta property="og:image" content={imageUrl} />
        <meta
          property="og:url"
          content={`https://www.brandeisstartup.com/articles/${slug}`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Brandeis Startup Hub" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.title} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>

      <main className="flex flex-col items-center py-12 px-4 font-sans">
        <div className="w-full max-w-8xl mx-auto py-6">
          <Breadcrumb items={crumbs} />
        </div>

        <div className="flex flex-col items-start w-full max-w-8xl">
          <h1 className="text-left text-6xl font-medium mb-6">
            {article.title}
          </h1>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 items-start w-full max-w-8xl">
          By:
          {article.authors?.map((author: ContentfulUser, index) => (
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
          className="w-full max-w-8xl rounded-lg"
          src={imageUrl}
          alt="Article Thumbnail"
          width={1200}
          height={600}
        />

        <main className="mx-auto max-w-8xl py-12 px-4 font-sans">
          <article className="prose prose-xl">
            {documentToReactComponents(article.content, renderOptions)}
            <div className="flex flex-wrap flex-col gap-4 mb-6 items-start bg-gray-50 p-4 rounded-md">
              {article.authors?.map((author: ContentfulUser, index) => (
                <>
                  <div
                    key={index}
                    className="flex items-center justify-center space-x-3 w-full">
                    {author.fields.image?.fields.file.url && (
                      <Image
                        src={`https:${author.fields.image.fields.file.url}`}
                        alt={`${author.fields.firstName} ${author.fields.lastName}`}
                        width={208}
                        height={208}
                        className="rounded-full object-cover border border-white drop-shadow-sm"
                      />
                    )}
                  </div>
                  <span className="text-lg font-medium p-6">
                    <strong>About the author:</strong> <br></br>
                    {author.fields.about}
                  </span>
                </>
              ))}
            </div>
          </article>
        </main>
      </main>
    </>
  );
}
