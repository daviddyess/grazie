/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { type Category } from '~/types/Category';
import { type Post } from '~/types/Post';

export type CategoryPost = {
  id?: number;
  catId?: number;
  postId?: number;
  category?: Category;
  post?: Post;
};

export type CategoryPostInput = {
  name?: string;
  slug?: string;
  catId?: number;
  postId?: number;
  category?: Category;
  post?: Post;
};
