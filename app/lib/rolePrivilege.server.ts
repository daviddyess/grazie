/**
 * Grazie
 * @package Role Privilege Library
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { getLogger } from '~/utils/logger.server';
import { prisma } from '~/utils/prisma.server';
import { type RolePrivilegeInput } from '~/types/RolePrivilege';

const log = getLogger('Roles Privileges Query');

export async function createRolePrivilege({
  roleId,
  privilegeId,
  inverted,
  conditions,
  description
}: RolePrivilegeInput) {
  try {
    if (typeof conditions === 'string') {
      conditions = conditions.trim();
    }
    if (typeof conditions === 'object') {
      conditions = JSON.stringify(conditions);
    }

    return await prisma.rolePrivilege.create({
      data: {
        roleId,
        privilegeId,
        inverted,
        conditions,
        description
      }
    });
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function updateRolePrivilege({
  id,
  roleId,
  privilegeId,
  inverted,
  conditions,
  description
}: RolePrivilegeInput) {
  try {
    if (typeof conditions === 'string') {
      conditions = conditions.trim();
    }
    if (typeof conditions === 'object') {
      conditions = JSON.stringify(conditions);
    }
    return await prisma.rolePrivilege.update({
      where: { id },
      data: {
        roleId,
        privilegeId,
        inverted,
        conditions,
        description
      }
    });
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function removeRolePrivilege({ id }: RolePrivilegeInput) {
  try {
    return await prisma.rolePrivilege.delete({
      where: { id }
    });
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
/**
 * Get Role Users
 * @param { filter }
 * @returns
 */
export async function getRolePrivileges({ roleId }: { roleId: number }) {
  try {
    const where = { roleId };

    const rolePrivileges = await prisma.rolePrivilege.findMany({
      where,
      select: {
        id: true,
        roleId: true,
        privilegeId: true,
        inverted: true,
        conditions: true,
        description: true,
        role: {
          select: {
            id: true,
            name: true,
            active: true
          }
        },
        privilege: {
          select: {
            id: true,
            subject: true,
            action: true
          }
        }
      },
      orderBy: [
        { privilege: { subject: 'asc' } },
        { privilege: { action: 'asc' } }
      ]
    });

    return {
      count: rolePrivileges.length,
      totalCount: await prisma.rolePrivilege.count({ where }),
      nodes: rolePrivileges
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
