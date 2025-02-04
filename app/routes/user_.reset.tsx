/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from 'react-router';
import { redirect } from 'react-router';
import {
  dataWithSuccess,
  redirectWithSuccess,
  redirectWithToast
} from 'remix-toast';
import { getSession, commitSession } from '~/utils/session.server';
import {
  resetPassword,
  requestReset as userRequestReset
} from '~/lib/user.server';
import { resetRequestSchema, resetSchema } from '~/types/User';
import { validateSchema } from '~/utils/validation';
import { SEO } from '~/utils/meta';
import { UserReset } from '~/components/User/Reset';

export function meta({ matches }: { matches: typeof loader }) {
  return SEO({
    title: `Reset Password`,
    matches
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const url = new URL(request.url);
  const id = url.searchParams.get('id') as string;
  const [email, resetKey] = id ? JSON.parse(atob(id)) : [];

  if (session.has('userId')) {
    // Redirect to the home page if they are already signed in.
    return redirect('/');
  } else {
    return { reset: { email, resetKey } };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const form = await request.formData();
  const email = form.get('email') as string;
  const password = form.get('password') as string | undefined;
  const resetKey = form.get('resetKey') as string | undefined;
  const requestReset = form.get('requestReset') as string;

  let errors;
  if (requestReset) {
    errors = validateSchema(resetRequestSchema, { email });

    if (errors) {
      return { request: { errors }, data: { email } };
    }

    if (await userRequestReset({ email })) {
      return dataWithSuccess(
        { reset: { email } },
        {
          message: 'Reset Request Sent!'
        }
      );
    }
  } else {
    errors = validateSchema(resetSchema, { resetKey, password });

    if (errors) {
      return { reset: { errors }, data: { resetKey, password } };
    } else {
      const reset = await resetPassword({ email, resetKey, password });
      if (reset?.errors) {
        return {
          reset: { errors: reset.errors },
          data: { resetKey, password }
        };
      } else {
        return redirectWithSuccess('/login', {
          message: 'Password Reset Successfully!'
        });
      }
    }
  }

  // Login succeeded, send them to the home page.
  return redirectWithToast(
    '/',
    { message: 'Logged in Successfully!', type: 'success' },
    {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    }
  );
}

export default function ResetPage() {
  return <UserReset />;
}
