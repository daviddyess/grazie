import { ActionIcon, Box, Button, Stack, Table, Title } from '@mantine/core';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { IconEdit, IconSquarePlus } from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import classes from '~/components/Dashboard/AdminPost.module.css';
import DateTime from '~/components/DateTime';
import CategoryEditor from '~/components/Category/Editor';
import { getCategories } from '~/lib/category.server';
import { Category } from '~/types/Category';

export async function loader({ request }: LoaderFunctionArgs) {
  const categories = await getCategories({});
  return json({ _page: 'dashboard', categories });
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
      <Table stickyHeader stickyHeaderOffset={60} miw={700}>
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
    </>
  );
}