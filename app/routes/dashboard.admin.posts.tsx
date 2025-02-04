/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Table,
  Text,
  Title
} from '@mantine/core';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, useNavigate } from 'react-router';
import {
  IconArrowUpRight,
  IconEdit,
  IconSquarePlus
} from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import classes from '~/components/Dashboard/AdminPost.module.css';
import DateTime from '~/components/DateTime';
import Pager from '~/components/Pager/Pager';
import PostEditor from '~/components/Post/Editor';
import { getPosts } from '~/lib/post.server';
import { sentry } from '~/lib/sentry.server';
import type { Post } from '~/types/Post';
import { pagerParams } from '~/utils/searchParams.server';
import { createAbility } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'manage', subject: 'Post' });
  const { count, page, pagerLoader } = pagerParams(request, 25);

  const query = {
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const posts = await getPosts(query);
  return {
    _page: 'dashboard',
    posts,
    pager: pagerLoader(posts.totalCount)
  };
}

export default function PostAdmin() {
  const { posts } = useLoaderData();
  const [openEditor, setOpenEditor] = useState(false);
  const [postEditor, setPostEditor] = useState(null);
  const navigate = useNavigate();

  const rows =
    posts.nodes.length > 0 ? (
      posts.nodes.map((row: Post) => (
        <Fragment key={row.slug}>
          <Table.Tr>
            <Table.Td>{row.id}</Table.Td>
            <Table.Td>{row.title}</Table.Td>
            <Table.Td>{row.published ? 'Published' : 'Draft'}</Table.Td>
            <Table.Td>
              <DateTime timestamp={row.createdAt} />
            </Table.Td>
            <Table.Td>
              {row?.categories?.length > 0 &&
                row?.categories?.map((cat, index) => (
                  <Text key={cat.slug} component="span" fz="sm" mr={10}>
                    {cat.category.name}
                    {index + 1 < row.categories.length && ','}
                  </Text>
                ))}
            </Table.Td>
            <Table.Td>{row.slug}</Table.Td>
            <Table.Td>
              <Group>
                <ActionIcon
                  variant="subtle"
                  radius="md"
                  aria-label="Posts"
                  onClick={() => setPostEditor(row.id)}
                >
                  <IconEdit
                    style={{ width: '70%', height: '70%' }}
                    stroke={1.5}
                  />
                </ActionIcon>
                <ActionIcon
                  color="green"
                  variant="subtle"
                  radius="md"
                  aria-label="View"
                  onClick={() => navigate(`/post/${row.slug}`)}
                >
                  <IconArrowUpRight
                    style={{ width: '70%', height: '70%' }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
          {postEditor === row.id && (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <PostEditor closeEditor={setPostEditor} {...row} />
              </Table.Td>
            </Table.Tr>
          )}
        </Fragment>
      ))
    ) : (
      <Table.Tr>
        <Table.Td colSpan={6}>No pages have been created!</Table.Td>
      </Table.Tr>
    );

  return (
    <>
      <Title>Posts</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
          >
            New Post
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <PostEditor closeEditor={setOpenEditor} />
        </Box>
      )}
      <Pager />
      <Table stickyHeader striped stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Categories</Table.Th>
            <Table.Th>Slug</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pager />
    </>
  );
}
