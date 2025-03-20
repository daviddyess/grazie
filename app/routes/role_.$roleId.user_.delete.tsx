/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { site } from '@/grazie';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { removeRoleUser } from '~/lib/roleUser.server';
import { sentry } from '~/lib/sentry.server';
import { getUsers } from '~/lib/user.server';
import { createAbility } from '~/utils/session.server';

export function meta() {
  return [{ title: `Create Role${site?.separator}${site?.name}` }];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'delete',
    subject: 'RoleUser'
  });
  const users = await getUsers({
    filter: { not: { roleId: Number(params.roleId) } },
    select: { id: true, username: true }
  });
  const data = { users };

  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'delete',
    subject: 'RoleUser'
  });
  const form = await request.formData();

  await removeRoleUser({
    id: Number(form.get('id') as string)
  });

  return redirectWithToast(`/dashboard/admin/roles`, {
    message: 'Role User Deleted!',
    type: 'success'
  });
}
