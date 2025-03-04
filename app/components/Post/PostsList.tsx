/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Title, Grid, Tabs, useMantineTheme } from '@mantine/core';
import { useLoaderData, useNavigate } from 'react-router';
import PostCard from '~/components/Post/PostCard';
import Pager from '~/components/Pager/Pager';
import { subject, useAbility } from '~/hooks/useAbility';
import useUser from '~/hooks/useUser';
import {
  IconBookmarkFilled,
  IconHeart,
  IconHeartFilled
} from '@tabler/icons-react';

export default function PostsList({ tab = 'browse' }: { tab?: string }) {
  const data = useLoaderData();
  const navigate = useNavigate();
  const ability = useAbility();
  const { isLoggedIn } = useUser();
  const theme = useMantineTheme();

  const posts =
    data?.posts?.nodes?.length > 0 ? (
      data?.posts?.nodes?.map((post) => (
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
        <Title order={2}>
          {data?.posts?.category
            ? `${data?.posts?.category?.name?.toUpperCase()} `
            : ''}
          {data?.posts?.favorites && `Favorite `}
          {data?.posts?.bookmarks && `Saved `}
          Posts
        </Title>
        <Tabs defaultValue={tab} keepMounted={false}>
          <Tabs.List>
            {ability.can('create', subject('Post', {})) && (
              <Tabs.Tab value="create" onClick={() => navigate('/post/create')}>
                Create
              </Tabs.Tab>
            )}
            <Tabs.Tab
              value="browse"
              onClick={tab !== 'browse' ? () => navigate('/posts') : undefined}
            >
              Browse
            </Tabs.Tab>
            {isLoggedIn && (
              <>
                <Tabs.Tab
                  value="favorites"
                  aria-label="Favorited Posts"
                  onClick={
                    tab !== 'favorites'
                      ? () => navigate('/posts/favorites')
                      : undefined
                  }
                >
                  <IconHeartFilled
                    size={22}
                    stroke={1.5}
                    color={theme.colors.red[6]}
                  />
                </Tabs.Tab>
                <Tabs.Tab
                  value="bookmarks"
                  aria-label="Saved Posts"
                  onClick={
                    tab !== 'bookmarks'
                      ? () => navigate('/posts/bookmarks')
                      : undefined
                  }
                >
                  <IconBookmarkFilled
                    size={22}
                    color={theme.colors.yellow[6]}
                    stroke={1.5}
                  />
                </Tabs.Tab>
              </>
            )}
          </Tabs.List>
          <Pager />
          <Tabs.Panel value={tab} py={10}>
            {posts}
          </Tabs.Panel>
          <Pager />
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
