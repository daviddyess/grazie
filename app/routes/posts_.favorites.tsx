/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { site } from '@/grazie';
import type { LoaderFunctionArgs } from 'react-router';
import PostsList from '~/components/Post/PostsList';
import { status } from '~/lib/error.server';
import { getPosts } from '~/lib/post.server';
import { sentry } from '~/lib/sentry.server';
import { pagerParams } from '~/utils/searchParams.server';
import { createAbility, getSession } from '~/utils/session.server';

export function meta() {
  return [{ title: `Posts${site?.separator}${site?.name}` }];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { count, page, pagerLoader } = pagerParams(request, 25);
  const session = await getSession(request.headers.get('Cookie'));
  const isLoggedIn = session.get('isLoggedIn') as boolean;
  if (!isLoggedIn) {
    return status(404);
  }
  const userId = session.get('userId') as number;
  const query = {
    filter: { published: true, favorites: true },
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const posts = await getPosts(query, userId);

  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'read',
    subject: 'Post',
    items: posts?.nodes ?? [{}]
  });

  const data = {
    posts,
    pager: pagerLoader(posts.totalCount)
  };

  return data;
}

export default function FavoritedPosts() {
  return <PostsList tab="favorites" />;
}
