/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { createComment, updateComment } from '~/lib/comment.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility, getSession } from '~/utils/session.server';

export async function action({ params, request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Comment' });
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));
  const authorId = session.get('userId') as number;
  const id = Number(form.get('id') as string);
  const postId = Number(form.get('postId') as string);
  const parentId = form.get('parentId') as string;
  const locked = form.get('locked') === 'on' ? true : false;
  const pinned = form.get('pinned') === 'on' ? true : false;
  const body = form.get('body') as string;
  if (id) {
    await updateComment({
      id,
      locked,
      pinned,
      body
    });
  } else {
    await createComment({
      postId,
      parentId: parentId ? Number(parentId) : null,
      authorId,
      locked,
      pinned,
      body
    });
  }

  return redirectWithToast(
    id ? `/post/${params.slug}?refresh=1` : `/post/${params.slug}`,
    { message: id ? 'Comment Updated!' : `Comment Created!`, type: 'success' }
  );
}
