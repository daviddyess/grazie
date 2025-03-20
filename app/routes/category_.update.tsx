/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { getCategories, updateCategory } from '~/lib/category.server';
import { sentry } from '~/lib/sentry.server';
import { SEO } from '~/utils/meta';
import { createAbility } from '~/utils/session.server';

export function meta({ matches }: { matches: typeof loader }) {
  return SEO({
    title: `Create Category`,
    matches
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }
  const categories = await getCategories({});
  await sentry(request, { action: 'update', subject: 'Category' });

  const data = { categories };

  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'update', subject: 'Category' });
  const form = await request.formData();
  const id = Number(form.get('id'));
  const name = form.get('name') as string;
  const description = form.get('description') as string;
  const parentId = form.get('parentId') as string;
  await updateCategory({
    id,
    name,
    description,
    parentId: parentId ? Number(parentId) : undefined
  });

  return redirectWithToast(`/dashboard/admin/categories`, {
    message: 'Category Updated!',
    type: 'success'
  });
}
