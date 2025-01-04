/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Title, Grid, Tabs, SimpleGrid } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import NoteCard from '~/components/Note/NoteCard';
import { getNotes } from '~/lib/note.server';
import { pagerParams } from '~/utils/searchParams.server';
import Pager from '~/components/Pager/Pager';
import { subject, useAbility } from '~/hooks/useAbility';
import { createAbility, getSession } from '~/utils/session.server';
import { sentry } from '~/lib/sentry.server';
import { SEO } from '~/utils/meta';

export function meta({ matches }: { matches: typeof loader }) {
  return SEO({
    title: `Notes`,
    matches
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { count, page, pagerLoader } = pagerParams(request, 25);
  const session = await getSession(request.headers.get('Cookie'));

  const query = {
    filter: {
      authorId: session.get('userId') as number
    },
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const notes = await getNotes(query);
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'read',
    subject: 'Note',
    items: notes.nodes
  });
  const data = { notes, pager: pagerLoader(notes.totalCount) };

  return json(data);
}

export default function Articles() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const ability = useAbility();

  const notes =
    data?.notes?.nodes?.length > 0 ? (
      data?.notes?.nodes?.map((note) => (
        <NoteCard
          key={note.id}
          data={{
            ...note,
            body: JSON.parse(note.body),
            author: {
              name: note?.author?.displayName,
              description: '',
              image: `${data?.notes?.avatarURL}sm/${note?.author?.avatar}`
            }
          }}
        />
      ))
    ) : (
      <h4>No Notes Stored</h4>
    );

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Notes</Title>
        <Tabs defaultValue="browse" keepMounted={false}>
          <Tabs.List>
            {ability.can('create', subject('Note', {})) && (
              <Tabs.Tab value="create" onClick={() => navigate('/note/create')}>
                Create
              </Tabs.Tab>
            )}
            <Tabs.Tab value="browse">Browse</Tabs.Tab>
          </Tabs.List>
          <Pager />
          <Tabs.Panel value="browse" py={10}>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
              {notes}
            </SimpleGrid>
          </Tabs.Panel>
          <Pager />
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
