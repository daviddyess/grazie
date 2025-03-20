import { ActionIcon, Box, Button, Stack, Table, Title } from '@mantine/core';
import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { IconEdit, IconSquarePlus } from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import BlockEditor from '~/components/Block/Editor';
import Pager from '~/components/Pager/Pager';
import { getBlocks } from '~/lib/block.server';
import { sentry } from '~/lib/sentry.server';
import { pagerParams } from '~/utils/searchParams.server';
import { createAbility } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'manage', subject: 'Category' });
  const { count, page, pagerLoader } = pagerParams(request, 25);

  const blocks = await getBlocks({
    limit: count,
    offset: page ? (page - 1) * count : 0
  });

  return {
    blocks,
    _page: 'dashboard',
    pager: pagerLoader(blocks.totalCount)
  };
}

export const BlockList = () => {
  const data = useLoaderData<typeof loader>();
  const [openEditor, setOpenEditor] = useState<boolean>(false);
  const [editBlockId, setEditBlockId] = useState<number | null>(null);
  const rows =
    data?.blocks?.nodes.length > 0 ? (
      data?.blocks?.nodes?.map((block) => (
        <Fragment key={`${block?.id}-${block?.name}`}>
          <Table.Tr>
            <Table.Td>{block.id}</Table.Td>
            <Table.Td>{block?.blockType}</Table.Td>
            <Table.Td>{block?.title}</Table.Td>
            <Table.Td>{block?.status ? 'Enabled' : 'Disabled'}</Table.Td>
            <Table.Td>
              <Stack>
                <ActionIcon
                  variant="subtle"
                  radius="md"
                  aria-label="Categories"
                  onClick={() => setEditBlockId(block?.id)}
                >
                  <IconEdit
                    style={{ width: '70%', height: '70%' }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Stack>
            </Table.Td>
          </Table.Tr>
          {editBlockId === block?.id ? (
            <Table.Tr key={`${block?.id}-editor`}>
              <Table.Td colSpan={8}>
                <BlockEditor
                  block={block}
                  closeEditor={setEditBlockId}
                  refetch={() => {}}
                />
              </Table.Td>
            </Table.Tr>
          ) : null}
        </Fragment>
      ))
    ) : (
      <Table.Tr>
        <Table.Td colSpan={8}>No Blocks Stored</Table.Td>
      </Table.Tr>
    );

  return (
    <>
      <Title>Blocks</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
          >
            New Block
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <BlockEditor closeEditor={setOpenEditor} />
        </Box>
      )}
      <Pager />
      <Table stickyHeader striped stickyHeaderOffset={60} miw={700}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Block Type</Table.Th>
            <Table.Th>Title</Table.Th>
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

export default BlockList;
