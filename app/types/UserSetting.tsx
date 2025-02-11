/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { type User } from '~/types/User';

export type UserSetting = {
  id?: number;
  userId?: number;
  name?: string;
  value?: string;
  type?: string;
  user?: User;
};

export type UserSettingInput = {
  userId?: number;
  name: string;
  value: string;
  type?: string;
  default?: string | number | object;
};
