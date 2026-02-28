import { Html, Head, Main, NextScript } from 'next/document';
import { SITE_URL, SITE_NAME, SITE_NAME_AR, SEO_KEYWORDS, DEFAULT_META } from '../src/constants/seo';

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ef4444" />
        <meta name="author" content={SITE_NAME} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Arabic, French, English" />
        <meta name="geo.region" content="MA" />
        <meta name="geo.country" content="Morocco" />
        <meta name="keywords" content={SEO_KEYWORDS} />
        <meta name="description" content={DEFAULT_META.description} />
        <link rel="canonical" href={SITE_URL} />
        <link rel="alternate" hrefLang="ar" href={`${SITE_URL}/?lang=ar`} />
        <link rel="alternate" hrefLang="fr" href={`${SITE_URL}/?lang=fr`} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={`${SITE_NAME} | ${DEFAULT_META.titleAr}`} />
        <meta property="og:description" content={DEFAULT_META.description} />
        <meta property="og:image" content={DEFAULT_META.ogImage} />
        <meta property="og:locale" content="ar_MA" />
        <meta property="og:locale:alternate" content="fr_MA" />
        <meta property="og:site_name" content={`${SITE_NAME} - ${SITE_NAME_AR}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={SITE_URL} />
        <meta name="twitter:title" content={`${SITE_NAME} | Live Football Scores`} />
        <meta name="twitter:description" content={DEFAULT_META.description} />
        <meta name="twitter:image" content={DEFAULT_META.ogImage} />
        <link rel="icon" href="/Logo.png" />
        <link rel="apple-touch-icon" href="/Logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: `${SITE_NAME} - ${SITE_NAME_AR}`,
              alternateName: [SITE_NAME_AR, 'Koora for the World', 'كورة للعالم'],
              url: SITE_URL,
              description: 'Live football scores and today\'s matches from around the world. Premier League, La Liga, Champions League, Botola.',
              inLanguage: ['ar', 'fr', 'en'],
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?search={search_term_string}` },
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: SITE_NAME,
                logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo512.png` },
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SportsOrganization',
              name: SITE_NAME,
              alternateName: SITE_NAME_AR,
              url: SITE_URL,
              description: 'Live football scores and match results - Morocco and world football.',
              address: { '@type': 'PostalAddress', addressCountry: 'MA' },
              sport: 'Football',
              areaServed: { '@type': 'Country', name: 'Worldwide' },
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
