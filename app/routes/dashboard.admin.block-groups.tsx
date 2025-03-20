import { ActionIcon, Box, Button, Stack, Table, Title } from '@mantine/core';
import { IconEdit, IconSquarePlus } from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import BlockGroupEditor from '~/components/BlockGroup/Editor';
import Pager from '~/components/Pager/Pager';
import { getBlocks } from '~/lib/block.server';
import { getBlockGroups } from '~/lib/blockGroup.server';
import { sentry } from '~/lib/sentry.server';
import { pagerParams } from '~/utils/searchParams.server';
import { createAbility } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'manage', subject: 'Category' });
  const { count, page, pagerLoader } = pagerParams(request, 25);

  const blockGroups = await getBlockGroups({ include: { blocks: true } });
  const blocks = await getBlocks({ select: { id: true, title: true } });
  const blocksList = blocks?.nodes.map((block) => ({
    value: block?.id,
    label: block?.title
  }));

  return {
    blockGroups,
    blocksList,
    _page: 'dashboard',
    pager: pagerLoader(blockGroups.totalCount)
  };
}

export const BlockGroups = () => {
  const data = useLoaderData<typeof loader>();
  const [blockGroupEditor, setBlockGroupEditor] = useState<
    number | null | boolean
  >(false);
  const [newBlockGroupEditor, setNewBlockGroupEditor] =
    useState<boolean>(false);
  const rows =
    data?.blockGroups?.nodes.length > 0 ? (
      data?.blockGroups?.nodes?.map((blockGroup) => (
        <Fragment key={blockGroup?.name}>
          <Table.Tr>
            <Table.Td>{blockGroup?.id}</Table.Td>
            <Table.Td>{blockGroup?.name}</Table.Td>
            <Table.Td>{blockGroup?.title}</Table.Td>
            <Table.Td>{blockGroup?.description}</Table.Td>
            <Table.Td>{blockGroup?.status ? 'Enabled' : 'Disabled'}</Table.Td>
            <Table.Td>
              <Stack>
                <ActionIcon
                  variant="subtle"
                  radius="md"
                  aria-label="Categories"
                  onClick={() => setBlockGroupEditor(blockGroup?.id)}
                >
                  <IconEdit
                    style={{ width: '70%', height: '70%' }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Stack>
            </Table.Td>
          </Table.Tr>
          {blockGroupEditor === blockGroup?.id ? (
            <Table.Tr key={`${blockGroup?.name}-editor`}>
              <Table.Td colSpan={6}>
                <BlockGroupEditor
                  {...blockGroup}
                  closeEditor={setBlockGroupEditor}
                  refetch={() => {}}
                />
              </Table.Td>
            </Table.Tr>
          ) : null}
        </Fragment>
      ))
    ) : (
      <Table.Tr>
        <Table.Td colSpan={8}>No Block Groups Stored</Table.Td>
      </Table.Tr>
    );

  return (
    <>
      <Title>Block Groups</Title>
      {!newBlockGroupEditor ? (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setNewBlockGroupEditor(true)}
            variant="light"
          >
            New Block Group
          </Button>
        </Box>
      ) : null}

      {newBlockGroupEditor ? (
        <Box my={10}>
          <BlockGroupEditor
            closeEditor={setNewBlockGroupEditor}
            refetch={() => {}}
          />
        </Box>
      ) : null}
      <Pager />
      <Table stickyHeader striped stickyHeaderOffset={60} miw={700}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pager />
    </>
  );
};

export default BlockGroups;
