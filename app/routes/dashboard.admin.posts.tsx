/**
 * Grazie
 * @copyright Copyright (c) 2024-2025 David Dyess II
 * @license MIT see LICENSE
 */
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import PostDashboard from '~/components/Post/Dashboard';
import { getPosts } from '~/lib/post.server';
import { sentry } from '~/lib/sentry.server';
import { pagerParams } from '~/utils/searchParams.server';
import { createAbility } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'manage', subject: 'Post' });
  const { count, page, pagerLoader } = pagerParams(request, 25);

  const query = {
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const posts = await getPosts(query);
  return {
    _page: 'dashboard',
    posts,
    pager: pagerLoader(posts.totalCount)
  };
}

export default function PostAdmin() {
  const { posts } = useLoaderData();

  return <PostDashboard posts={posts} />;
}
