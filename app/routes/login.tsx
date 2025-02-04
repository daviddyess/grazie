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
import { redirectWithToast } from 'remix-toast';
import { getSession, commitSession } from '~/utils/session.server';
import { Login } from '~/components/Login';
import { userLogin } from '~/lib/user.server';
import { site } from '@/grazie';
import { loginSchema } from '~/types/User';
import { validateSchema } from '~/utils/validation';
import { SEO } from '~/utils/meta';

export function meta({ matches }: { matches: typeof loader }) {
  return SEO({
    title: `Login`,
    matches
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('userId')) {
    // Redirect to the home page if they are already signed in.
    return redirect('/');
  } else {
    return null;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const form = await request.formData();
  const email = form.get('email') as string;
  const password = form.get('password') as string;
  const data = { email, password };

  const errors = validateSchema(loginSchema, data);

  if (errors) {
    return { errors, data };
  }

  const user = await userLogin(data);

  if (user?.errors) {
    if (user.errors.status === 'RESET_REQUIRED') {
      return redirectWithToast('/user/reset?required=true', {
        message: 'Password Reset Required',
        type: 'error'
      });
    }
    return { errors: user.errors, data };
  }

  session.set('userId', user.id);
  session.set('isLoggedIn', true);
  session.set('userData', {
    name: user.username,
    settings: user?.settings ?? {},
    avatar: user?.avatar,
    _id: user._id
  });
  session.set('darkMode', user?.settings?.darkMode ?? false);

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

export default function LoginPage() {
  return <Login />;
}
