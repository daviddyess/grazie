/**
 * Grazie
 * @copyright Copyright (c) 2024-2025 David Dyess II
 * @license MIT see LICENSE
 */
import type { LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import PostsList from '~/components/Post/PostsList';
import { getPosts } from '~/lib/post.server';
import { sentry } from '~/lib/sentry.server';
import { SEO } from '~/utils/meta';
import { pagerParams } from '~/utils/searchParams.server';
import { createAbility, getSession } from '~/utils/session.server';

export function meta({ matches }: { matches: typeof loader }) {
  return SEO({
    title: `Posts`,
    matches
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }
  const { count, page, pagerLoader } = pagerParams(request, 25);

  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId') as number;
  const query = {
    filter: { published: true },
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const posts = await getPosts(query, userId);

  if (
    posts.nodes?.length > 0 &&
    !(await sentry(
      request,
      {
        action: 'read',
        subject: 'Post',
        items: posts?.nodes ?? [{}]
      },
      // Prevents 404 error
      { reject: false }
    ))
  ) {
    return redirect('/login');
  }

  const data = { posts, pager: pagerLoader(posts.totalCount) };

  return data;
}

export default PostsList;
