import { type ActionFunctionArgs } from 'react-router'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { updateBlock } from '~/lib/block.server';
//import { getSession } from '~/session.server';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const form = await request.formData();
    //const session = await getSession(request.headers.get('Cookie'));
    //const userId = session.get('userId') as string;
    const blockGroup = await updateBlock({
      id: Number(form.get('id')),
      name: form.get('name') as string,
      title: form.get('title') as string,
      description: form.get('description') as string,
      status: form.get('status') === 'enabled',
      blockType: form.get('blockType') as string,
      content: form.get('content') as string
    });

    if (blockGroup?.id) {
      return redirectWithToast(`/dashboard/admin/blocks`, {
        message: 'Block Updated!',
        type: 'success'
      });
    } else return blockGroup;
  } catch (error) {
    throw error;
  }
}
