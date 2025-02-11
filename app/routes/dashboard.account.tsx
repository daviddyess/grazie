/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { dataWithError, redirectWithToast } from 'remix-toast';
import UserAccount from '~/components/User/Account';
import { sentry } from '~/lib/sentry.server';
import { getUserAccount, updateUser } from '~/lib/user.server';
import { accountSchema } from '~/types/User';
import { createAbility, getSession, getUserId } from '~/utils/session.server';
import { validateSchema } from '~/utils/validation';

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId') as number;
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'update',
    subject: 'User',
    item: { id: userId }
  });
  const form = await request.formData();

  const updates = { id: userId };
  const schema = {};
  const username = form.get('username') as string;

  if (username) {
    updates.username = username;
    schema.username = true;
  }
  const displayName = form.get('displayName') as string;

  if (displayName) {
    updates.displayName = displayName;
    schema.displayName = true;
  }
  const email = form.get('email') as string;

  if (email) {
    updates.email = email;
    schema.email = true;
  }
  const currentPassword = form.get('currentPassword') as string;
  const newPassword = form.get('newPassword') as string;

  if (currentPassword && newPassword) {
    updates.currentPassword = currentPassword;
    updates.newPassword = newPassword;
    schema.password = true;
  }
  const colorScheme = form.get('colorScheme') as string;

  if (colorScheme) {
    updates.colorScheme = colorScheme;
    schema.colorScheme = true;
  }

  const file = form.get('file') as string;
  const fileType = form.get('fileType') as string;

  if (file && fileType) {
    const avatar = {} as { mime: string; base64: string; name?: string };
    avatar.mime = fileType;
    avatar.base64 = file.split(',')[1];
    updates.avatar = avatar;
    schema.avatar = true;
  }
  const errors = validateSchema(accountSchema(updates), updates);
  if (errors) {
    return dataWithError(
      { errors, data: updates },
      { message: 'An Error Occurred!' }
    );
  }
  const account = await updateUser(updates);

  if (!account?.errors) {
    return redirectWithToast(`/dashboard/account`, {
      message: 'Account Updated!',
      type: 'success'
    });
  } else {
    return dataWithError(
      { errors: account.errors, data: updates },
      { message: 'An Error Occurred!' }
    );
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUserId = await getUserId(request);
  if (!request?.ability) {
    await createAbility(request);
  }
  const account = currentUserId ? await getUserAccount(currentUserId) : {};

  await sentry(request, {
    action: 'update',
    subject: 'User',
    item: account
  });

  const data = { account, _page: 'dashboard' };

  return data;
}

const Account = () => {
  const { account } = useLoaderData<typeof loader>();
  return <UserAccount account={account} />;
};

export default Account;
