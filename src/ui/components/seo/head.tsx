// components/CustomHead.tsx

import Head from "next/head";

export interface CustomHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  canonicalUrl?: string;

  // Social / Open Graph
  url?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: string;
  imageHeight?: string;
  type?: string;
  siteName?: string;
  locale?: string;

  // Twitter Card
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;

  // Browser hints
  viewport?: string;
  robots?: string;
  themeColor?: string;

  // Favicon
  favicon?: string;

  // Any additional metas
  extraMetaTags?: { name?: string; property?: string; content: string }[];
}

const CustomHead = ({
  title = "Brandeis Startup Hub",
  description = "Brandeis Startup Hub",
  keywords = "brandeis, startup, projects, technology, university, harvard, mit, entrpreneuship, brandeis international business school",
  author = "Brandeis Startup Hub",
  canonicalUrl,

  url,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  type = "website",
  siteName,
  locale,

  twitterCard = "summary_large_image",
  twitterSite,
  twitterCreator,

  viewport = "width=device-width, initial-scale=1",
  robots = "index,follow",
  themeColor,

  favicon,

  extraMetaTags = []
}: CustomHeadProps) => (
  <Head>
    {/* Primary */}
    <title>{title} | Brandeis Startup Hub</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="author" content={author} />

    {/* Browser hints */}
    <meta name="viewport" content={viewport} />
    <meta name="robots" content={robots} />
    {themeColor && <meta name="theme-color" content={themeColor} />}

    {/* Canonical */}
    {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

    {/* Favicon */}
    {favicon && <link rel="icon" href={favicon} />}

    {/* Open Graph */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {url && <meta property="og:url" content={url} />}
    {image && <meta property="og:image" content={image} />}
    {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
    {imageWidth && <meta property="og:image:width" content={imageWidth} />}
    {imageHeight && <meta property="og:image:height" content={imageHeight} />}
    <meta property="og:type" content={type} />
    {siteName && <meta property="og:site_name" content={siteName} />}
    {locale && <meta property="og:locale" content={locale} />}

    {/* Twitter Card */}
    <meta name="twitter:card" content={twitterCard} />
    {twitterSite && <meta name="twitter:site" content={twitterSite} />}
    {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {image && <meta name="twitter:image" content={image} />}

    {/* Extra meta tags */}
    {extraMetaTags.map((m, i) =>
      m.name ? (
        <meta key={i} name={m.name} content={m.content} />
      ) : (
        <meta key={i} property={m.property!} content={m.content} />
      )
    )}
  </Head>
);

export default CustomHead;
