// pages/articles/index.tsx
import { GetServerSideProps } from "next";
import client from "@/lib/contentful";
import { Entry, EntrySkeletonType } from "contentful";
import { Document } from "@contentful/rich-text-types";
import CustomHead from "@/ui/components/seo/head";
import Breadcrumb, {
  BreadcrumbItem
} from "@/ui/components/brandeisBranding/breadcrumbs";
import Image from "next/image";
import slugify from "slugify";
import Link from "next/link";

// Define types
export interface ArticleFields {
  title: string;
  type: string;
  thumbnail?: { fields: { file: { url: string } } };
  authors?: AuthorFields[]; // You can define a proper AuthorSkeleton if needed
  content: Document;
}
export interface AuthorContentFields {
  firstName: string;
  lastName: string;
  bio?: string;
  image?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
}

export interface AuthorFields {
  fields: AuthorContentFields;
}

export type ArticleSkeleton = EntrySkeletonType<ArticleFields, "articles">;
export type ArticleEntry = Entry<ArticleSkeleton>;

type ArticlesPageProps = {
  articles: ArticleFields[];
};

export default function ArticlesPage({ articles }: ArticlesPageProps) {
  console.log(articles);
  const crumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/articles" }
  ];
  return (
    <>
      <CustomHead
        title="All Articles"
        description="Explore our latest insights and stories"
        url="https://www.brandeisstartup.com/articles"
        image="https://www.brandeisstartup.com/articles"
        siteName="Brandeis Startup"
      />
      <div className="w-full">
        <div className="max-w-8xl mx-auto p-6 font-sans mt-5">
          <Breadcrumb items={crumbs} />
        </div>
      </div>

      <section className="wrapper max-w-8xl mx-auto px-7 py-12 flex flex-col items-start  w-full font sans">
        <h1 className="text-4xl  mb-10 font-sans">Latest Articles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full font-sans">
          {articles.map((article, idx) => (
            <Link
              key={idx}
              className="bg-white shadow rounded-sm overflow-hidden flex flex-col"
              href={`/articles/${slugify(article.title, {
                lower: true,
                strict: true
              })}`}>
              {article.thumbnail?.fields.file.url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={`https:${article.thumbnail.fields.file.url}`}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-4 flex flex-col justify-between flex-1">
                <h2 className="text-xl font-medium mb-2">{article.title}</h2>

                {article.authors && article.authors.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-auto">
                    {article.authors.map((author, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {author.fields.image?.fields.file.url && (
                          <Image
                            src={`https:${author.fields.image.fields.file.url}`}
                            alt={author.name}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm text-gray-700">
                          {author.fields.firstName} {author.fields.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
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
