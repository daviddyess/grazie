/**
 * Grazie
 * @copyright Copyright (c) 2025 David Dyess II
 * @license MIT see LICENSE
 */
import { type ActionFunctionArgs } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { createBlockGroup } from '~/lib/blockGroup.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'BlockGroup' });

  const form = await request.formData();

  const blockGroup = await createBlockGroup({
    name: form.get('name') as string,
    title: form.get('title') as string,
    description: form.get('description') as string,
    status: form.get('status') === 'enabled',
    blocks: JSON.parse(form.get('blocks') as string)
  });

  if (blockGroup?.id) {
    return redirectWithToast(`/dashboard/admin/block-groups`, {
      message: 'Block Group Created!',
      type: 'success'
    });
  } else return blockGroup;
}
