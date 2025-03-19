/**
 * Grazie
 * @copyright Copyright (c) 2025 David Dyess II
 * @license MIT see LICENSE
 */
import { type ActionFunctionArgs } from 'react-router'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { getBlockGroup, updateBlockGroup } from '~/lib/blockGroup.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const form = await request.formData();
  const id = Number(form.get('id'));
  const item = await getBlockGroup({ id });

  await sentry(request, {
    action: 'update',
    subject: 'BlockGroup',
    item
  });

  const blockGroup = await updateBlockGroup({
    id,
    name: form.get('name') as string,
    title: form.get('title') as string,
    description: form.get('description') as string,
    status: form.get('status') === 'enabled',
    blocks: JSON.parse(form.get('blocks') as string)
  });

  if (blockGroup?.id) {
    return redirectWithToast(`/dashboard/admin/block-groups`, {
      message: 'Block Group Updated!',
      type: 'success'
    });
  } else return blockGroup;
}
