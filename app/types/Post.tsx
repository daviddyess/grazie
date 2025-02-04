/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import Joi from 'joi';
import { type CategoryPost } from './CategoryPost';
import { joiResolver } from 'mantine-form-joi-resolver';

export type PostInput = {
  id?: number;
  authorId: number;
  published?: boolean;
  createdAt?: string;
  publishedAt: string;
  updatedAt?: string;
  title: string;
  slug?: string;
  slugFormat?: string;
  search?: string;
  body: object | string;
  meta?: object;
};

export type Post = {
  id: string;
  authorId: number;
  published: boolean;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  title: string;
  slug: string;
  search?: string;
  body: object;
  author: { displayName: string };
  categories?: CategoryPost[];
  meta?: {
    seo?: {
      title?: string;
      description?: string;
      keywords?: string;
      image?: string;
    };
  };
};
