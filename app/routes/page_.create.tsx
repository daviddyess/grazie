/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { site } from '@/grazie';
import { Grid, Tabs, Title } from '@mantine/core';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { useLoaderData, useNavigate } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import Editor from '~/components/Editor';
import { createPage } from '~/lib/page.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility, getSession } from '~/utils/session.server';

export function meta() {
  return [{ title: `Create Page${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Page' });
  const data = {};

  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Page' });
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));
  const authorId = session.get('userId') as number;
  const published = form.get('published') === 'on' ? true : false;
  const publishedAt = form.get('publishedAt') as string;
  const slugFormat = form.get('slugFormat') as string;
  const slug = form.get('slug') as string;
  const metaData = form.get('meta') as string;
  let meta;
  if (metaData) {
    meta = JSON.parse(metaData);
  }
  const page = await createPage({
    published,
    publishedAt,
    body: form.get('body') as string,
    search: form.get('search') as string,
    title: form.get('title') as string,
    summary: form.get('summary') as string,
    authorId,
    slugFormat,
    slug,
    meta: meta ? JSON.stringify(meta) : null
  });

  if (page?.slug) {
    return redirectWithToast(`/page/${page.slug}`, {
      message: 'Page Created!',
      type: 'success'
    });
  } else return page;
}

export default function ArticlesCreate() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Pages</Title>
        <Tabs defaultValue="create" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="create">Create</Tabs.Tab>
            <Tabs.Tab value="browse" onClick={() => navigate('/pages')}>
              Browse
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="create" py={10}>
            <Editor page />
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
