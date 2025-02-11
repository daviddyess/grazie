/**
 * Grazie
 * @package Category Library
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { getLogger } from '~/utils/logger.server';
import { formatSlug } from '~/utils/formatSlug';
import { timeString } from '~/utils/generic.server';
import { prisma } from '~/utils/prisma.server';
import type { Category, CategoryInput } from '~/types/Category';
import { type CategoryPostInput } from '~/types/CategoryPost';

const log = getLogger('Categories Query');

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
  const slugs = await prisma.category.count({
    where
  });

  if (slugs > 0) {
    const slugs = await prisma.category.count({
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

async function nameCheck(name: string) {
  return await prisma.category.count({
    where: {
      name: {
        equals: name
      }
    }
  });
}

async function pathGenerator(name: string, parentId?: number) {
  if (parentId) {
    const parent = await prisma.category.findUnique({
      where: {
        id: parentId
      },
      select: {
        id: true,
        path: true
      }
    });
    if (parent) {
      return `${parent.path}/${name}`;
    } else {
      throw new Error('Parent Category Not Found');
    }
  } else {
    return name;
  }
}

export async function createCategory({
  parentId,
  name,
  description
}: CategoryInput) {
  try {
    if (await nameCheck(name?.trim())) {
      throw new Error('Category Name Already Exists');
    }
    const data = {
      parentId,
      name: name?.trim(),
      description
    };
    const slug = formatSlug({
      format: 'custom',
      slug: data.name
    });

    data.slug = await slugCheck(slug);
    data.path = await pathGenerator(data.name, parentId);

    const category = await prisma.category.create({
      data
    });

    return category;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function postCategory({ name, slug, postId }: CategoryPostInput) {
  try {
    let category;
    if (!slug) {
      category = await prisma.category.findUnique({
        where: {
          name: name?.trim()
        },
        select: {
          id: true,
          path: true
        }
      });
    } else {
      category = await prisma.category.findUnique({
        where: {
          slug
        },
        select: {
          id: true,
          path: true
        }
      });
    }

    const assignCategory = async () =>
      await prisma.categoryPost.create({
        data: {
          postId,
          catId: category.id
        }
      });

    if (!category) {
      const data = {
        name: name?.trim()
      } as Category;
      const slug = formatSlug({
        format: 'custom',
        slug: data.name
      });

      data.slug = await slugCheck(slug);
      data.path = await pathGenerator(data.name);

      category = await prisma.category.create({
        data
      });

      await assignCategory();
    } else {
      const assignedCategory = await prisma.categoryPost.findUnique({
        where: {
          catId_postId: { catId: category.id, postId }
        }
      });
      if (!assignedCategory) {
        await assignCategory();
      }
    }

    const postsCount = await prisma.categoryPost.count({
      where: {
        catId: category.id
      }
    });

    category = await prisma.category.update({
      where: {
        id: category.id
      },
      data: {
        postsCount
      }
    });

    return category;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function purgePostCategories({ postId }: { postId: number }) {
  return await prisma.categoryPost.deleteMany({
    where: {
      postId
    }
  });
}

export async function updateCategory({
  id,
  parentId = null,
  name,
  description
}: CategoryInput) {
  try {
    const date = timeString();
    const data = {
      parentId,
      name: name?.trim(),
      description
    };

    if (!id) {
      throw new Error('id is required to Update a Category');
    }

    const prevStatus = await prisma.category.findUnique({
      where: {
        id
      },
      select: {
        name: true,
        parentId: true,
        path: true
      }
    });

    if (prevStatus?.name !== data.name) {
      if (await nameCheck(name?.trim())) {
        throw new Error('Category Name Already Exists');
      }
      const _slug = formatSlug({
        format: 'custom',
        slug: data.name
      });
      data.slug = await slugCheck(_slug);
    }

    if (prevStatus?.name !== data.name || prevStatus?.parentId !== parentId) {
      data.path = await pathGenerator(data.name, parentId);
      const children = await prisma.category.findMany({
        where: {
          path: {
            startsWith: prevStatus.path
          }
        },
        select: {
          id: true,
          path: true
        }
      });
      if (children?.length) {
        for (const child of children) {
          await prisma.category.updateMany({
            where: {
              id: child.id
            },
            data: {
              path: child.path.replace(prevStatus?.path, data.path)
            }
          });
        }
      }
    }

    const category = await prisma.category.update({
      where: {
        id
      },
      data
    });

    return category;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getCategory({ id, slug, select }) {
  try {
    const where = {} as { id?: number; slug?: string };

    if (id) {
      where.id = id;
    } else if (slug) {
      where.slug = slug;
    } else {
      throw new Error(`Either Category slug or id is required`);
    }
    const category = await prisma.category.findUnique({
      where,
      select: select ?? {
        id: true,
        name: true,
        parentId: true,
        description: true,
        path: true,
        slug: true,
        postsCount: true,
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
            path: true
          }
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            path: true
          }
        }
      }
    });
    return category;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getCategories({
  filter = {},
  sort = {},
  limit = undefined,
  offset = 0
}: {
  filter?: { children?: string; parentId?: number };
  sort?: { field?: string; direction?: string };
  limit?: number;
  offset?: number;
}) {
  try {
    const where = {};

    const categories = await prisma.category.findMany({
      where,
      select: {
        id: true,
        name: true,
        parentId: true,
        description: true,
        path: true,
        slug: true,
        postsCount: true,
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
            path: true
          }
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            path: true
          }
        }
      },
      orderBy: { name: 'asc' },
      take: limit,
      skip: offset
    });

    return {
      count: categories.length,
      totalCount: await prisma.category.count({ where }),
      nodes: categories
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
