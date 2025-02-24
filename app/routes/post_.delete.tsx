/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { deletePost, getPost } from '~/lib/post.server';
import { createAbility } from '~/utils/session.server';
import { sentry } from '~/lib/sentry.server';

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const id = Number(form.get('id') as string);
  if (!request?.ability) {
    await createAbility(request);
  }
  const postCheck = await getPost({ id });

  await sentry(request, { action: 'update', subject: 'Post', item: postCheck });

  const deleted = await deletePost({
    id
  });

  if (deleted) {
    return redirectWithToast(
      request.headers?.get('Referer') ?? '/dashboard/posts',
      {
        message: 'Post Deleted!',
        type: 'success'
      }
    );
  } else return deleted;
}
