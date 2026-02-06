import Image from "next/image";
import { documentToReactComponents, Options } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { ArticleSkeleton, ContentfulUser } from "@/types/article-types";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import slugify from "slugify";
import Head from "next/head";

interface ArticleLayoutProps {
  article: ArticleSkeleton["fields"];
}

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

export default function ArticleLayout({ article }: ArticleLayoutProps) {
  const slug = slugify(article.title, { lower: true, strict: true });
  const imageUrl = `https:${article.thumbnail.fields.file.url}`;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null; // Invalid date
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

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

      <main className="flex flex-col items-center py-16 px-4 md:px-8 font-sans">
        <div className="w-full max-w-2xl mx-auto mb-2">
          <Heading label={article.title} />
        </div>

        {article.authors && article.authors.length > 0 ? (
          <div className="mb-12 w-full max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="font-medium">By</span>
              {article.authors.map((author: ContentfulUser, index) => (
                <div key={index} className="flex items-center gap-2">
                  {author.fields.image?.fields.file.url && (
                    <Image
                      src={`https:${author.fields.image.fields.file.url}`}
                      alt={`${author.fields.firstName} ${author.fields.lastName}`}
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                  )}
                  <span className="font-medium">
                    {author.fields.firstName} {author.fields.lastName}
                  </span>
                </div>
              ))}
              {article.publishedDate && (
                <>
                  <span>•</span>
                  <span>{formatDate(article.publishedDate)}</span>
                </>
              )}
            </div>
          </div>
        ) : (
          article.publishedDate && (
            <div className="mb-12 w-full max-w-2xl">
              <div className="text-sm text-gray-600">
                {formatDate(article.publishedDate)}
              </div>
            </div>
          )
        )}

        <div className="w-full max-w-2xl mb-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
            <Image
              src={imageUrl}
              alt="Article Thumbnail"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 768px, 100vw"
              priority
            />
          </div>
        </div>

        <article className="w-full max-w-2xl prose prose-lg mb-16">
          {documentToReactComponents(article.content, renderOptions)}
        </article>

        {article.authors && article.authors.length > 0 && (
          <div className="w-full max-w-2xl pt-8 border-t">
            <div className="space-y-6">
              {article.authors.map((author: ContentfulUser, index) => (
                <div key={index} className="flex gap-4 items-start">
                  {author.fields.image?.fields.file.url && (
                    <Image
                      src={`https:${author.fields.image.fields.file.url}`}
                      alt={`${author.fields.firstName} ${author.fields.lastName}`}
                      width={56}
                      height={56}
                      className="rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1">
                      {author.fields.firstName} {author.fields.lastName}
                    </h3>
                    {author.fields.about && (
                      <p className="text-sm text-gray-700 leading-relaxed">{author.fields.about}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
