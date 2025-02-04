/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { LoaderFunctionArgs } from 'react-router';
import RoleUsersLoaderWrapper from '~/components/RoleUser/RoleUsersLoaderWrapper';
import { getRoleUsers } from '~/lib/roleUser.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'manage', subject: 'RoleUser' });
  const users = await getRoleUsers({
    roleId: Number(params.roleId)
  });
  return { _page: 'dashboard', users };
}

export default function RoleUserAdmin() {
  return <RoleUsersLoaderWrapper />;
}
