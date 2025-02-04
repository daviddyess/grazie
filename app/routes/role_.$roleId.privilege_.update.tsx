/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs } from 'react-router'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { updateRolePrivilege } from '~/lib/rolePrivilege.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'update',
    subject: 'RolePrivilege'
  });
  const form = await request.formData();
  const inverted = form.get('inverted') === 'on' ? true : false;
  await updateRolePrivilege({
    id: Number(form.get('id') as string),
    inverted,
    conditions: form.get('conditions') as string,
    description: form.get('description') as string
  });

  return redirectWithToast(`/dashboard/admin/roles`, {
    message: 'Role Privilege Updated!',
    type: 'success'
  });
}
