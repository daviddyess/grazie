/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { getPages } from '~/lib/page.server';
import { sentry } from '~/lib/sentry.server';
import { pagerParams } from '~/utils/searchParams.server';
import { createAbility, getUserId } from '~/utils/session.server';
import PageDashboard from '~/components/Page/Dashboard';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const { count, page, pagerLoader } = pagerParams(request, 25);

  const query = {
    filter: { authorId: await getUserId(request) },
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const pages = await getPages(query);
  await sentry(request, {
    action: 'update',
    subject: 'Page',
    items: pages?.nodes
  });
  return {
    _page: 'dashboard',
    pages,
    pager: pagerLoader(pages.totalCount)
  };
}

export default function PageUser() {
  const { pages } = useLoaderData();

  return <PageDashboard pages={pages} />;
}
