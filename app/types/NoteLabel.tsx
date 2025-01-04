/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Label } from './Label';
import { Note } from './Note';

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
