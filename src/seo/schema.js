export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'giavang.today',
    alternateName: 'Giá Vàng Today',
    url: 'https://giavang.today',
    description:
      'Cập nhật giá vàng hôm nay gồm SJC, vàng nhẫn 9999, PNJ, DOJI, vàng 24K, 18K và giá vàng thế giới. Theo dõi lịch sử, biểu đồ và cảnh báo giá vàng.',
    inLanguage: 'vi-VN',
    keywords: [
      'giá vàng hôm nay',
      'giá vàng SJC hôm nay',
      'giá vàng nhẫn 9999',
      'giá vàng PNJ',
      'giá vàng DOJI',
      'giá vàng 24K',
      'giá vàng 18K',
      'giá vàng thế giới',
      'lịch sử giá vàng',
      'biểu đồ giá vàng',
    ],
  };
}
export function goldPageSchema(page) {
  const url = `https://giavang.today/${page.slug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: 'vi-VN',
        isPartOf: {
          '@id':
            'https://giavang.today/#website',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Trang chủ',
            item:
              'https://giavang.today/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Giá vàng',
            item:
              'https://giavang.today/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: page.name,
            item: url,
          },
        ],
      },
    ],
  };
}

export function blogPostSchema(post) {
  const articleUrl =
    `https://giavang.today/blog/${post.slug}`;

  const authorUrl =
    `https://giavang.today/tac-gia/${post.author.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",

    headline: post.title,

    description: post.description,

    image: [
      `https://giavang.today${post.heroImage}`,
    ],

    datePublished: post.publishedAt,

    dateModified:
      post.updatedAt || post.publishedAt,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },

    author: {
      "@type": "Person",
      name: post.author.name,
      url: authorUrl,
    },

    publisher: {
      "@type": "Organization",
      name: "giavang.today",
      url: "https://giavang.today",
    },
  };
}

export function authorProfileSchema(author) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",

    mainEntity: {
      "@type": "Person",

      name: author.name,

      url:
        `https://giavang.today/tac-gia/${author.slug}`,

      jobTitle: author.role,

      sameAs: [
        author.xUrl,
      ],
    },
  };
}