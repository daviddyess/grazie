/**
 * Grazie
 * @package Label Library
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { getLogger } from '~/utils/logger.server';
import { formatSlug } from '~/utils/formatSlug';
import { timeString } from '~/utils/generic.server';
import { prisma } from '~/utils/prisma.server';
import type { Label, LabelInput } from '~/types/Label';
import { type NoteLabelInput } from '~/types/NoteLabel';

const log = getLogger('Labels Query');

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
  const slugs = await prisma.label.count({
    where
  });

  if (slugs > 0) {
    const slugs = await prisma.label.count({
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
  return await prisma.label.count({
    where: {
      name: {
        equals: name
      }
    }
  });
}

export async function createLabel({ name }: LabelInput) {
  try {
    if (await nameCheck(name?.trim())) {
      throw new Error('Label Name Already Exists');
    }
    const date = timeString();
    const data = {
      name: name?.trim(),
      createdAt: date,
      updatedAt: date
    };
    const slug = formatSlug({
      format: 'custom',
      slug: data.name
    });

    data.slug = await slugCheck(slug);

    const label = await prisma.label.create({
      data
    });

    return label;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function noteLabel({ name, slug, noteId }: NoteLabelInput) {
  try {
    let label;
    const date = timeString();
    if (!slug) {
      label = await prisma.label.findUnique({
        where: {
          name: name?.trim()
        },
        select: {
          id: true
        }
      });
    } else {
      label = await prisma.label.findUnique({
        where: {
          slug
        },
        select: {
          id: true
        }
      });
    }

    const assignLabel = async () =>
      await prisma.noteLabel.create({
        data: {
          noteId,
          labelId: label.id
        }
      });

    if (!label) {
      const data = {
        name: name?.trim(),
        createdAt: date,
        updatedAt: date
      } as Label;
      const slug = formatSlug({
        format: 'custom',
        slug: data.name
      });

      data.slug = await slugCheck(slug);

      label = await prisma.label.create({
        data
      });

      await assignLabel();
    } else {
      const assignedLabel = await prisma.noteLabel.findUnique({
        where: {
          noteId_labelId: { labelId: label.id, noteId }
        }
      });
      if (!assignedLabel) {
        await assignLabel();
      }
    }

    const notesCount = await prisma.noteLabel.count({
      where: {
        labelId: label.id
      }
    });

    label = await prisma.label.update({
      where: {
        id: label.id
      },
      data: {
        notesCount,
        updatedAt: date
      }
    });

    return label;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function purgeNoteLabels({ noteId }: { noteId: number }) {
  return await prisma.noteLabel.deleteMany({
    where: {
      noteId
    }
  });
}

export async function updateLabel({ id, name, description }: LabelInput) {
  try {
    const date = timeString();
    const data = {
      name: name?.trim(),
      updatedAt: date,
      description
    };

    if (!id) {
      throw new Error('id is required to Update a Label');
    }

    const prevStatus = await prisma.label.findUnique({
      where: {
        id
      },
      select: {
        name: true
      }
    });

    if (prevStatus?.name !== data.name) {
      if (await nameCheck(name?.trim())) {
        throw new Error('Label Name Already Exists');
      }
      const _slug = formatSlug({
        format: 'custom',
        slug: data.name
      });
      data.slug = await slugCheck(_slug);
    }

    const label = await prisma.label.update({
      where: {
        id
      },
      data
    });

    return label;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getLabel({ id, slug, select }) {
  try {
    const where = {} as { id?: number; slug?: string };

    if (id) {
      where.id = id;
    } else if (slug) {
      where.slug = slug;
    } else {
      throw new Error(`Either Label slug or id is required`);
    }
    const label = await prisma.label.findUnique({
      where,
      select: select ?? {
        id: true,
        name: true,
        parentId: true,
        description: true,
        path: true,
        slug: true,
        notesCount: true,
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
    return label;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getLabels({
  filter = {},
  sort = {},
  limit = 25,
  offset = 0
}: {
  filter?: { children?: string; parentId?: number };
  sort?: { field?: string; direction?: string };
  limit?: number;
  offset?: number;
}) {
  try {
    const where = {};

    const categories = await prisma.label.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        notesCount: true
      },
      orderBy: { name: 'asc' },
      take: limit,
      skip: offset
    });

    return {
      count: categories.length,
      totalCount: await prisma.label.count({ where }),
      nodes: categories
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
