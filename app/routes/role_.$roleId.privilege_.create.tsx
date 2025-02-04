/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { createRolePrivilege } from '~/lib/rolePrivilege.server';
import { createAbility, getSession } from '~/utils/session.server';
import { site } from '@/grazie';
import { getPrivileges } from '~/lib/privilege.server';
import { sentry } from '~/lib/sentry.server';

export function meta() {
  return [{ title: `Create Role${site?.separator}${site?.name}` }];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'create',
    subject: 'RolePrivilege'
  });

  const privileges = await getPrivileges({
    filter: { not: { roleId: Number(params.roleId) } },
    select: { id: true, privilegename: true },
    limit: 0
  });
  const data = { privileges };

  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'create',
    subject: 'RolePrivilege'
  });
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));
  const inverted = form.get('inverted') === 'on' ? true : false;
  await createRolePrivilege({
    roleId: Number(form.get('roleId') as string),
    privilegeId: Number(form.get('privilegeId')),
    inverted,
    conditions: form.get('conditions') as string,
    description: form.get('description') as string
  });

  return redirectWithToast(`/dashboard/admin/roles`, {
    message: 'Role Privilege Created!',
    type: 'success'
  });
}
