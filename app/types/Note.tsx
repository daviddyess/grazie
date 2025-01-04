/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { NoteLabel } from './NoteLabel';

export type NoteInput = {
  id?: number;
  pinned?: boolean;
  authorId: number;
  createdAt?: number;
  updatedAt?: number;
  search?: string;
  title?: string;
  body: object | string;
  meta?: object;
  type: string;
};

export type NoteUpdate = {
  id?: number;
  pinned?: boolean;
  createdAt?: number;
  updatedAt?: number;
  search?: string;
  title?: string;
  body: object | string;
  meta?: object;
};

export type Note = {
  id: string;
  pinned: boolean;
  authorId: number;
  createdAt: number;
  updatedAt: number;
  search?: string;
  title?: string;
  body: object;
  type: string;
  author: { displayName: string };
  labels?: NoteLabel[];
};
