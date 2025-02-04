/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { setting } from '~/lib/setting.server';
import { createAbility } from '~/utils/session.server';
import { site } from '@/grazie';
import { sentry } from '~/lib/sentry.server';

export function meta() {
  return [{ title: `Update Post${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'update',
    subject: 'Setting'
  });
  const data = {};

  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'update',
    subject: 'Setting'
  });
  const form = await request.formData();

  await setting({
    id: Number(form.get('id')),
    name: form.get('name') as string,
    value: form.get('value') as string,
    type: form.get('type') as string
  });

  return redirectWithToast(`/dashboard/admin/settings`, {
    message: 'Setting Updated!',
    type: 'success'
  });
}
