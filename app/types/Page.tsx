/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
export type PageInput = {
  id?: number;
  authorId: number;
  published?: boolean;
  createdAt?: number;
  publishedAt: number;
  updatedAt?: number;
  title: string;
  slug?: string;
  slugFormat?: string;
  summary?: string;
  search?: string;
  body: object | string;
  meta?: object;
};

export type Page = {
  id: number;
  authorId: number;
  published: boolean;
  createdAt: number;
  publishedAt: number;
  updatedAt: number;
  title: string;
  slug: string;
  summary?: string;
  search?: string;
  body: object;
  author: { displayName: string };
};
