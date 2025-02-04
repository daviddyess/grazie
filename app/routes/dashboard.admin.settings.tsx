/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import {
  ActionIcon,
  Box,
  Button,
  Code,
  Stack,
  Table,
  Title
} from '@mantine/core';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { IconEdit, IconSquarePlus } from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import classes from '~/components/Dashboard/AdminPost.module.css';
import SettingEditor from '~/components/Setting/Editor';
import { sentry } from '~/lib/sentry.server';
import { getSettings } from '~/lib/setting.server';
import { createAbility } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'manage', subject: 'Setting' });
  const settings = await getSettings({});
  return { _page: 'dashboard', settings };
}

export default function UserAdmin() {
  const { settings } = useLoaderData();
  const [openEditor, setOpenEditor] = useState(false);
  const [settingEditor, setSettingEditor] = useState(null);

  const rows = settings.nodes.map((row) => (
    <Fragment key={row.slug}>
      <Table.Tr>
        <Table.Td>{row.id}</Table.Td>
        <Table.Td>{row.name}</Table.Td>
        <Table.Td>{row.type}</Table.Td>
        <Table.Td>
          <Code block>{row?.value ?? 'NULL'}</Code>
        </Table.Td>
        <Table.Td>
          <Stack>
            <ActionIcon
              variant="subtle"
              radius="md"
              aria-label="Settings"
              onClick={() => setSettingEditor(row.id)}
            >
              <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          </Stack>
        </Table.Td>
      </Table.Tr>
      {settingEditor === row.id && (
        <Table.Tr>
          <Table.Td colSpan={5}>
            <SettingEditor closeEditor={setSettingEditor} {...row} />
          </Table.Td>
        </Table.Tr>
      )}
    </Fragment>
  ));

  return (
    <>
      <Title>Settings</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
          >
            New Setting
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <SettingEditor closeEditor={setOpenEditor} />
        </Box>
      )}

      <Table stickyHeader striped stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Value</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}
