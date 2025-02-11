/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Grid } from '@mantine/core';
import type { Route } from './+types/post_.$slug';
import { useLoaderData } from 'react-router';
import Post from '~/components/Post/Post';
import { getPost } from '~/lib/post.server';
import { site } from '@/grazie';
import { getComments } from '~/lib/comment.server';
import { CommentList } from '~/components/Comment/CommentList';
import { useState } from 'react';
import PostEditor from '~/components/Post/Editor';
import { createAbility, getSession } from '~/utils/session.server';
import { sentry } from '~/lib/sentry.server';
import { empty } from '~/utils/generic';
import { SEO } from '~/utils/meta';
import type { Post as PostType } from '~/types/Post';

export function meta({
  data: {
    post: {
      createdAt,
      title,
      meta,
      publishedAt,
      author: { displayName }
    }
  },
  matches
}: {
  data: { post: PostType };
  matches: typeof loader;
}) {
  return SEO({
    createdAt,
    title,
    meta,
    publishedAt,
    author: displayName,
    matches
  });
}

export async function loader({ params, request }: Route.LoaderArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId') as number;
  const post = await getPost({ slug: params?.slug }, userId);

  await sentry(request, { action: 'read', subject: 'Post', item: post });

  if (post?.body) {
    post.body = JSON.parse(post.body);
  }

  const data = {
    post,
    comments: await getComments({
      filter: { postId: post?.id },
      sort: { field: 'path', order: 'asc' },
      limit: 10
    })
  };

  return data;
}

export default function PostView() {
  const data = useLoaderData<typeof loader>();
  const { post, comments } = data;
  const [openEditor, setOpenEditor] = useState(null);

  return (
    <Grid>
      <Grid.Col span={12}>
        <Post post={post} />
      </Grid.Col>
      {openEditor && (
        <Grid.Col span={12}>
          <PostEditor {...data} closeEditor={setOpenEditor} />
        </Grid.Col>
      )}
      <Grid.Col span={12}>
        <CommentList postId={post.id} data={comments} />
      </Grid.Col>
    </Grid>
  );
}
