/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { ActionIcon, Box, Button, Group, Table, Title } from '@mantine/core';
import { IconEdit, IconSquarePlus } from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import classes from '~/components/Dashboard/AdminPost.module.css';
import Pager from '~/components/Pager/Pager';
import PrivilegeEditor from '~/components/Privilege/Editor';
import { getPrivileges } from '~/lib/privilege.server';
import { sentry } from '~/lib/sentry.server';
import { pagerParams } from '~/utils/searchParams.server';
import { createAbility } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'manage', subject: 'Privilege' });
  const { count, page, pagerLoader } = pagerParams(request, 25);

  const query = {
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const privileges = await getPrivileges(query);
  return {
    _page: 'dashboard',
    privileges,
    pager: pagerLoader(privileges.totalCount)
  };
}

export default function UserAdmin() {
  const { privileges } = useLoaderData();
  const [openEditor, setOpenEditor] = useState(false);
  const [privilegeEditor, setPrivilegeEditor] = useState(null);

  const rows = privileges.nodes.map((row) => (
    <Fragment key={`priv-${row.subject}-${row.action}-${row.id}`}>
      <Table.Tr
        bg={
          privilegeEditor === row.id
            ? 'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-9)'
            : undefined
        }
      >
        <Table.Td>{row.id}</Table.Td>
        <Table.Td>{row.subject}</Table.Td>
        <Table.Td>{row.action}</Table.Td>
        <Table.Td>
          <Group>
            <ActionIcon
              variant="subtle"
              radius="md"
              aria-label="Privilege Editor"
              onClick={() => setPrivilegeEditor(row.id)}
            >
              <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
      {privilegeEditor === row.id && (
        <Table.Tr
          bg={
            'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5)'
          }
        >
          <Table.Td colSpan={4}>
            <PrivilegeEditor closeEditor={setPrivilegeEditor} {...row} />
          </Table.Td>
        </Table.Tr>
      )}
    </Fragment>
  ));

  return (
    <>
      <Title>Privileges</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
          >
            New Privilege
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <PrivilegeEditor closeEditor={setOpenEditor} />
        </Box>
      )}
      <Pager />
      <Table stickyHeader striped stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Subject</Table.Th>
            <Table.Th>Action</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pager />
    </>
  );
}
