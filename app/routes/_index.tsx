/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Grid, SimpleGrid, Tabs } from '@mantine/core';
import {
  redirect,
  useLoaderData,
  useNavigate,
  type MetaFunction
} from 'react-router';
import type { Route } from './+types/_index';
import Pager from '~/components/Pager/Pager';
import PostCard from '~/components/Post/PostCard';
import { subject, useAbility } from '~/hooks/useAbility';
import { getPosts } from '~/lib/post.server';
import { sentry } from '~/lib/sentry.server';
import { setting } from '~/lib/setting.server';
import { pagerParams } from '~/utils/searchParams.server';
import { site, metaSettings } from '@/grazie';
import { createAbility, getSession } from '~/utils/session.server';
import { SEO } from '~/utils/meta';

export const meta: MetaFunction = ({ matches }) => {
  return SEO({
    meta: {
      seo: {
        title: metaSettings?.home?.title ?? '',
        description: site?.description
      }
    },
    contentPage: false,
    matches
  });
};

export async function loader({ request }: Route.LoaderArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const columns = await setting({ name: 'page.home.columns', defaultValue: 3 });

  const { count, page, pagerLoader } = pagerParams(request, 24);

  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId') as number;

  const query = {
    filter: { published: true },
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const posts = await getPosts(query, userId);

  if (
    !(await sentry(
      request,
      {
        action: 'read',
        subject: 'Post',
        item: { published: true }
      },
      // Prevents 404 error
      { reject: false }
    ))
  ) {
    return redirect('/login');
  }

  const data = {
    posts,
    settings: {
      columns
    },
    pager: pagerLoader(posts.totalCount)
  };

  return data;
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const ability = useAbility();
  const {
    posts: { nodes },
    settings
  } = data;
  const navigate = useNavigate();
  const posts =
    nodes?.length > 0 ? (
      nodes?.map((post) => (
        <PostCard
          key={post.id}
          data={{
            ...post,
            body: JSON.parse(post.body),
            author: {
              name: post?.author?.displayName,
              description: '',
              image: `${data?.posts?.avatarURL}sm/${post?.author?.avatar}`
            }
          }}
        />
      ))
    ) : (
      <h4>No Posts Stored</h4>
    );

  return (
    <Grid>
      <Grid.Col span={12}>
        <Tabs defaultValue="browse" keepMounted={false}>
          <Tabs.List>
            {ability.can('create', subject('Post', {})) && (
              <Tabs.Tab value="create" onClick={() => navigate('/post/create')}>
                Create
              </Tabs.Tab>
            )}
            <Tabs.Tab value="browse">Browse</Tabs.Tab>
          </Tabs.List>
          <Pager />
          <Tabs.Panel value="browse" py={10}>
            <SimpleGrid cols={{ base: 1, sm: settings?.columns ?? 2 }}>
              {posts}
            </SimpleGrid>
          </Tabs.Panel>
          <Pager />
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
