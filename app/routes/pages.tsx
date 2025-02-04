/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { LoaderFunctionArgs } from 'react-router';
import { getPages } from '~/lib/page.server';
import { site } from '@/grazie';
import { pagerParams } from '~/utils/searchParams.server';
import { createAbility } from '~/utils/session.server';
import { sentry } from '~/lib/sentry.server';
import PagesList from '~/components/Page/PagesList';
import { SEO } from '~/utils/meta';

export function meta({ matches }: { matches: typeof loader }) {
  return SEO({
    title: `Pages`,
    matches
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { count, page, pagerLoader } = pagerParams(request, 25);

  const query = {
    filter: { published: true },
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const pages = await getPages(query);
  if (!request?.ability) {
    await createAbility(request);
  }
  if (pages.nodes?.length > 0) {
    await sentry(request, {
      action: 'read',
      subject: 'Page',
      items: pages?.nodes
    });
  }

  const data = { pages, pager: pagerLoader(pages.totalCount) };

  return data;
}

export default PagesList;
