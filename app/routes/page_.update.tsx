/**
 * Grazie
 * @copyright Copyright (c) 2024-2025 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { getPage, getPages, updatePage } from '~/lib/page.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Post' });
  const pagesList = await getPages({
    limit: undefined,
    select: { id: true, title: true }
  });
  const data = { pagesList };

  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const id = Number(form.get('id') as string);
  if (!request?.ability) {
    await createAbility(request);
  }
  const pageCheck = await getPage({ id });

  await sentry(request, { action: 'update', subject: 'Page', item: pageCheck });

  const parentId = form.get('parentId') as string;

  const page = await updatePage({
    id,
    parentId: parentId ? Number(parentId) : undefined,
    published: form.get('published') === 'on' ? true : false,
    publishedAt: form.get('publishedAt') as string,
    body: form.get('body') as string,
    search: form.get('search') as string,
    title: form.get('title') as string,
    summary: form.get('summary') as string,
    slugFormat: form.get('slugFormat') as string,
    slug: form.get('slug') as string,
    meta: form.get('meta') as string
  });

  if (page?.slug) {
    return redirectWithToast(`/page/${page.slug}`, {
      message: 'Page Updated!',
      type: 'success'
    });
  } else return page;
}
