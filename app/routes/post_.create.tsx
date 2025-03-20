/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Grid, Tabs, Title } from '@mantine/core';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { useLoaderData, useNavigate } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import Editor from '~/components/Editor';
import { getCategories, postCategory } from '~/lib/category.server';
import { createPost } from '~/lib/post.server';
import { sentry } from '~/lib/sentry.server';
import { SEO } from '~/utils/meta';
import { createAbility, getSession } from '~/utils/session.server';

export function meta({ matches }: { matches: typeof loader }) {
  return SEO({
    title: `Create Post`,
    matches
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Post' });
  const categories = await getCategories({});
  const data = { categories };

  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Post' });
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

  const post = await createPost({
    published,
    publishedAt,
    body: form.get('body') as string,
    search: form.get('search') as string,
    title: form.get('title') as string,
    authorId,
    slugFormat,
    slug,
    meta: meta ? JSON.stringify(meta) : null
  });

  const categories = form.get('categories') as string;

  if (categories) {
    const cats = categories.split(',');

    for (const cat of cats) {
      await postCategory({ name: cat, postId: post.id });
    }
  }

  if (post?.slug) {
    return redirectWithToast(`/post/${post.slug}`, {
      message: 'Post Created!',
      type: 'success'
    });
  } else return post;
}

export default function ArticlesCreate() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Posts</Title>
        <Tabs defaultValue="create" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="create">Create</Tabs.Tab>
            <Tabs.Tab value="browse" onClick={() => navigate('/posts')}>
              Browse
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="create" py={10}>
            <Editor post />
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
