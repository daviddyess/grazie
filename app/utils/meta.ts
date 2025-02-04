/**
 * Grazie
 * @package Meta Utils
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { site as siteDefault } from '@/grazie';
import { empty } from './generic';

export const SEO = ({
  createdAt,
  title,
  meta,
  publishedAt,
  author,
  contentPage = true,
  matches
}: any) => {
  if (meta && typeof meta === 'string') {
    meta = JSON.parse(meta);
  }
  let metaTitle = '';
  const site = { ...siteDefault, ...matches?.[0]?.data?.site };

  if (contentPage) {
    metaTitle = !empty(meta?.seo?.title)
      ? `${meta?.seo?.title}${site?.separator}${site?.name}`
      : `${title}${site?.separator}${site?.name}`;
  } else {
    metaTitle = !empty(meta?.seo?.title)
      ? `${meta?.seo?.title}${site?.separator}${site?.name}`
      : `${site?.name}`;
  }
  return [
    {
      title: metaTitle
    },
    {
      name: 'description',
      content: `${meta?.seo?.description}`
    },
    { keywords: meta?.seo?.keywords },
    {
      property: 'og:title',
      content: !empty(meta?.seo?.title) ? meta?.seo?.title : title ?? 'Page'
    },
    { property: 'og:type', content: 'article' },
    { name: 'author', property: 'og:author', content: author },
    {
      property: 'og:published_time',
      content: publishedAt ?? createdAt
    },
    { property: 'og:image', content: meta?.seo?.image },
    { property: 'og:description', content: meta?.seo?.description }
  ];
};
