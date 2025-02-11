/**
 * Grazie
 * @package Grazie
 * @copyright Copyright (c) 2024-2025 David Dyess II
 * @license MIT see LICENSE
 */
import { getLogger } from '~/utils/logger.server';
import { avatarURL, admins } from '~/utils/config.server';
import { prisma } from '~/utils/prisma.server';
import { randomNumber, timeString } from '~/utils/generic.server';
import type { User, UserLogin, UserSystem } from '~/types/User';
import { setting } from '~/lib/setting.server';
import { hashPassword, verifyPassword } from '~/utils/hashPassword.server';
import { processAvatar } from '~/utils/image.server';
import DataCache from '~/utils/dataCache.server';
import { sendMail, userResetRequest } from '~/utils/mailer.server';

const log = getLogger('User');
/**
 * Create a User
 * @param user
 * @returns User object
 */
export async function createUser({
  username,
  displayName,
  email,
  password
}: UserSystem) {
  try {
    const userCheck = await prisma.user.findMany({
      where: {
        OR: [{ username }, { email }]
      },
      select: {
        username: true,
        email: true
      }
    });

    if (userCheck.length > 0) {
      const errors = {} as { username?: string; email?: string };

      userCheck.forEach((u) => {
        if (u?.username === username) {
          errors.username = `${username} is already registered`;
        }
        if (u?.email === email) {
          errors.email = `${email} is already registered`;
        }
      });

      return { errors };
    }

    if (!displayName) {
      displayName = username as string;
    }

    const hashedPassword = await hashPassword(password as string);

    const date = timeString();
    let user;
    await prisma.$transaction(async (db) => {
      user = await db.user.create({
        data: {
          displayName,
          username: username as string,
          email: email as string,
          password: hashedPassword,
          createdAt: date,
          updatedAt: date,
          lastLoginAt: date
        }
      });

      await db.userSetting.create({
        data: {
          userId: user.id,
          name: 'colorScheme',
          value: 'auto',
          type: 'string'
        }
      });

      let userRoles;

      if (admins?.includes(email)) {
        userRoles = ['admin'];
      } else {
        userRoles = await setting({
          name: 'user.roles',
          defaultValue: ['everyone', 'user']
        });
      }

      const roles = await db.role.findMany({
        where: {
          name: {
            in: userRoles
          }
        },
        select: {
          id: true
        }
      });

      for (const role of roles) {
        await db.roleUser.create({
          data: {
            active: true,
            roleId: role.id,
            userId: user.id,
            createdAt: date,
            updatedAt: date
          }
        });
      }
    });

    return user;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
/**
 * Update a User
 * @param user
 * @returns User object
 */
export async function updateUser({
  id,
  username,
  displayName,
  email,
  currentPassword,
  newPassword,
  avatar,
  colorScheme
}: UserSystem) {
  try {
    const date = timeString();
    const prevUser = await prisma.user.findUnique({
      where: {
        id
      }
    });
    const data = {
      displayName,
      updatedAt: date,
      avatar: avatar ? '' : undefined
    };
    const errors = {};
    if (username) {
      const usernameCheck = await prisma.user.findMany({
        where: {
          AND: [
            {
              id: {
                not: id
              }
            },
            { username }
          ]
        },
        select: {
          id: true
        }
      });
      if (usernameCheck.length > 0) {
        errors.username = 'Username is already in use';
      }
      data.username = username;
    }
    if (avatar) {
      avatar.name = `${username || prevUser.username}_${id}_${Date.now()}.webp`;
      avatar.deleteFile = prevUser?.avatar;
      await processAvatar({ file: avatar });
      data.avatar = avatar?.name;
    }
    if (email) {
      const emailCheck = await prisma.user.findMany({
        where: {
          AND: [
            {
              id: {
                not: id
              }
            },
            { email }
          ]
        },
        select: {
          id: true
        }
      });
      if (emailCheck.length > 0) {
        errors.email = 'Email address is already in use';
      }
      // Add email verification
      data.email = email;
    }
    if (currentPassword && newPassword) {
      const verification = await verifyPassword(
        currentPassword,
        prevUser.password
      );

      if (!verification) {
        error.currentPassword = 'Incorrect Password';
      }

      data.password = await hashPassword(newPassword);
    }
    if (Object.keys(errors).length > 0) {
      return { errors };
    }

    const user = await prisma.user.update({
      where: {
        id
      },
      data
    });

    if (colorScheme) {
      await prisma.userSetting.upsert({
        where: {
          userId_name: { userId: id, name: 'colorScheme' }
        },
        create: {
          userId: id,
          name: 'colorScheme',
          value: colorScheme,
          type: 'string'
        },
        update: {
          userId: id,
          name: 'colorScheme',
          value: colorScheme,
          type: 'string'
        }
      });
    }

    return user;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
/**
 * User Login
 * @param User
 * @returns object User
 */
export async function userLogin({ email, password }: UserLogin) {
  try {
    const login = await prisma.user.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        password: true
      }
    });

    if (!login) {
      return { errors: { email: 'Email Address is not registered' } };
    }

    let verification;

    try {
      verification = await verifyPassword(password, login.password);
    } catch (err) {
      return { errors: { status: 'RESET_REQUIRED' } };
    }

    if (!verification) {
      return { errors: { password: 'Incorrect Password' } };
    }

    const date = timeString();

    await prisma.user.update({
      where: {
        id: login.id
      },
      data: {
        lastLoginAt: date
      }
    });

    return {
      id: login.id,
      username: login.username,
      displayName: login.displayName
    };
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
export async function requestReset({ email }: { email: string }) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        username: true,
        email: true
      }
    });

    if (!user) {
      return { errors: { email: 'Email Address is not registered' } };
    }

    const resetKey = `${randomNumber(8, true)}`;

    DataCache.set(`resetKey-${email}-${resetKey}`, user.id);
    await sendMail(userResetRequest({ resetKey, ...user }));
    return true;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
