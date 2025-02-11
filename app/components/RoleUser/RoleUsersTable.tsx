/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { ActionIcon, Box, Button, Table, Title } from '@mantine/core';
import { IconEdit, IconSquarePlus, IconTrash } from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import DateTime from '~/components/DateTime';
import classes from '~/components/Dashboard/AdminPost.module.css';
import RoleUserDelete from '~/components/RoleUser/Delete';
import RoleUserEditor from '~/components/RoleUser/Editor';
import { type Role } from '~/types/Role';
import { type RoleUser } from '~/types/RoleUser';
import { unifiedStyles } from '~/utils/unify';

const actionIconStyle = unifiedStyles.icons.action.style;
const actionIconStroke = unifiedStyles.icons.action.stroke;

export default function RoleUsersTable({
  role,
  users
}: {
  role: Role;
  users: { nodes: RoleUser[] };
}) {
  const [openEditor, setOpenEditor] = useState(false);

  const [roleUserEditor, setRoleUserEditor] = useState(null);
  const [roleUserDelete, setRoleUserDelete] = useState(null);

  const rows =
    users?.nodes?.length > 0 ? (
      users.nodes.map((row) => (
        <Fragment key={`role-user-${row.id}`}>
          <Table.Tr>
            <Table.Td>{row.user.id}</Table.Td>
            <Table.Td>{row.user.username}</Table.Td>
            <Table.Td>{row.user.displayName}</Table.Td>
            <Table.Td>{row.user.email}</Table.Td>
            <Table.Td>
              <DateTime timestamp={row.user.createdAt} />
            </Table.Td>

            <Table.Td>{row.user.banned ? 'Yes' : 'No'}</Table.Td>
            <Table.Td>
              <ActionIcon
                variant="subtle"
                radius="md"
                aria-label="Role Editor"
                onClick={() => setRoleUserEditor(row.id)}
              >
                <IconEdit style={actionIconStyle} stroke={actionIconStroke} />
              </ActionIcon>
              <ActionIcon
                color="red"
                variant="subtle"
                radius="md"
                aria-label="Role Editor"
                onClick={() => setRoleUserDelete(row.id)}
              >
                <IconTrash style={actionIconStyle} stroke={actionIconStroke} />
              </ActionIcon>
            </Table.Td>
          </Table.Tr>
          {roleUserEditor === row.id && (
            <Table.Tr
              bg={
                'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5)'
              }
            >
              <Table.Td colSpan={5}>
                <RoleUserEditor closeEditor={setRoleUserEditor} {...row} />
              </Table.Td>
            </Table.Tr>
          )}
          {roleUserDelete === row.id && (
            <Table.Tr
              bg={
                'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5)'
              }
            >
              <Table.Td colSpan={5}>
                <RoleUserDelete closeEditor={setRoleUserDelete} {...row} />
              </Table.Td>
            </Table.Tr>
          )}
        </Fragment>
      ))
    ) : (
      <Table.Tr>
        <Table.Td colSpan={6}>
          No Users Assigned to {role.name?.toUpperCase()} Role
        </Table.Td>
      </Table.Tr>
    );

  return (
    <Box
      style={{
        border: '1px solid var(--mantine-color-dark-6)',
        padding: '10px'
      }}
    >
      <Title order={2}>{role.name?.toUpperCase()} Role Users</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
            color="yellow"
          >
            Assign Role Users
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <RoleUserEditor closeEditor={setOpenEditor} roleId={role.id} />
        </Box>
      )}
      <Table stickyHeader withTableBorder stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Display</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Joined</Table.Th>
            <Table.Th>Banned</Table.Th>
            <Table.Th>Options</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  );
}
