/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { createCookieSessionStorage, redirect } from 'react-router';
import { session as config } from '~/utils/config.server';
import type { User } from '~/types/User';
import { getUserAccount, getUserRoles } from '~/lib/user.server';
import { abilityBuilder } from './abilities.server';
import { createMongoAbility } from '@casl/ability';

const { name, maxAge, secrets, secure } = config;

type SessionData = {
  userId: number | null;
  isLoggedIn: boolean;
  userData?: {
    name: string;
    settings?: any | object;
    avatar?: string | null;
    _id?: string | null;
  };
  darkMode?: boolean;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: name ?? '__session',
      httpOnly: true,
      maxAge,
      path: '/',
      sameSite: 'lax',
      secrets: secrets ?? ['s3cret1'],
      secure
    }
  });

export async function getUserId(request: Request): Promise<User['id']> {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  return userId;
}

export async function createAbility(request) {
  const userId = await getUserId(request);
  const userRoles = await getUserRoles({ userId });
  const abilities = await abilityBuilder({ userRoles, userId });
  if (!request.ability) {
    request.ability = createMongoAbility(abilities);
  }
  return abilities;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  const user = userId ? await getUserAccount(userId) : {};
  user.abilities = await createAbility(request);

  if (user) return user;

  throw await logout(request);
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  });
}

export { getSession, commitSession, destroySession };
