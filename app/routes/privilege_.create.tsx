/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { site } from '@/grazie';
import type { ActionFunctionArgs } from 'react-router'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { createPrivilege } from '~/lib/privilege.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export function meta() {
  return [{ title: `Create Privilege${site?.separator}${site?.name}` }];
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'create',
    subject: 'Privilege'
  });
  await createPrivilege({
    subject: form.get('subject') as string,
    action: form.get('action') as string
  });

  return redirectWithToast(`/dashboard/admin/privileges`, {
    message: 'Privilege Created!',
    type: 'success'
  });
}
