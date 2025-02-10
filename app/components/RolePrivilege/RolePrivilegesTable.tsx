/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { ActionIcon, Box, Button, Code, Table, Title } from '@mantine/core';
import classes from '~/components/Dashboard/AdminPost.module.css';
import RolePrivilegeEditor from '~/components/RolePrivilege/Editor';
import RolePrivilegeDelete from '~/components/RolePrivilege/Delete';
import { Fragment, useState } from 'react';
import { IconEdit, IconSquarePlus, IconTrash } from '@tabler/icons-react';
import { type Role } from '~/types/Role';
import { type RolePrivilege } from '~/types/RolePrivilege';
import { unifiedStyles } from '~/utils/unify';

const actionIconStyle = unifiedStyles.icons.action.style;
const actionIconStroke = unifiedStyles.icons.action.stroke;

export default function RolePrivilegesTable({
  role,
  privileges
}: {
  role: Role;
  privileges: { nodes: RolePrivilege[] };
}) {
  const [openEditor, setOpenEditor] = useState(false);
  const [rolePrivilegeEditor, setRolePrivilegeEditor] = useState(null);
  const [rolePrivilegeDelete, setRolePrivilegeDelete] = useState(null);
  const rows =
    privileges?.nodes?.length > 0 ? (
      privileges.nodes.map((row) => (
        <Fragment key={`role-privilege-${row.id}`}>
          <Table.Tr>
            <Table.Td>{row.privilege.subject}</Table.Td>
            <Table.Td>{row.privilege.action}</Table.Td>
            <Table.Td>
              {row?.conditions && <Code block>{row.conditions}</Code>}
            </Table.Td>
            <Table.Td>
              <ActionIcon
                variant="subtle"
                radius="md"
                aria-label="Role Editor"
                onClick={() => setRolePrivilegeEditor(row.id)}
              >
                <IconEdit style={actionIconStyle} stroke={actionIconStroke} />
              </ActionIcon>
              <ActionIcon
                color="red"
                variant="subtle"
                radius="md"
                aria-label="Role Editor"
                onClick={() => setRolePrivilegeDelete(row.id)}
              >
                <IconTrash style={actionIconStyle} stroke={actionIconStroke} />
              </ActionIcon>
            </Table.Td>
          </Table.Tr>
          {rolePrivilegeEditor === row.id && (
            <Table.Tr
              bg={
                'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5)'
              }
            >
              <Table.Td colSpan={5}>
                <RolePrivilegeEditor
                  closeEditor={setRolePrivilegeEditor}
                  {...row}
                />
              </Table.Td>
            </Table.Tr>
          )}
          {rolePrivilegeDelete === row.id && (
            <Table.Tr
              bg={
                'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5)'
              }
            >
              <Table.Td colSpan={5}>
                <RolePrivilegeDelete
                  closeEditor={setRolePrivilegeDelete}
                  {...row}
                />
              </Table.Td>
            </Table.Tr>
          )}
        </Fragment>
      ))
    ) : (
      <Table.Tr>
        <Table.Td colSpan={2}>
          No Privileges Assigned to {role.name?.toUpperCase()} Role
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
      <Title order={2}>{role.name?.toUpperCase()} Role Privileges</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
            color="violet"
          >
            Assign Role Privileges
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <RolePrivilegeEditor closeEditor={setOpenEditor} roleId={role.id} />
        </Box>
      )}
      <Table stickyHeader withTableBorder stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>Subject</Table.Th>
            <Table.Th>Action</Table.Th>
            <Table.Th>Conditions</Table.Th>
            <Table.Th>Options</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  );
}
