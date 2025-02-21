import { prisma } from '~/utils/prisma.server';
import { type Block, type BlockInput } from '~/types/Block';
import { BlockTypesList } from '~/blocks';

export async function createBlock(block: BlockInput) {
  return prisma.block.create({
    data: {
      blockType: block.blockType,
      name: block.name,
      title: block.title,
      description: block.description,
      content: block.content,
      status: block.status
    }
  });
}

export async function updateBlock(block: BlockInput) {
  const blockGroup = await prisma.blockGroup.findFirst({
    where: {
      id: block.groupId
    }
  });
  if (!blockGroup) {
    throw new Error('Block group not found');
  }
  return prisma.block.update({
    where: {
      id: block.id
    },
    data: {
      name: block.name,
      groupId: block.groupId,
      title: block.title,
      description: block.description,
      content: block.content
    }
  });
}

export async function deleteBlock(block: Block) {
  return prisma.block.delete({
    where: {
      id: block.id
    }
  });
}

export async function getBlock(block: Block) {
  return prisma.block.findUnique({
    where: {
      id: block.id
    }
  });
}

export async function getBlocks({
  filter,
  sort,
  limit,
  offset,
  select
}: {
  filter?: { groupId?: number };
  sort?: { field?: string; direction?: string };
  limit?: number;
  offset?: number;
  select?: object;
} = {}) {
  const where = filter?.groupId ? { groupId: filter.groupId } : {};
  const blocks = await prisma.block.findMany({
    where,
    select: select ?? undefined,
    take: limit,
    skip: offset,
    orderBy: {
      [sort?.field ?? 'title']: sort?.direction ? sort?.direction : 'asc'
    }
  });
  return {
    count: blocks.length,
    totalCount: await prisma.block.count({ where }),
    nodes: blocks
  };
}

export function getBlockTypes() {
  return BlockTypesList;
}
