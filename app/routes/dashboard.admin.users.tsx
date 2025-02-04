/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Table, Title } from '@mantine/core';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import classes from '~/components/Dashboard/AdminPost.module.css';
import DateTime from '~/components/DateTime';
import Pager from '~/components/Pager/Pager';
import { sentry } from '~/lib/sentry.server';
import { getUsers } from '~/lib/user.server';
import { pagerParams } from '~/utils/searchParams.server';
import { createAbility } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'manage', subject: 'User' });
  const { count, page, pagerLoader } = pagerParams(request, 25);

  const query = {
    select: {
      id: true,
      username: true,
      displayName: true,
      email: true,
      createdAt: true,
      banned: true
    },
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const users = await getUsers(query);
  return {
    _page: 'dashboard',
    users,
    pager: pagerLoader(users.totalCount)
  };
}

export default function UserAdmin() {
  const { users } = useLoaderData();

  const rows = users.nodes.map((row) => (
    <Table.Tr key={`user-${row.id}-${row.username}`}>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.username}</Table.Td>
      <Table.Td>{row.displayName}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>
        <DateTime timestamp={row.createdAt} />
      </Table.Td>

      <Table.Td>{row.banned ? 'Yes' : 'No'}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Title>Users</Title>
      <Pager />
      <Table stickyHeader striped stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Display</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Joined</Table.Th>
            <Table.Th>Banned</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pager />
    </>
  );
}
