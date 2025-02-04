/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs } from 'react-router';
import { dataWithToast } from 'remix-toast';

import { createOrRemoveFavorite, getPost } from '~/lib/post.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility, getSession } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }
  const data = await request.json();
  const { postId } = data;

  if (postId) {
    const post = await getPost({ id: postId });
    await sentry(request, { action: 'read', subject: 'Post', item: post });
    const session = await getSession(request.headers.get('Cookie'));

    const userId = session.get('userId') as number;
    const favorite = await createOrRemoveFavorite({
      userId,
      postId
    });
    if (favorite?.created) {
      return dataWithToast(favorite, {
        message: `Favorite Created!`,
        type: 'success'
      });
    } else if (favorite?.removed) {
      return dataWithToast(favorite, {
        message: `Favorite Removed!`,
        type: 'success'
      });
    } else {
      return dataWithToast(favorite, {
        message: `Favorite Error!`,
        type: 'error'
      });
    }
  } else {
    return dataWithToast({}, { message: `Favorite Error!`, type: 'error' });
  }
}
