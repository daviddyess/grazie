/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { type User } from './User';

export type Role = {
  id?: number;
  active?: boolean;
  name?: string;
  description?: string;
  users?: User[];
};

export type RoleInput = {
  id?: number;
  active?: boolean;
  name?: string;
  description?: string;
};
