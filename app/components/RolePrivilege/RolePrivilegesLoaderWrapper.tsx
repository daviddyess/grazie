/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { useLoaderData } from 'react-router';
import RolePrivilegesTable from './RolePrivilegesTable';

export default function RoleUserAdmin() {
  const { privileges } = useLoaderData();

  return <RolePrivilegesTable privileges={privileges} />;
}
