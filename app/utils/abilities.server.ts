/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { getUserRoles } from '~/lib/user.server';
import { type RolePrivilege } from '~/types/RolePrivilege';
import { type RoleUser } from '~/types/RoleUser';
import { getLogger } from '~/utils/logger.server';

const log = getLogger('Abilities Utility');

/**
 * CASL-compatible Object for defining abilities
 * @param integer user_id
 * @returns array[object, ...] abilities
 */
export async function abilityBuilder({
  userRoles,
  userId
}: {
  userRoles?: RoleUser;
  userId: number;
}) {
  try {
    if (!userRoles) {
      userRoles = await getUserRoles({ userId });
    }
    const abilities = [] as RoleUser[];

    // Builds the abilities array as { subject, action }
    await userRoles.forEach(async (userRole) => {
      if (userRole?.role?.privileges) {
        await userRole.role.privileges.forEach((priv: RolePrivilege) => {
          if (!priv.conditions) {
            priv.conditions = null;
          }
          const rules = {
            action: priv?.privilege?.action,
            subject: priv?.privilege?.subject,
            conditions:
              typeof priv?.conditions === 'string'
                ? JSON.parse(priv?.conditions)
                : null,
            inverted: priv?.inverted
          };
          if (userId) {
            switch (rules.conditions?.owner) {
              case 'id':
                rules.conditions = {
                  id: userId
                };

                break;
              case 'authorId':
                rules.conditions = {
                  authorId: userId
                };

                break;
              case 'userId':
                rules.conditions = {
                  userId
                };
                break;
              default:
                break;
            }
          }

          abilities.push(rules);
        });
      }
    });
    // Translate masks and return abilities
    return await abilities;
  } catch (err) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
