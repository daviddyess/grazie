/**
 * Grazie
 * @copyright Copyright (c) 2025 David Dyess II
 * @license MIT see LICENSE
 */
import { type ActionFunctionArgs } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { createBlock } from '~/lib/block.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Block' });

  const form = await request.formData();
  const block = await createBlock({
    name: form.get('name') as string,
    title: form.get('title') as string,
    description: form.get('description') as string,
    status: form.get('status') === 'enabled',
    blockType: form.get('blockType') as string,
    content: form.get('content') as string
  });

  if (block?.id) {
    return redirectWithToast(`/dashboard/admin/blocks`, {
      message: 'Block Created!',
      type: 'success'
    });
  } else return block;
}
