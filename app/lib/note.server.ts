/**
 * Grazie
 * @package Note Library
 * @copyright Copyright (c) 2024-2025 David Dyess II
 * @license MIT see LICENSE
 */
import { getUserByUsername } from '~/lib/user.server';
import { avatarURL } from '~/utils/config.server';
import { getLogger } from '~/utils/logger.server';
import { timeString } from '~/utils/generic.server';
import { prisma } from '~/utils/prisma.server';
import type { NoteInput, NoteUpdate } from '~/types/Note';
import { getLabel } from './label.server';

const log = getLogger('Notes Query');

export async function createNote({
  pinned = false,
  title,
  body,
  search,
  type,
  authorId
}: NoteInput) {
  try {
    const date = timeString();

    const data = {
      pinned,
      title,
      body: body?.type ? (JSON.stringify(body) as string) : (body as string),
      search,
      createdAt: date,
      updatedAt: date,
      authorId,
      type
    };

    const note = await prisma.note.create({
      data
    });

    return note;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function updateNote({
  id,
  pinned,
  title,
  body,
  search
}: NoteUpdate) {
  try {
    if (!id) {
      throw new Error('Note Update requires id');
    }
    const date = timeString();
    const data = {
      pinned,
      title,
      body: body?.type ? (JSON.stringify(body) as string) : (body as string),
      search,
      updatedAt: date
    };

    const where = {} as { id?: number; slug?: string };

    if (id) {
      where.id = id;
    }

    const note = await prisma.note.update({
      where: {
        id
      },
      data
    });

    return note;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getNote({ id, select }) {
  try {
    const where = {} as { id: number };

    if (id) {
      where.id = id;
    } else {
      throw new Error(`Either Note id is required`);
    }
    const note = await prisma.note.findUnique({
      where,
      select: select ?? {
        id: true,
        pinned: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        title: true,
        body: true,
        meta: true,
        type: true,
        author: {
          select: {
            displayName: true,
            username: true,
            avatar: true
          }
        },
        labels: {
          select: {
            labelId: true,
            label: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      }
    });

    note.avatarURL = avatarURL;
    return note;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getNotes({
  filter = {},
  limit = 25,
  offset = 0
}: {
  filter?: { authorId?: number; username?: string; label?: string };
  limit?: number;
  offset?: number;
}) {
  try {
    const where = {} as { authorId?: number; labels?: any };

    if (filter?.username) {
      const author = await getUserByUsername(filter.username);
      where.authorId = author.id;
    }

    if (filter?.authorId) {
      where.authorId = filter.authorId;
    }

    if (filter?.label) {
      const label = await getLabel({
        slug: filter.label,
        select: { id: true }
      });
      if (label) {
        where.labels = {
          some: {
            labelId: label.id
          }
        };
      } else {
        throw new Error(`Label ${filter.label} was not found`);
      }
    }

    const notes = await prisma.note.findMany({
      where,
      select: {
        id: true,
        authorId: true,
        pinned: true,
        createdAt: true,
        updatedAt: true,
        title: true,
        body: true,
        search: true,
        meta: true,
        type: true,
        author: {
          select: {
            displayName: true,
            username: true,
            avatar: true
          }
        },
        labels: {
          select: {
            id: true,
            labelId: true,
            label: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    return {
      avatarURL,
      count: notes.length,
      totalCount: await prisma.note.count({ where }),
      nodes: notes
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
