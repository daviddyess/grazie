/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { type Label } from './Label';
import { type Note } from './Note';

export type NoteLabelInput = {
  id?: number;
  noteId: number;
  labelId: number;
  name?: string;
};

export type NoteLabel = {
  id: number;
  noteId: number;
  labelId: number;
  label: Label;
  note: Note;
};
