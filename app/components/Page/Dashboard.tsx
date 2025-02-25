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
  Modal,
  Table,
  Title
} from '@mantine/core';
import { useLoaderData, useNavigate } from 'react-router';
import {
  IconArrowUpRight,
  IconEdit,
  IconSquarePlus,
  IconTrash
} from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import classes from '~/components/Dashboard/AdminPost.module.css';
import DateTime from '~/components/DateTime';
import PageEditor from '~/components/Page/Editor';
import Pager from '~/components/Pager/Pager';
import type { Page } from '~/types/Page';
import DeletePage from '~/components/Page/Delete';

export default function PageDashboard({ pages }: { pages: Page[] }) {
  const [openEditor, setOpenEditor] = useState(false);
  const [pageEditor, setPageEditor] = useState(null);
  const [pageDelete, setPageDelete] = useState(null);
  const navigate = useNavigate();

  const rows =
    pages?.nodes?.length > 0 ? (
      pages.nodes.map((row: Page) => (
        <Fragment key={row.slug}>
          <Table.Tr>
            <Table.Td>{row.id}</Table.Td>
            <Table.Td>{row.title}</Table.Td>
            <Table.Td>{row.published ? 'Published' : 'Draft'}</Table.Td>
            <Table.Td>{row.summary}</Table.Td>
            <Table.Td>
              <DateTime timestamp={row.createdAt} />
            </Table.Td>
            <Table.Td>{row.slug}</Table.Td>
            <Table.Td>
              <Group gap={1}>
                <ActionIcon
                  variant="subtle"
                  radius="md"
                  aria-label="Edit Page"
                  onClick={() => setPageEditor(row.id)}
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
                  onClick={() => setPageDelete(row.id)}
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
                  onClick={() => navigate(`/page/${row.slug}`)}
                >
                  <IconArrowUpRight
                    style={{ width: '70%', height: '70%' }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
          {pageEditor === row.id && (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <PageEditor closeEditor={setPageEditor} {...row} />
              </Table.Td>
            </Table.Tr>
          )}
          {pageDelete === row.id && (
            <Modal
              opened
              onClose={() => setPageDelete(null)}
              title={`Delete Page ${row.title}?`}
              centered
            >
              <DeletePage id={row.id} cancel={setPageDelete} />
            </Modal>
          )}
        </Fragment>
      ))
    ) : (
      <Table.Tr>
        <Table.Td colSpan={7}>No pages have been created!</Table.Td>
      </Table.Tr>
    );

  return (
    <>
      <Title>Pages</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
          >
            New Page
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <PageEditor closeEditor={setOpenEditor} />
        </Box>
      )}
      <Pager />
      <Table stickyHeader striped stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Summary</Table.Th>
            <Table.Th>Created</Table.Th>
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
