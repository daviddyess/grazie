/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Title, Grid, Tabs } from '@mantine/core';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node'; // or cloudflare/deno
import { useNavigate } from '@remix-run/react';
import { redirectWithToast } from 'remix-toast';
import Editor from '~/components/Editor';
import { getLabels, noteLabel } from '~/lib/label.server';
import { updateNote } from '~/lib/note.server';
import { createAbility, getSession } from '~/utils/session.server';
import { site } from '@/grazie';
import { sentry } from '~/lib/sentry.server';
import { SEO } from '~/utils/meta';

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Note' });
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));
  const authorId = session.get('userId') as number;
  const pinned = form.get('published') === 'on' ? true : false;

  const note = await updateNote({
    id: Number(form.get('id')),
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
      message: 'Note Created!',
      type: 'success'
    });
  } else return note;
}
