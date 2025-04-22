/**
 * Grazie
 * @package Page Library
 * @copyright Copyright (c) 2024-2025 David Dyess II
 * @license MIT see LICENSE
 */
import { getUserByUsername } from '~/lib/user.server';
import type { Page, PageInput } from '~/types/Page';
import { avatarURL } from '~/utils/config.server';
import { formatSlug } from '~/utils/formatSlug';
import { dateString, pathGenerator, timeString } from '~/utils/generic.server';
import { getLogger } from '~/utils/logger.server';
import { prisma } from '~/utils/prisma.server';

const log = getLogger('Pages Query');

async function slugCheck(slug: string, id = undefined) {
  let where = { slug };
  if (id) {
    where = {
      AND: [
        { slug },
        {
          id: {
            not: id
          }
        }
      ]
    };
  }
  const slugs = await prisma.page.count({
    where
  });

  if (slugs > 0) {
    const slugs = await prisma.page.count({
      where: {
        slug: {
          startsWith: slug
        }
      }
    });
    slug = `${slug}-${slugs + 1}`;
  }

  return slug;
}

export async function createPage({
  title,
  summary,
  body,
  parentId,
  search,
  published,
  publishedAt,
  slugFormat = 'date-title',
  slug,
  authorId,
  meta
}: PageInput) {
  try {
    const date = timeString();
    if (published && !publishedAt) {
      publishedAt = date;
    }
    const data = {
      body:
        typeof body === 'object'
          ? (JSON.stringify(body) as string)
          : (body as string),
      parentId,
      search,
      title,
      summary,
      createdAt: date,
      published,
      publishedAt,
      updatedAt: date,
      authorId,
      slug: `${timeString()}_${title}`,
      meta: typeof meta === 'object' ? JSON.stringify(meta) : (meta as string)
    };

    const page = await prisma.page.create({
      data
    });

    slug = formatSlug({
      format: slugFormat,
      id: page.id,
      title,
      date: page?.publishedAt
        ? dateString({ timestamp: page.publishedAt })
        : dateString({ timestamp: page?.createdAt }),
      slug
    });

    slug = await slugCheck(slug);
    let parent;
    if (parentId) {
      parent = await prisma.page.findUnique({
        where: { id: parentId },
        select: { id: true, path: true }
      });
    }
    const path = pathGenerator({
      name: slug,
      parent: parent?.path ?? undefined
    });

    const update = await prisma.page.update({
      where: { id: page.id },
      data: {
        path,
        slug
      },
      select: {
        slug: true
      }
    });

    page.slug = update.slug;

    return page;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function updatePage({
  id,
  published,
  publishedAt,
  body,
  parentId,
  search,
  title,
  summary,
  slugFormat,
  slug,
  meta
}: PageInput) {
  try {
    if (!id && !slug) {
      throw new Error('Page Update requires either id or slug');
    }
    const date = timeString();

    const bodyObj = typeof body === 'string' ? JSON.parse(body) : body;

    const data = {
      body:
        typeof body === 'object'
          ? (JSON.stringify(body) as string)
          : (body as string),
      parentId,
      search,
      title,
      summary,
      published,
      publishedAt,
      updatedAt: date,
      slug: slug ?? undefined,
      meta: typeof meta === 'object' ? JSON.stringify(meta) : (meta as string),
      path: undefined
    };

    const where = {} as { id?: number; slug?: string };

    if (id) {
      where.id = id;
    }

    if (slug) {
      where.slug = slug;
    }

    const prevStatus = await prisma.page.findUnique({
      where: {
        id
      },
      select: {
        createdAt: true,
        published: true,
        slug: true,
        parentId: true,
        path: true
      }
    });
    if (prevStatus?.published !== published) {
      data.published = published;
      if (!published) {
        data.publishedAt = null;
      } else {
        data.publishedAt = date;
      }
    }

    if (slugFormat) {
      slug = formatSlug({
        format: slugFormat,
        id,
        title,
        date: publishedAt
          ? dateString({ timestamp: publishedAt })
          : dateString({ timestamp: prevStatus.createdAt }),
        slug
      });

      data.slug = await slugCheck(slug);
    }
    let parent;
    let parentPath;
    if (parentId) {
      data.parentId = parentId;

      parent = await prisma.page.findUnique({
        where: {
          id: parentId
        },
        select: {
          id: true,
          title: true,
          path: true
        }
      });

      if (!parent?.path) {
        parentPath = pathGenerator({
          id: parent.id,
          name: parent.slug
        });
        await prisma.page.update({
          where: {
            id: parent.id
          },
          data: {
            path
          }
        });
      } else {
        parentPath = parent.path;
      }
    }

    data.path = pathGenerator({
      name: data.slug,
      parent: parentPath
    });

    const page = await prisma.page.update({
      where: {
        id
      },
      data
    });

    if (data.path !== prevStatus.path) {
      const children = await prisma.page.findMany({
        where: {
          path: {
            startsWith: `${prevStatus.path}/`
          }
        },
        select: {
          id: true,
          slug: true
        }
      });

      await Promise.all(
        children.map(async (child) => {
          const prevChild = await prisma.page.findUnique({
            where: {
              id: child.id
            },
            select: {
              path: true
            }
          });
          await prisma.page.update({
            where: {
              id: child.id
            },
            data: {
              path: prevChild.path.replace(prevStatus.path, data.path)
            }
          });
        })
      );
    }

    return page;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function deletePage({ id }: { id: Page['id'] }) {
  try {
    if (await prisma.page.delete({ where: { id } })) {
      return true;
    }
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getPage({
  id,
  slug,
  select
}: {
  id?: Page['id'];
  slug?: Page['slug'];
  select?: object;
}) {
  try {
    const where = {} as { id?: number; slug?: string };

    if (id) {
      where.id = id;
    } else if (slug) {
      where.slug = slug;
    } else {
      throw new Error(`Either Page slug or id is required`);
    }
    const page = await prisma.page.findUnique({
      where,
      select: select ?? {
        id: true,
        parentId: true,
        title: true,
        summary: true,
        body: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        published: true,
        publishedAt: true,
        slug: true,
        search: true,
        path: true,
        meta: true,
        author: {
          select: {
            displayName: true,
            username: true,
            avatar: true
          }
        },
        children: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        parent: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });
    page.avatarURL = avatarURL;
    return page;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getPages({
  filter = {},
  select = undefined,
  limit = 25,
  offset = 0
}: {
  filter?: {
    authorId?: number | null;
    username?: string;
    category?: string;
    published?: boolean;
  };
  select?: object | undefined;
  limit?: number;
  offset?: number;
}) {
  try {
    const where = {} as {
      authorId?: number;
      category?: any;
      published?: boolean;
    };

    if (filter?.username) {
      const author = await getUserByUsername(filter.username);
      if (author) {
        where.authorId = author.id;
      } else {
        throw new Error(`User ${filter.username} was not found`);
      }
    }

    if (filter?.authorId) {
      where.authorId = filter.authorId;
    }

    if (filter?.published) {
      where.published = filter.published;
    }

    const pages = await prisma.page.findMany({
      where,
      select: select ?? {
        id: true,
        published: true,
        authorId: true,
        parentId: true,
        createdAt: true,
        publishedAt: true,
        updatedAt: true,
        title: true,
        summary: true,
        body: true,
        slug: true,
        search: true,
        meta: true,
        author: {
          select: {
            displayName: true,
            username: true,
            avatar: true
          }
        },
        children: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        parent: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    return {
      avatarURL,
      count: pages.length,
      totalCount: await prisma.page.count({ where }),
      nodes: pages
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
/**
 * Get Pages in a Path
 * @param param0
 */
export async function getPagePath({
  path,
  select = { id: true, slug: true, title: true, path: true }
}: {
  path: string;
  select: object;
}) {
  try {
    const paths = path.split('/');
    // eventual return pages
    let pages = [];
    // path building up the thread
    let thread = '';

    if (paths?.length > 1) {
      for (const part of paths) {
        // append next part to the thread
        thread += part;

        const page = await prisma.page.findUnique({
          where: {
            path: thread
          },
          select
        });
        pages.push(page);
        // prep for next part of the thread
        thread += `/`;
      }
    }
    return pages;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
/**
 * Get Page in Path Tree
 * @param param0
 */
export async function getPageTree({
  path,
  select = { id: true, title: true, slug: true, path: true }
}) {
  try {
    const paths = path.split('/');
    const pages = await prisma.page.findMany({
      where: {
        path: {
          contains: paths[0]
        }
      },
      select,
      orderBy: { path: 'asc' }
    });
    return pages;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
