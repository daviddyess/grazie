import { Title, Grid, Tabs } from '@mantine/core';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json, redirect } from '@remix-run/node'; // or cloudflare/deno
import { useNavigate } from '@remix-run/react';
import Editor from '~/components/Editor';
import { getLabels, noteLabel } from '~/lib/label.server';
import { createNote } from '~/lib/note.server';
import { createAbility, getSession } from '~/utils/session.server';
import { site } from '@/grazie';
import { sentry } from '~/lib/sentry.server';

export function meta() {
  return [{ title: `Create Note${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Note' });
  const labels = await getLabels({});
  const data = { labels };

  return json(data);
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
    return redirect(`/note/${note.id}`);
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
