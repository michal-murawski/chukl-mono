import { Head, Html, Main, NextScript } from "next/document";

const DOMAIN = "https://www.chuckl.io";

const meta = {
  title: "Top comments of the Web",
  description:
    "Just a list of the top comments of the web. Hoping to get some chuckles out of you.",
  siteName: "Chuckl",
  canonical: DOMAIN,
  ogType: "website",
};

export default function Document() {
  const { canonical, ogType, description, siteName, title } = meta;
  return (
    <Html className="dark">
      <Head>
        <title key="title">{`${title} – ${siteName}`}</title>
        <meta name="description" content={description} />
        <meta key="og_type" property="og:type" content={ogType} />
        <meta key="og_title" property="og:title" content={title} />
        <meta
          key="og_description"
          property="og:description"
          content={description}
        />
        <meta key="og_locale" property="og:locale" content="en_IE" />
        <meta key="og_site_name" property="og:site_name" content={siteName} />
        <meta key="og_url" property="og:url" content={canonical ?? DOMAIN} />
        <meta key="og_site_name" property="og:site_name" content={siteName} />
        <meta
          key="og_image:alt"
          property="og:image:alt"
          content={`${title} | ${siteName}`}
        />
        <meta key="og_image:width" property="og:image:width" content="1200" />
        <meta key="og_image:height" property="og:image:height" content="630" />

        <meta name="robots" content="index,follow" />

        <meta
          key="twitter:card"
          name="twitter:card"
          content="summary_large_image"
        />
        <link rel="canonical" href={canonical ?? DOMAIN} />

        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>{" "}
      <body className="dark:bg-gray-900 ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
