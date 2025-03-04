import { type ActionFunctionArgs, redirect } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import { createBlockGroup } from '~/lib/blockGroup.server';
//import { getSession } from '~/session.server';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const form = await request.formData();
    //const session = await getSession(request.headers.get('Cookie'));
    //const userId = session.get('userId') as string;
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
  } catch (error) {
    throw error;
  }
}
