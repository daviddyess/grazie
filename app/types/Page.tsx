/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
export type PageInput = {
  id?: number;
  authorId?: number;
  parentId?: number;
  published?: boolean;
  createdAt?: number;
  publishedAt: string;
  updatedAt?: number;
  title: string;
  slug?: string;
  slugFormat?: string;
  summary?: string;
  search?: string;
  body: object | string;
  path?: string;
  meta?: object | string;
};

export type Page = {
  id: number;
  authorId: number;
  parentId?: number;
  published: boolean;
  createdAt: number;
  publishedAt: string;
  updatedAt: number;
  title: string;
  slug: string;
  summary?: string;
  search?: string;
  body: object;
  path?: string;
  author: { displayName: string };
  meta?: object | string;
};
