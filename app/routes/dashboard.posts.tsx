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
import { createAbility, getUserId } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { count, page, pagerLoader } = pagerParams(request, 25);

  const query = {
    filter: { authorId: await getUserId(request) },
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const posts = await getPosts(query);
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'update',
    subject: 'Post',
    items: posts?.nodes
  });
  return {
    _page: 'dashboard',
    posts,
    pager: pagerLoader(posts.totalCount)
  };
}

export default function PostUser() {
  const { posts } = useLoaderData();

  return <PostDashboard posts={posts} />;
}
