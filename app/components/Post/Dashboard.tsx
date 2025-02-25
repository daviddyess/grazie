/**
 * Grazie
 * @copyright Copyright (c) 2024-2025 David Dyess II
 * @license MIT see LICENSE
 */
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Table,
  Text,
  Title
} from '@mantine/core';
import {
  IconEdit,
  IconArrowUpRight,
  IconSquarePlus,
  IconTrash
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Fragment } from 'react/jsx-runtime';
import DateTime from '~/components/DateTime';
import Pager from '~/components/Pager/Pager';
import PostEditor from '~/components/Post/Editor';
import type { Post } from '~/types/Post';
import DeletePost from '~/components/Post/Delete';

export default function PostAdmin({ posts }: { posts: Post[] }) {
  const [openEditor, setOpenEditor] = useState(false);
  const [postEditor, setPostEditor] = useState(null);
  const [postDelete, setPostDelete] = useState(null);
  const navigate = useNavigate();

  const rows =
    posts.nodes.length > 0 ? (
      posts.nodes.map((row: Post) => (
        <Fragment key={`post-${row.slug}-${row.id}}`}>
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
                  <Text
                    key={`cat-${cat?.category.slug}-${cat?.id}`}
                    component="span"
                    fz="sm"
                    mr={10}
                  >
                    {cat.category.name}
                    {index + 1 < row.categories.length && ','}
                  </Text>
                ))}
            </Table.Td>
            <Table.Td>{row.slug}</Table.Td>
            <Table.Td>
              <Group gap={1}>
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
                  color="red"
                  variant="subtle"
                  radius="md"
                  aria-label="Delete Page"
                  onClick={() => setPostDelete(row.id)}
                >
                  <IconTrash
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
          {postDelete === row.id && (
            <Modal
              opened
              onClose={() => setPostDelete(null)}
              title={`Delete Post ${row?.title ?? row.slug}?`}
              centered
            >
              <DeletePost id={row.id} cancel={setPostDelete} />
            </Modal>
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
        <Table.Thead>
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
