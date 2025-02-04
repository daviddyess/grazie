/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs } from 'react-router'; // or cloudflare/deno
import { updatePrivilege } from '~/lib/privilege.server';
import { site } from '@/grazie';
import { redirectWithToast } from 'remix-toast';
import { createAbility } from '~/utils/session.server';
import { sentry } from '~/lib/sentry.server';

export function meta() {
  return [{ title: `Update Privilege${site?.separator}${site?.name}` }];
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'update',
    subject: 'Privilege'
  });

  await updatePrivilege({
    id: Number(form.get('id') as string),
    subject: form.get('subject') as string,
    action: form.get('action') as string
  });

  return redirectWithToast(`/dashboard/admin/privileges`, {
    message: 'Privilege Updated!',
    type: 'success'
  });
}
