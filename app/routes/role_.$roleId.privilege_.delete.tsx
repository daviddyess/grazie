/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs } from 'react-router'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { removeRolePrivilege } from '~/lib/rolePrivilege.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'delete',
    subject: 'RolePrivilege'
  });
  const form = await request.formData();

  await removeRolePrivilege({
    id: Number(form.get('id') as string)
  });

  return redirectWithToast(`/dashboard/admin/roles`, {
    message: 'Role Privlege Deleted!',
    type: 'success'
  });
}
