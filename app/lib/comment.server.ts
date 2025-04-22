/**
 * Grazie
 * @package Comment Library
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { getUserByUsername } from '~/lib/user.server';
import { avatarURL } from '~/utils/config.server';
import { getLogger } from '~/utils/logger.server';
import { chronoPathGenerator, timeString } from '~/utils/generic.server';
import { prisma } from '~/utils/prisma.server';
import type { CommentInput } from '~/types/Comment';

const log = getLogger('Comments Query');

export async function createComment({
  locked,
  pinned,
  parentId = null,
  authorId,
  postId,
  body
}: CommentInput) {
  try {
    const date = timeString();
    let parent, threadPath;
    if (parentId) {
      parent = await prisma.comment.findUnique({
        where: { id: parentId },
        select: {
          id: true,
          locked: true,
          path: true
        }
      });
      if (parent?.id) {
        threadPath = `${parent.path}/${date}`;
      } else {
        throw new Error('Parent comment was not found');
      }
    }

    const data = {
      locked,
      pinned,
      body: body?.type ? (JSON.stringify(body) as string) : (body as string),
      createdAt: date,
      updatedAt: date,
      parentId,
      postId,
      authorId,
      path: threadPath ?? `${date}`
    };

    const comment = await prisma.comment.create({
      data
    });

    threadPath = chronoPathGenerator({ id: comment.id, parent: parent?.path });

    await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        commentsCount: await prisma.comment.count({ where: { postId } })
      }
    });

    if (parentId) {
      await prisma.comment.update({
        where: {
          id: parentId
        },
        data: {
          repliesCount: await prisma.comment.count({ where: { parentId } }),
          lastActivityAt: date
        }
      });
    }

    return await prisma.comment.update({
      where: { id: comment.id },
      data: {
        path: threadPath
      }
    });
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function updateComment({
  id,
  locked,
  pinned,
  body
}: CommentInput) {
  try {
    if (!id) {
      throw new Error(`Comment Update requires a comment id (${id})`);
    }
    const date = timeString();
    const data = {
      locked,
      pinned,
      updatedAt: date
    } as CommentInput;

    if (body) {
      data.body = body?.type
        ? (JSON.stringify(body) as string)
        : (body as string);
    }

    const comment = await prisma.comment.update({
      where: {
        id
      },
      data
    });

    return comment;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getComment({ id, select }) {
  try {
    const where = {} as { id?: number; slug?: string };

    if (id) {
      where.id = id;
    } else {
      throw new Error(`Comment id (${id}) is required`);
    }
    const comment = await prisma.comment.findUnique({
      where,
      select: select ?? {
        id: true,
        locked: true,
        pinned: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        lastActivityAt: true,
        parentId: true,
        postId: true,
        repliesCount: true,
        path: true,
        body: true,
        search: true,
        meta: true,
        author: {
          select: {
            username: true,
            displayName: true,
            avatar: true
          }
        }
      }
    });
    return comment;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getComments({
  filter = {},
  sort = { field: 'createdAt', order: 'desc' },
  limit = 25,
  offset = 0
}: {
  filter?: { username?: string; postId?: number };
  sort?: { field?: string; order?: string };
  limit?: number;
  offset?: number;
}) {
  try {
    const where = {} as { authorId?: number; postId?: number };

    if (filter?.username) {
      where.authorId = await getUserByUsername(filter.username);
    }
    if (filter?.postId) {
      where.postId = filter.postId;
    }
    const orderBy = { [sort.field]: sort.order };

    const comments = await prisma.comment.findMany({
      where,
      select: {
        id: true,
        locked: true,
        pinned: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        lastActivityAt: true,
        parentId: true,
        postId: true,
        repliesCount: true,
        path: true,
        body: true,
        search: true,
        meta: true,
        author: {
          select: {
            username: true,
            displayName: true,
            avatar: true
          }
        }
      },
      orderBy,
      take: limit,
      skip: offset
    });

    return {
      avatarURL,
      count: comments.length,
      totalCount: await prisma.comment.count({ where }),
      nodes: comments
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
