/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { LoaderFunctionArgs } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { destroySession, getSession } from '~/utils/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  return redirectWithToast(
    '/login',
    { message: 'Logged Out!', type: 'success' },
    {
      headers: {
        'Set-Cookie': await destroySession(session)
      }
    }
  );
};
