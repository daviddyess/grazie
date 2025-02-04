/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Title, Grid, Tabs } from '@mantine/core';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import Editor from '~/components/Editor';
import { getCategories } from '~/lib/category.server';
import { getPost } from '~/lib/post.server';
import { createAbility } from '~/utils/session.server';
import { site } from '@/grazie';
import { useAbility } from '~/hooks/useAbility';
import { subject } from '@casl/ability';
import { sentry } from '~/lib/sentry.server';
import { SEO } from '~/utils/meta';

export function meta({
  data: {
    post: { title }
  },
  matches
}: {
  data: { post: { title: string } };
  matches: typeof loader;
}) {
  return SEO({
    title: `${title}${site?.separator}Edit`,
    matches
  });
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const categories = await getCategories({});
  const post = await getPost({ slug: params.slug });

  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'update', subject: 'Post', item: post });
  const data = { categories, post, _page: 'post' };
  return data;
}

export default function ArticlesCreate() {
  const ability = useAbility();
  const navigate = useNavigate();

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Posts</Title>
        <Tabs defaultValue="editor" keepMounted={false}>
          <Tabs.List>
            {ability.can('create', subject('Post', {})) && (
              <Tabs.Tab value="create" onClick={() => navigate('/post/create')}>
                Create
              </Tabs.Tab>
            )}

            <Tabs.Tab value="browse" onClick={() => navigate('/posts')}>
              Browse
            </Tabs.Tab>
            <Tabs.Tab value="editor">Edit</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="editor" py={10}>
            <Editor post />
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
