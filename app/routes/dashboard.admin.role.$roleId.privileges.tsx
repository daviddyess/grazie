/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { LoaderFunctionArgs } from 'react-router';
import RolePrivilegesLoaderWrapper from '~/components/RolePrivilege/RolePrivilegesLoaderWrapper';
import { getRolePrivileges } from '~/lib/rolePrivilege.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'manage', subject: 'RolePrivilege' });
  const privileges = await getRolePrivileges({
    roleId: Number(params.roleId)
  });
  return { _page: 'dashboard', privileges };
}

export default function RolePrivilegeAdmin() {
  return <RolePrivilegesLoaderWrapper />;
}
