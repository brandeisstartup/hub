import { GetServerSideProps } from "next";
import client from "@/lib/contentful";
import { ArticleFields, ArticleSkeleton } from "@/types/article-types";
import CustomHead from "@/ui/components/seo/head";
import Breadcrumb, {
  BreadcrumbItem
} from "@/ui/components/brandeisBranding/breadcrumbs";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import Image from "next/image";
import slugify from "slugify";
import Link from "next/link";

type ArticlesPageProps = {
  articles: ArticleFields[];
};

const ArticleCard = ({ article }: { article: ArticleFields }) => {
  return (
    <Link
      className="bg-white shadow rounded-sm overflow-hidden flex flex-col"
      href={`/help/${slugify(article.title, {
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
                    alt={`${author.fields.firstName ?? ""} ${
                      author.fields.lastName ?? ""
                    }`}
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
  );
};

export default function ArticlesPage({ articles }: ArticlesPageProps) {
  const crumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Help Articles", href: "/help" }
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

      <section className="wrapper max-w-8xl mx-auto px-4 md:px-8 py-16 flex flex-col items-start w-full font-sans">
        <Heading label="Help Articles" />

        {articles.length > 0 && (
          <div className="w-full mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, idx) => (
                <ArticleCard article={article} key={`blog-${idx}`} />
              ))}
            </div>
          </div>
        )}
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
    const articles = res.items
      .map((item) => item.fields)
      .filter((a) => a.type === "Help");

    return { props: { articles } };
  } catch (error) {
    console.error("❌ Failed to load help articles:", error);
    return { props: { articles: [] } };
  }
};
