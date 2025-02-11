/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { type Role } from '~/types/Role';
import { type User } from '~/types/User';

export type RoleUser = {
  id?: number;
  active?: boolean;
  roleId?: number;
  userId?: number;
  createdAt?: number;
  updatedAt?: number;
  role?: Role;
  user?: User;
};

export type RoleUserInput = {
  id?: number;
  active?: boolean;
  roleId?: number;
  userId?: number;
};
