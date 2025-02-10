/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { useFetcher } from 'react-router';
import RolePrivilegesTable from './RolePrivilegesTable';
import { useEffect } from 'react';
import { type Role } from '~/types/Role';

export default function RoleUserAdmin({ role }: Role) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === 'idle' && !fetcher.data) {
      fetcher.load(`/dashboard/admin/role/${role.id}/privileges`);
    }
  }, [fetcher, role.id]);

  return (
    <>
      {fetcher.state === 'loading' && 'Loading..'}
      {fetcher.data && (
        <RolePrivilegesTable
          role={role}
          privileges={fetcher.data?.privileges}
        />
      )}
    </>
  );
}
