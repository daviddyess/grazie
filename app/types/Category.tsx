/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { type Post } from '~/types/Post';

export type Category = {
  id?: number;
  parentId?: number;
  postsCount?: number;
  name?: string;
  slug?: string;
  path?: string;
  description?: string;
  posts?: Post[];
  children?: Category[];
  parent?: Category;
};

export type CategoryInput = {
  id?: number;
  parentId?: number | null;
  postsCount?: number;
  name?: string;
  slug?: string;
  path?: string;
  description?: string;
};
