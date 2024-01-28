export interface PostInput {
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
}

export interface Page {
  id: string;
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
}
