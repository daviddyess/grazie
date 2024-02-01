import { ActionIcon, Box, Button, Group, Table, Title } from '@mantine/core';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  IconCheck,
  IconEdit,
  IconShieldStar,
  IconSquarePlus,
  IconUserShield,
  IconX
} from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import classes from '~/components/Dashboard/AdminPost.module.css';
import RoleEditor from '~/components/Role/Editor';
import RolePrivilegesWrapper from '~/components/RolePrivilege/RolePrivilegesFetcherWrapper';
import RoleUsersWrapper from '~/components/RoleUser/RoleUsersFetcherWrapper';
import { getRoles } from '~/lib/role.server';
import { unifiedStyles } from '~/utils/unify';

export async function loader({ request }: LoaderFunctionArgs) {
  const roles = await getRoles({});
  return json({ _page: 'dashboard', roles });
}

const actionIconStyle = unifiedStyles.icons.action.style;
const actionIconStroke = unifiedStyles.icons.action.stroke;

export default function UserAdmin() {
  const { roles } = useLoaderData();
  const [openEditor, setOpenEditor] = useState(false);
  const [roleEditor, setRoleEditor] = useState(null);
  const [rolePrivileges, setRolePrivileges] = useState(null);
  const [roleUsers, setRoleUsers] = useState(null);

  const rows = roles.nodes.map((row) => (
    <Fragment key={`role-${row.name}-${row.id}`}>
      <Table.Tr
        bg={
          roleEditor === row.id || roleUsers === row.id
            ? 'var(--mantine-color-dark-9)'
            : undefined
        }
      >
        <Table.Td>{row.id}</Table.Td>
        <Table.Td>{row.name}</Table.Td>
        <Table.Td>
          {row.active ? <IconCheck color="green" /> : <IconX color="red" />}
        </Table.Td>
        <Table.Td>{row.description}</Table.Td>
        <Table.Td>
          <Group>
            <ActionIcon
              variant="subtle"
              radius="md"
              aria-label="Role Editor"
              onClick={() => setRoleEditor(row.id)}
            >
              <IconEdit style={actionIconStyle} stroke={actionIconStroke} />
            </ActionIcon>
            <ActionIcon
              color="violet"
              variant="subtle"
              radius="md"
              aria-label="Role Privileges"
              onClick={() => setRolePrivileges(row.id)}
            >
              <IconShieldStar
                style={actionIconStyle}
                stroke={actionIconStroke}
              />
            </ActionIcon>
            <ActionIcon
              color="gold"
              variant="subtle"
              radius="md"
              aria-label="Role Users"
              onClick={() => setRoleUsers(row.id)}
            >
              <IconUserShield
                style={actionIconStyle}
                stroke={actionIconStroke}
              />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
      {roleEditor === row.id && (
        <Table.Tr bg={'var(--mantine-color-dark-5)'}>
          <Table.Td colSpan={5}>
            <RoleEditor closeEditor={setRoleEditor} {...row} />
          </Table.Td>
        </Table.Tr>
      )}
      {rolePrivileges === row.id && (
        <Table.Tr bg={'var(--mantine-color-dark-5)'}>
          <Table.Td colSpan={5}>
            <RolePrivilegesWrapper role={row} />
          </Table.Td>
        </Table.Tr>
      )}
      {roleUsers === row.id && (
        <Table.Tr bg={'var(--mantine-color-dark-5)'}>
          <Table.Td colSpan={5}>
            <RoleUsersWrapper role={row} />
          </Table.Td>
        </Table.Tr>
      )}
    </Fragment>
  ));

  return (
    <>
      <Title>Roles</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
          >
            New Role
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <RoleEditor closeEditor={setOpenEditor} />
        </Box>
      )}

      <Table stickyHeader striped stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Active</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}
