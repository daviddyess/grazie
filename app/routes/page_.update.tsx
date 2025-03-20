/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { getPage, updatePage } from '~/lib/page.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const id = Number(form.get('id') as string);
  if (!request?.ability) {
    await createAbility(request);
  }
  const pageCheck = await getPage({ id });

  await sentry(request, { action: 'update', subject: 'Page', item: pageCheck });

  const published = form.get('published') === 'on' ? true : false;
  const publishedAt = form.get('publishedAt') as string;
  const slugFormat = form.get('slugFormat') as string;
  const slug = form.get('slug') as string;
  const metaData = form.get('meta') as string;
  let meta;
  if (metaData) {
    meta = JSON.parse(metaData);
  }

  const page = await updatePage({
    id,
    published,
    publishedAt,
    body: form.get('body') as string,
    search: form.get('search') as string,
    title: form.get('title') as string,
    summary: form.get('summary') as string,
    slugFormat,
    slug,
    meta: meta ? JSON.stringify(meta) : null
  });

  if (page?.slug) {
    return redirectWithToast(`/page/${page.slug}`, {
      message: 'Page Updated!',
      type: 'success'
    });
  } else return page;
}
