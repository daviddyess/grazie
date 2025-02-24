import { prisma } from '~/utils/prisma.server';
import type { BlockGroup, BlockGroupInput } from '~/types/BlockGroup';

export async function createBlockGroup({
  name,
  title,
  description,
  status,
  options,
  blocks
}: BlockGroupInput) {
  let data;
  await prisma.$transaction(async (db) => {
    data = await db.blockGroup.create({
      data: {
        name,
        title,
        description,
        options,
        status
      }
    });
    if (blocks && blocks?.length > 0) {
      for (const block of blocks) {
        await db.blockGroupBlock.create({
          data: {
            groupId: data.id,
            blockId: block,
            status: true
          }
        });
      }
    }
  });
  return data;
}

export async function updateBlockGroup({
  id,
  name,
  title,
  description,
  status,
  blocks,
  options
}: BlockGroupInput) {
  await prisma.$transaction(async (db) => {
    if (blocks && blocks?.length > 0) {
      const assignedBlocks = await db.blockGroupBlock.findMany({
        where: {
          groupId: id
        }
      });
      if (assignedBlocks.length > 0) {
        await db.blockGroupBlock.deleteMany({
          where: {
            groupId: id,
            blockId: {
              notIn: blocks
            }
          }
        });
      }
      for (const block of blocks) {
        if (!assignedBlocks.find((b) => b.blockId === block)) {
          await db.blockGroupBlock.create({
            data: {
              groupId: id,
              blockId: block,
              status: true
            }
          });
        }
      }
    } else {
      await db.blockGroupBlock.deleteMany({
        where: {
          groupId: id
        }
      });
    }
  });
  return prisma.blockGroup.update({
    where: {
      id
    },
    data: {
      name,
      title,
      description,
      options,
      status
    }
  });
}

export async function deleteBlockGroup(blockGroup: BlockGroup) {
  return prisma.blockGroup.delete({
    where: {
      id: blockGroup.id
    }
  });
}
/**
 * Get a BlockGroup
 * @param [object]
 * @returns
 */
export async function getBlockGroup({ id, name }: BlockGroup) {
  if (!id && !name) {
    throw new Error(
      `id (int) [${id}] or name (string) [${name}] is required for getBlockGroup`
    );
  }
  const where = name ? { name } : { id };

  return prisma.blockGroup.findUnique({
    where
  });
}
/**
 * Get Blocks in a BlockGroup
 * @param [object]
 * @returns
 */
export async function getBlocksGroup({ id, name }: BlockGroup) {
  if (!id && !name) {
    throw new Error(
      `id (int) [${id}] or name (string) [${name}] is required for getBlocksGroup`
    );
  }
  const where = name ? { name } : { id };

  const group = await prisma.blockGroup.findUnique({
    where,
    select: { id: true, status: true }
  });

  if (!group || !group.status) {
    return [];
  }

  const blocks = await prisma.blockGroupBlock.findMany({
    where: {
      groupId: group.id
    },
    select: { blockId: true, block: true }
  });
  return blocks.map((block) => block.block);
}

export async function getBlockGroups({
  select,
  include
}: { select?: any; include?: any } = {}) {
  const blockGroups = await prisma.blockGroup.findMany({ select, include });
  return {
    count: blockGroups.length,
    totalCount: await prisma.blockGroup.count(),
    nodes: blockGroups
  };
}
