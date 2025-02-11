/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { type Privilege } from '~/types/Privilege';
import { type Role } from '~/types/Role';

export type RolePrivilege = {
  id?: number;
  roleId?: number;
  privilegeId?: number;
  inverted?: boolean;
  conditions?: string | object | null;
  description?: string;
  role?: Role;
  privilege?: Privilege;
};

export type RolePrivilegeInput = {
  id?: number;
  roleId?: number;
  privilegeId?: number;
  inverted?: boolean;
  conditions?: string | object | null;
  description?: string;
};
