import { useFetcher } from '@remix-run/react';
import RolePrivilegesTable from './RolePrivilegesTable';
import { useEffect } from 'react';
import { Role } from '~/types/Role';

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
