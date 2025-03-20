/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Grid, Tabs, Title } from '@mantine/core';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import Editor from '~/components/Editor';
import { getLabels, noteLabel } from '~/lib/label.server';
import { createNote } from '~/lib/note.server';
import { sentry } from '~/lib/sentry.server';
import { SEO } from '~/utils/meta';
import { createAbility, getSession } from '~/utils/session.server';

export function meta({ matches }: { matches: typeof loader }) {
  return SEO({
    title: `Create Note`,
    matches
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Note' });
  const labels = await getLabels({});
  const data = { labels };

  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Note' });
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));
  const authorId = session.get('userId') as number;
  const pinned = form.get('published') === 'on' ? true : false;

  const note = await createNote({
    title: form.get('title') as string,
    body: form.get('body') as string,
    search: form.get('search') as string,
    type: form.get('type') as string,
    authorId,
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

export default function NoteCreate() {
  const navigate = useNavigate();

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Notes</Title>
        <Tabs defaultValue="create" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="create">Create</Tabs.Tab>
            <Tabs.Tab value="browse" onClick={() => navigate('/notes')}>
              Browse
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="create" py={10}>
            <Editor note />
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
