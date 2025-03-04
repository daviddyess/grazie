import { type ActionFunctionArgs, redirect } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { createBlock } from '~/lib/block.server';
//import { getSession } from '~/session.server';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const form = await request.formData();
    //const session = await getSession(request.headers.get('Cookie'));
    //const userId = session.get('userId') as string;
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
  } catch (error) {
    throw error;
  }
}
