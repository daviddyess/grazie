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
import { Register } from '~/components/Register';
import { createUser } from '~/lib/user.server';
import { registerSchema } from '~/types/User';
import { site } from '@/grazie';
import { validateSchema } from '~/utils/validation';
import { SEO } from '~/utils/meta';

export function meta({ matches }: { matches: typeof loader }) {
  return SEO({
    title: `Create an Account`,
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
  const displayName = form.get('displayName') as string;
  const username = form.get('username') as string;
  const email = form.get('email') as string;
  const password = form.get('password') as string;
  const data = { username, displayName, email, password };
  const errors = validateSchema(registerSchema, data);

  if (errors) {
    return { errors, data };
  }

  const user = await createUser(data);

  if (user?.errors) {
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
    { message: 'Account Created!', type: 'success' },
    {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    }
  );
}

export default function RegisterPage() {
  return <Register site={site} />;
}
