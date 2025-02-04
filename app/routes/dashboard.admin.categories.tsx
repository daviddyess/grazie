/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { ActionIcon, Box, Button, Stack, Table, Title } from '@mantine/core';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { IconEdit, IconSquarePlus } from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import classes from '~/components/Dashboard/AdminPost.module.css';
import CategoryEditor from '~/components/Category/Editor';
import { getCategories } from '~/lib/category.server';
import type { Category } from '~/types/Category';
import { pagerParams } from '~/utils/searchParams.server';
import Pager from '~/components/Pager/Pager';
import { createAbility } from '~/utils/session.server';
import { sentry } from '~/lib/sentry.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'manage', subject: 'Category' });
  const { count, page, pagerLoader } = pagerParams(request, 25);

  const query = {
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const categories = await getCategories(query);
  return {
    _page: 'dashboard',
    categories,
    pager: pagerLoader(categories.totalCount)
  };
}

export default function CategoryAdmin() {
  const { categories } = useLoaderData();
  const [openEditor, setOpenEditor] = useState(false);
  const [categoryEditor, setCategoryEditor] = useState(null);

  const rows =
    categories?.nodes?.length > 0 ? (
      categories.nodes.map((row: Category) => (
        <Fragment key={row.slug}>
          <Table.Tr>
            <Table.Td>{row.id}</Table.Td>
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>{row.description}</Table.Td>
            <Table.Td>{row?.parent ? row.parent.name : '-'}</Table.Td>
            <Table.Td>{row.postsCount}</Table.Td>
            <Table.Td>
              <Stack>
                <ActionIcon
                  variant="subtle"
                  radius="md"
                  aria-label="Categories"
                  onClick={() => setCategoryEditor(row.id)}
                >
                  <IconEdit
                    style={{ width: '70%', height: '70%' }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Stack>
            </Table.Td>
          </Table.Tr>
          {categoryEditor === row.id && (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <CategoryEditor closeEditor={setCategoryEditor} {...row} />
              </Table.Td>
            </Table.Tr>
          )}
        </Fragment>
      ))
    ) : (
      <Table.Tr>
        <Table.Td colSpan={7}>No categories have been created!</Table.Td>
      </Table.Tr>
    );

  return (
    <>
      <Title>Categories</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
          >
            New Category
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <CategoryEditor closeEditor={setOpenEditor} />
        </Box>
      )}
      <Pager />
      <Table stickyHeader striped stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Parent</Table.Th>
            <Table.Th>Posts</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pager />
    </>
  );
}