export async function resetPassword({ email, resetKey, password }) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        username: true,
        email: true
      }
    });

    if (!user) {
      return { errors: { email: 'User was not Found!' } };
    }

    const verification = DataCache.get(`resetKey-${email}-${resetKey}`);

    if (!verification || verification !== user.id) {
      return { errors: { resetKey: 'Incorrect Reset Key' } };
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        password: await hashPassword(password)
      }
    });

    return true;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

/**
 * Get User by ID
 * @param id
 * @returns object User
 */
export async function getUserById(id: User['id']) {
  try {
    const user = (await prisma.user.findUnique({
      where: {
        id: id as number
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        avatar: true
      }
    })) as User;

    if (!user) {
      throw new Error('User ID was not Found!');
    }

    user.isLoggedIn = true;

    return user;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
/**
 * Get User by Username
 * @param username
 * @returns object User
 */
export async function getUserByUsername(username: User['username']) {
  try {
    const user = (await prisma.user.findUnique({
      where: {
        username: username as string
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        avatar: true
      }
    })) as User;

    if (!user) {
      throw new Error('User ID was not Found!');
    }

    user.isLoggedIn = true;

    return user;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
/**
 * Get User Account
 * @param id
 * @returns object User
 */
export async function getUserAccount(id: User['id']) {
  try {
    const account = await prisma.user.findUnique({
      where: {
        id: id as number
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        email: true,
        avatar: true,
        settings: {
          select: {
            name: true,
            value: true
          }
        }
      }
    });

    if (!account) {
      //throw new Error('User ID was not Found!');
      return { id: null };
    }
    // account.settings is an array, we transform it into an object
    const settings = account?.settings ?? [];
    account.settings = {};

    if (settings) {
      for (const setting of settings) {
        account.settings[setting.name] = setting.value;
      }
    }

    if (!account?.settings?.colorScheme) {
      account.settings = {
        ...account.settings,
        colorScheme: 'auto'
      };
    }

    account.isLoggedIn = true;

    return {
      ...account,
      avatar: account?.avatar
        ? {
            sm: `${avatarURL}sm/${account?.avatar}`,
            md: `${avatarURL}md/${account?.avatar}`,
            lg: `${avatarURL}lg/${account?.avatar}`
          }
        : null
    };
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
/**
 * Get User Roles
 * @param User
 * @returns
 */
export async function getUserRoles({ userId = null }: { userId: User['id'] }) {
  try {
    return await prisma.roleUser.findMany({
      where: {
        userId,
        active: true,
        role: {
          active: true
        }
      },
      select: {
        role: {
          select: {
            id: true,
            name: true,
            privileges: {
              select: {
                inverted: true,
                conditions: true,
                privilege: {
                  select: {
                    subject: true,
                    action: true
                  }
                }
              }
            }
          }
        }
      }
    });
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
/**
 * Get Users
 * @param param0
 * @returns User[]
 */
export async function getUsers({ filter, select, limit = 25, offset = 0 }) {
  try {
    const where = {};
    if (filter) {
      if (filter?.not) {
        if (filter?.not?.roleId) {
          where.roles = {
            none: {
              roleId: filter.not.roleId
            }
          };
        }
      }
    }
    if (!select) {
      select = {
        id: true,
        displayName: true,
        username: true
      };
    }
    const data = await prisma.user.findMany({
      where,
      select,
      orderBy: { id: 'asc' },
      take: limit,
      skip: offset
    });

    const totalCount = await prisma.user.count({ where });

    return { count: data.length, totalCount, nodes: data, storage: avatarURL };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
/**
 * User Library
 * @copyright Copyright (c) 2024 David Dyess II
 */
