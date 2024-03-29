/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { updateRoleUser } from '~/lib/roleUser.server';
import { createAbility } from '~/utils/session.server';
import { site } from '@/grazie';
import { getUsers } from '~/lib/user.server';
import { sentry } from '~/lib/sentry.server';

export function meta() {
  return [{ title: `Create Role${site?.separator}${site?.name}` }];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'update',
    subject: 'RoleUser'
  });
  const users = await getUsers({
    filter: { not: { roleId: Number(params.roleId) } },
    select: { id: true, username: true }
  });
  const data = { users };

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'update',
    subject: 'RoleUser'
  });
  const form = await request.formData();

  await updateRoleUser({
    id: Number(form.get('id') as string),
    active: form.get('active') === 'on' ? true : false
  });

  return redirectWithToast(`/dashboard/admin/roles`, {
    message: 'Role User Updated!',
    type: 'success'
  });
}
