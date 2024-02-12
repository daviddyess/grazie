import { Grid, SimpleGrid, Tabs } from '@mantine/core';
import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import Pager from '~/components/Pager/Pager';
import PostCard from '~/components/Post/PostCard';
import { subject, useAbility } from '~/hooks/useAbility';
import { getPosts } from '~/lib/post.server';
import { setting } from '~/lib/setting.server';
import { pagerParams } from '~/utils/searchParams.server';
import { site, metaSettings } from '@/grazie';

export const meta: MetaFunction = () => {
  return [
    {
      title: metaSettings?.home?.title ?? site?.name ?? 'New Remix App'
    },
    {
      name: 'description',
      content: site?.description ?? 'Welcome to Remix!'
    }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { count, page, pagerLoader } = pagerParams(request, 25);

  const query = {
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const posts = await getPosts(query);

  const data = {
    posts,
    settings: { columns: await setting({ name: 'page.home.columns' }) },
    pager: pagerLoader(posts.totalCount)
  };

  return json(data);
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
