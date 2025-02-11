/**
 * Grazie
 * @package Page Library
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { getUserByUsername } from '~/lib/user.server';
import type { Page, PageInput } from '~/types/Page';
import { getLogger } from '~/utils/logger.server';
import { formatSlug } from '~/utils/formatSlug';
import { dateString, timeString } from '~/utils/generic.server';
import { prisma } from '~/utils/prisma.server';
import { avatarURL } from '~/utils/config.server';

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
      body: body?.type ? (JSON.stringify(body) as string) : (body as string),
      search,
      title,
      summary,
      createdAt: date,
      published,
      publishedAt,
      updatedAt: date,
      authorId,
      slug: `${timeString()}_${title}`,
      meta
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

    const update = await prisma.page.update({
      where: { id: page.id },
      data: {
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
    const data = {
      body: body?.type ? (JSON.stringify(body) as string) : (body as string),
      search,
      title,
      summary,
      published,
      publishedAt,
      updatedAt: date,
      slug: slug ?? undefined,
      meta
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
        slug: true
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

    const page = await prisma.page.update({
      where: {
        id
      },
      data
    });

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
  id: Page['id'];
  slug: Page['slug'];
  select: object;
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
        meta: true,
        author: {
          select: {
            displayName: true,
            username: true,
            avatar: true
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
  limit = 25,
  offset = 0
}: {
  filter?: {
    authorId?: number | null;
    username?: string;
    category?: string;
    published?: boolean;
  };
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

    const articles = await prisma.page.findMany({
      where,
      select: {
        id: true,
        published: true,
        authorId: true,
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
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    return {
      avatarURL,
      count: articles.length,
      totalCount: await prisma.page.count({ where }),
      nodes: articles
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
