/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { deletePage, getPage } from '~/lib/page.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const id = Number(form.get('id') as string);
  if (!request?.ability) {
    await createAbility(request);
  }
  const pageCheck = await getPage({ id });

  await sentry(request, { action: 'update', subject: 'Page', item: pageCheck });

  const deleted = await deletePage({
    id
  });

  if (deleted) {
    return redirectWithToast(
      request.headers?.get('Referer') ?? '/dashboard/pages',
      {
        message: 'Page Deleted!',
        type: 'success'
      }
    );
  } else return deleted;
}
