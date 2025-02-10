/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { type Post } from '~/types/Post';
import { type User } from '~/types/User';

export type Comment = {
  id?: number;
  locked?: boolean;
  pinned?: boolean;
  authorId?: number;
  createdAt?: number;
  updatedAt?: number;
  lastActivityAt?: number;
  parentId?: number;
  postId?: number;
  repliesCount?: number;
  path?: string;
  body?: object | string;
  search?: string;
  meta?: string;
  author?: User;
  parent?: Comment;
  post?: Post;
  replies?: Comment[];
};

export type CommentInput = {
  id?: number;
  locked?: boolean;
  pinned?: boolean;
  authorId?: number;
  parentId?: number | null;
  postId?: number;
  body?: string;
};
