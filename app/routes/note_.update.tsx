/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs } from 'react-router'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { noteLabel } from '~/lib/label.server';
import { getNote, updateNote } from '~/lib/note.server';
import { createAbility } from '~/utils/session.server';
import { sentry } from '~/lib/sentry.server';

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Note' });
  const form = await request.formData();
  // const session = await getSession(request.headers.get('Cookie'));
  //const authorId = session.get('userId') as number;
  const pinned = form.get('published') === 'on' ? true : false;
  const id = Number(form.get('id'));
  const noteCheck = await getNote({ id });

  await sentry(request, {
    action: 'update',
    subject: 'Note',
    item: noteCheck
  });

  const note = await updateNote({
    id,
    title: form.get('title') as string,
    body: form.get('body') as string,
    search: form.get('search') as string,
    pinned
  });

  const labels = form.get('labels') as string;

  if (labels) {
    const tags = labels.split(',');

    for (const label of tags) {
      await noteLabel({ name: label, noteId: note.id });
    }
  }

  if (note?.id) {
    return redirectWithToast(`/note/${note.id}`, {
      message: 'Note Updated!',
      type: 'success'
    });
  } else return note;
}
