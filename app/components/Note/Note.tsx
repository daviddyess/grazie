/**
 * Grazie
 * @copyright Copyright (c) 2024-2025 David Dyess II
 * @license MIT see LICENSE
 */
import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Grid,
  Group,
  Menu,
  Text,
  Title,
  rem,
  useMantineTheme
} from '@mantine/core';
import { Link, useSubmit } from '@remix-run/react';
import {
  IconShare,
  IconDotsVertical,
  IconEdit,
  IconClipboardCheck
} from '@tabler/icons-react';
import { TimeSince } from '~/components/DateTime';
import HTMLContent from '~/components/Tiptap/HTMLContent';
import classes from '~/components/Note/NoteCard.module.css';
import { useEffect, useMemo, useState } from 'react';
import NoteEditor from './Editor';
import { unifiedStyles } from '~/utils/unify';
import { useClipboard, useTimeout } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { subject, useAbility } from '~/hooks/useAbility';
import useUser from '~/hooks/useUser';
import { ListViewer } from './ListViewer';

const actionIconStyle = unifiedStyles.icons.action.style;
const actionIconStroke = unifiedStyles.icons.action.stroke;

export default function Note({ data }: { data: ArticleCardProps }) {
  const {
    id,
    image = '',
    createdAt,
    body = {},
    title = '',
    author,
    updatedAt = '',
    labels = [],
    type
  } = data;
  const theme = useMantineTheme();
  const ability = useAbility();
  const canEditNote = useMemo(
    () => ability?.can('edit', subject('note', data)),
    [ability]
  );
  const { isLoggedIn } = useUser();
  const [openEditor, setOpenEditor] = useState(null);
  const submit = useSubmit();
  const clipboard = useClipboard();
  const [copied, setCopied] = useState(false);
  const { start } = useTimeout(() => setCopied(false), 3000);
  const [shareLink, setShareLink] = useState();
  useEffect(() => {
    setShareLink(
      `${window.location.protocol}//${window.location.host}/note/${id}`
    );
  }, [id]);

  useEffect(() => {
    if (copied) {
      start();
      notifications.show({
        title: 'Sharing',
        message: 'Note Link Copied to Clipboard!'
      });
    }
  }, [copied]);
  return (
    <>
      <Card withBorder mb={6} radius="md" className={classes.card}>
        <Card.Section className={classes.header}>
          <Group justify="space-between">
            <Group gap={0} p={4}>
              {labels?.length > 0 ? (
                labels.map(
                  ({
                    label: { name: labelName, slug: catSlug },
                    catId: catNoteId
                  }) => (
                    <Link key={`catgory-${catNoteId}`} to={`/notes/${catSlug}`}>
                      <Badge mr={4} radius="md" size="md" variant="light">
                        {labelName}
                      </Badge>
                    </Link>
                  )
                )
              ) : (
                <Title order={1}>{title}</Title>
              )}
            </Group>

            <Group gap={0} p={4}>
              <TimeSince timestamp={createdAt} pr={4} />
            </Group>
          </Group>
        </Card.Section>
        {title && labels?.length > 0 ? (
          <Card.Section className={classes.header}>
            <Title order={1}>{title}</Title>
          </Card.Section>
        ) : null}
        <Card.Section
          className={classes.body}
          pt={labels?.length > 0 ? 10 : undefined}
        >
          {type === 'text' && <HTMLContent content={body} />}
          {type === 'list' && <ListViewer data={body} />}
        </Card.Section>
        <Card.Section className={classes.footer}>
          <Group gap={0} justify="space-between">
            <Group gap={0}></Group>
            <Group gap={0}>
              {canEditNote && (
                <Menu trigger="click-hover" width="100px">
                  <Menu.Target>
                    <ActionIcon
                      variant="subtle"
                      radius="md"
                      aria-label="Role Editor"
                    >
                      <IconDotsVertical
                        style={actionIconStyle}
                        stroke={actionIconStroke}
                      />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Note</Menu.Label>
                    <Menu.Item
                      leftSection={
                        <IconEdit style={{ width: rem(14), height: rem(14) }} />
                      }
                      onClick={() => setOpenEditor(true)}
                    >
                      Edit
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>
          </Group>
        </Card.Section>
      </Card>
      {canEditNote && openEditor && (
        <Grid.Col span={12}>
          <NoteEditor {...data} closeEditor={setOpenEditor} />
        </Grid.Col>
      )}
    </>
  );
}
