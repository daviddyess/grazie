/**
 * Grazie
 * @package Post Library
 * @copyright Copyright (c) 2024-2025 David Dyess II
 * @license MIT see LICENSE
 */
import { getUserByUsername } from '~/lib/user.server';
import { avatarURL } from '~/utils/config.server';
import { getLogger } from '~/utils/logger.server';
import { formatSlug } from '~/utils/formatSlug';
import { dateString, timeString } from '~/utils/generic.server';
import { prisma } from '~/utils/prisma.server';
import type { PostInput } from '~/types/Post';
import { getCategory } from './category.server';
import { status } from './error.server';

const log = getLogger('Posts Query');

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
  const slugs = await prisma.post.count({
    where
  });

  if (slugs > 0) {
    const slugs = await prisma.post.count({
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

export async function createPost({
  title,
  body,
  search,
  published,
  publishedAt,
  slugFormat = 'date-title',
  slug,
  authorId,
  meta
}: PostInput) {
  try {
    const date = timeString();
    if (published && !publishedAt) {
      publishedAt = date;
    }
    const data = {
      body: body?.type ? (JSON.stringify(body) as string) : (body as string),
      search,
      title,
      createdAt: date,
      published,
      publishedAt,
      updatedAt: date,
      authorId,
      slug: `${timeString()}_${title}`,
      meta
    };

    const post = await prisma.post.create({
      data
    });

    slug = formatSlug({
      format: slugFormat,
      id: post.id,
      title,
      date: post?.publishedAt
        ? dateString({ timestamp: post.publishedAt })
        : dateString({ timestamp: post?.createdAt }),
      slug
    });

    slug = await slugCheck(slug);

    const update = await prisma.post.update({
      where: { id: post.id },
      data: {
        slug
      },
      select: {
        slug: true
      }
    });

    post.slug = update.slug;

    return post;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function updatePost({
  id,
  published,
  publishedAt,
  body,
  search,
  title,
  slugFormat,
  slug,
  meta
}: PostInput) {
  try {
    if (!id && !slug) {
      throw new Error('Post Update requires either id or slug');
    }
    const date = timeString();
    const data = {
      body: body?.type ? (JSON.stringify(body) as string) : (body as string),
      search,
      title,
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

    const prevStatus = await prisma.post.findUnique({
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

    const post = await prisma.post.update({
      where: {
        id
      },
      data
    });

    return post;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function deletePost({ id }: { id: number }) {
  try {
    if (await prisma.post.delete({ where: { id } })) {
      return true;
    }
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getPost(
  { id, slug, select }: { id?: number; slug: string; select: object },
  userId?: number | null
) {
  try {
    const where = {} as { id?: number; slug?: string };

    if (id) {
      where.id = id;
    } else if (slug) {
      where.slug = slug;
    } else {
      throw new Error(`Either Post slug or id is required`);
    }
    if (!select) {
      select = {
        id: true,
        title: true,
        body: true,
        authorId: true,
        bookmarksCount: true,
        commentsCount: true,
        favoritesCount: true,
        createdAt: true,
        updatedAt: true,
        viewsCount: true,
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
        },
        categories: {
          select: {
            catId: true,
            category: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      };
    }

    if (userId) {
      select.favorites = {
        where: {
          userId
        },
        select: {
          createdAt: true
        }
      };
      select.bookmarks = {
        where: {
          userId
        },
        select: {
          createdAt: true
        }
      };
    }

    const post = await prisma.post.findUnique({
      where,
      select
    });

    if (!post) {
      log.error(`Post id: ${id} | slug: ${slug} - Not Found`);
      status(404);
    }
    const viewsUpdate = await prisma.post.update({
      where,
      data: {
        viewsCount: post.viewsCount + 1
      },
      select: {
        viewsCount: true
      }
    });
    post.viewsCount = viewsUpdate.viewsCount;
    post.avatarURL = avatarURL;
    return post;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getPosts(
  {
    filter = {},
    limit = 25,
    offset = 0
  }: {
    filter?: {
      authorId?: number;
      username?: string;
      category?: string;
      published?: boolean;
      favorites?: boolean;
      bookmarks?: boolean;
    };
    limit?: number;
    offset?: number;
  },
  userId?: number | null
) {
  try {
    const where = {} as {
      authorId?: number;
      categories?: any;
      published?: boolean;
      favorites?: { some: { userId: number } };
      bookmarks?: { some: { userId: number } };
    };

    if (typeof filter?.published === 'boolean') {
      where.published = filter.published;
    }

    if (filter?.username) {
      where.authorId = (await getUserByUsername(filter.username)).id;
    }

    if (filter?.authorId) {
      where.authorId = filter.authorId;
    }

    if (typeof filter?.favorites === 'boolean') {
      if (filter?.favorites && userId)
        where.favorites = {
          some: {
            userId
          }
        };
    }

    if (typeof filter?.bookmarks === 'boolean') {
      if (filter?.bookmarks && userId)
        where.bookmarks = {
          some: {
            userId
          }
        };
    }

    let category;

    if (filter?.category) {
      category = await getCategory({
        slug: filter.category,
        select: { id: true, name: true }
      });
      if (category) {
        where.categories = {
          some: {
            catId: category.id
          }
        };
      } else {
        throw new Error(`Category ${filter.category} was not found`);
      }
    }
    const select = {
      id: true,
      published: true,
      authorId: true,
      bookmarksCount: true,
      commentsCount: true,
      favoritesCount: true,
      createdAt: true,
      publishedAt: true,
      updatedAt: true,
      viewsCount: true,
      title: true,
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
      categories: {
        select: {
          id: true,
          catId: true,
          category: {
            select: {
              name: true,
              slug: true
            }
          }
        }
      }
    };
    if (userId) {
      select.favorites = {
        where: {
          userId
        },
        select: {
          createdAt: true
        }
      };
      select.bookmarks = {
        where: {
          userId
        },
        select: {
          createdAt: true
        }
      };
    }
    const articles = await prisma.post.findMany({
      where,
      select,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    return {
      avatarURL,
      count: articles.length,
      totalCount: await prisma.post.count({ where }),
      nodes: articles,
      category,
      favorites: filter?.favorites,
      bookmarks: filter?.bookmarks
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function createOrRemoveFavorite({
  userId,
  postId
}: {
  userId: number;
  postId: number;
}) {
  const favorite = await prisma.favoritePost.findUnique({
    where: {
      userId_postId: { userId, postId }
    },
    select: {
      id: true
    }
  });
  const userFavorites = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      favoritePostsCount: true
    }
  });
  const favoritePostsCount = userFavorites?.favoritePostsCount ?? 0;

  const postFavorites = await prisma.post.findUnique({
    where: {
      id: postId
    },
    select: {
      favoritesCount: true
    }
  });
  const favoritesCount = postFavorites?.favoritesCount ?? 0;
  if (favorite) {
    await prisma.$transaction(async (db) => {
      await db.favoritePost.delete({
        where: {
          userId_postId: { userId, postId }
        }
      });
      await db.user.update({
        where: {
          id: userId
        },
        data: {
          favoritePostsCount:
            favoritePostsCount > 0 ? favoritePostsCount - 1 : 0
        }
      });
      await db.post.update({
        where: {
          id: postId
        },
        data: {
          favoritesCount: favoritesCount > 0 ? favoritesCount - 1 : 0
        }
      });
    });
    return {
      userId,
      postId,
      created: false,
      removed: true
    };
  } else {
    await prisma.$transaction(async (db) => {
      const data = await db.favoritePost.create({
        data: {
          userId,
          postId,
          createdAt: timeString()
        }
      });
      await db.user.update({
        where: {
          id: userId
        },
        data: {
          favoritePostsCount:
            favoritePostsCount > 0 ? favoritePostsCount + 1 : 1
        }
      });
      await db.post.update({
        where: {
          id: postId
        },
        data: {
          favoritesCount: favoritesCount > 0 ? favoritesCount + 1 : 1
        }
      });
    });
    return {
      userId,
      postId,
      created: true,
      removed: false
    };
  }
}

export async function createOrRemoveBookmark({
  userId,
  postId
}: {
  userId: number;
  postId: number;
}) {
  const bookmark = await prisma.bookmarkPost.findUnique({
    where: {
      userId_postId: { userId, postId }
    },
    select: {
      id: true
    }
  });
  const userBookmarks = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      bookmarkPostsCount: true
    }
  });
  const bookmarkPostsCount = userBookmarks?.bookmarkPostsCount ?? 0;

  const postBookmarks = await prisma.post.findUnique({
    where: {
      id: postId
    },
    select: {
      bookmarksCount: true
    }
  });
  const bookmarksCount = postBookmarks?.bookmarksCount ?? 0;
  if (bookmark) {
    await prisma.$transaction(async (db) => {
      await db.bookmarkPost.delete({
        where: {
          userId_postId: { userId, postId }
        }
      });
      await db.user.update({
        where: {
          id: userId
        },
        data: {
          bookmarkPostsCount:
            bookmarkPostsCount > 0 ? bookmarkPostsCount - 1 : 0
        }
      });
      await db.post.update({
        where: {
          id: postId
        },
        data: {
          bookmarksCount: bookmarksCount > 0 ? bookmarksCount - 1 : 0
        }
      });
    });
    return {
      userId,
      postId,
      created: false,
      removed: true
    };
  } else {
    await prisma.$transaction(async (db) => {
      const data = await db.bookmarkPost.create({
        data: {
          userId,
          postId,
          createdAt: timeString()
        }
      });
      await db.user.update({
        where: {
          id: userId
        },
        data: {
          bookmarkPostsCount:
            bookmarkPostsCount > 0 ? bookmarkPostsCount + 1 : 1
        }
      });
      await db.post.update({
        where: {
          id: postId
        },
        data: {
          bookmarksCount: bookmarksCount > 0 ? bookmarksCount + 1 : 1
        }
      });
    });
    return {
      userId,
      postId,
      created: true,
      removed: false
    };
  }
}
