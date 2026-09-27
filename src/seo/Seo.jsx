import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'giavang.today';
const SITE_URL = 'https://giavang.today';

export default function Seo({
  title,
  description,
  path = '/',
  image = '/favicon.svg',
  noindex = false,
  schema = null,
}) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : SITE_NAME;

  const canonicalUrl = `${SITE_URL}${path}`;

  const imageUrl = image.startsWith('http')
    ? image
    : `${SITE_URL}${image}`;

  useEffect(() => {
    const existingScript =
      document.querySelector(
        'script[data-giavang-schema]'
      );

    if (existingScript) {
      existingScript.remove();
    }

    if (!schema) {
      return;
    }

    const script =
      document.createElement('script');

    script.type =
      'application/ld+json';

    script.setAttribute(
      'data-giavang-schema',
      'true'
    );

    script.textContent =
      JSON.stringify(schema);

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [schema]);

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta
        name="description"
        content={description}
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow'
        }
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:site_name"
        content={SITE_NAME}
      />

      <meta
        property="og:title"
        content={fullTitle}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:image"
        content={imageUrl}
      />

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={fullTitle}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      <meta
        name="twitter:image"
        content={imageUrl}
      />
    </Helmet>
  );
}