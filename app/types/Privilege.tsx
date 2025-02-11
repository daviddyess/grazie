/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { type RolePrivilege } from '~/types/RolePrivilege';

export type Privilege = {
  id?: number;
  subject?: string;
  action?: string;
  roles?: RolePrivilege[];
};

export type PrivilegeInput = {
  id?: number;
  subject?: string;
  action?: string;
};
