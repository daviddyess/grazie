/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Grid, Title } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Note from '~/components/Note/Note';
import { getNote } from '~/lib/note.server';
import { useState } from 'react';
import NoteEditor from '~/components/Note/Editor';
import { createAbility } from '~/utils/session.server';
import { sentry } from '~/lib/sentry.server';
import { SEO } from '~/utils/meta';
import type { Note as NoteType } from '~/types/Note';

export function meta({
  data: {
    note: {
      createdAt,
      title,
      meta,
      publishedAt,
      author: { displayName }
    }
  }
}: {
  data: { note: NoteType };
}) {
  return SEO({
    createdAt,
    title,
    meta,
    publishedAt,
    author: displayName
  });
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const note = await getNote({ id: Number(params?.id) });

  await sentry(request, { action: 'read', subject: 'Note', item: note });
  const data = {
    note
  };
  return json(data);
}

export default function NoteView() {
  const data = useLoaderData<typeof loader>();
  const { note } = data;
  const [openEditor, setOpenEditor] = useState(null);

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2} mb="md">
          Notes
        </Title>
        <Note
          data={{
            ...note,
            body: JSON.parse(note.body),
            author: {
              name: note?.author?.displayName,
              description: '',
              image: `${note?.avatarURL}sm/${note?.author?.avatar}`
            }
          }}
        />
      </Grid.Col>
      {openEditor && (
        <Grid.Col span={12}>
          <NoteEditor {...data} closeEditor={setOpenEditor} />
        </Grid.Col>
      )}
    </Grid>
  );
}
