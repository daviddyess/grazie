/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
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
  rem,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import { useClipboard, useTimeout } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  IconShare,
  IconClipboardCheck,
  IconDotsVertical,
  IconEdit
} from '@tabler/icons-react';
import { TimeSince } from '~/components/DateTime';
import PageEditor from '~/components/Page/Editor';
import HTMLContent from '~/components/Tiptap/HTMLContent';
import classes from '~/components/Page/Page.module.css';
import { subject, useAbility } from '~/hooks/useAbility';
import { unifiedStyles } from '~/utils/unify';

type PageProps = {
  image?: string;
  createdAt: string;
  published: boolean;
  title: string;
  body: object;
  footer?: string;
  slug: string;
  author: {
    displayName: string;
    description: string;
    avatar: string;
  };
  updatedAt?: string;
  avatarURL?: string;
};

const actionIconStyle = unifiedStyles.icons.action.style;
const actionIconStroke = unifiedStyles.icons.action.stroke;

export default function PageCard({ page }: { page: PageProps }) {
  const theme = useMantineTheme();
  const ability = useAbility();
  const canEditPage = useMemo(
    () => ability?.can('edit', subject('Page', page)),
    [ability]
  );
  const [openEditor, setOpenEditor] = useState(false);
  const clipboard = useClipboard();
  const [copied, setCopied] = useState(false);
  const { start } = useTimeout(() => setCopied(false), 3000);
  const [shareLink, setShareLink] = useState('');
  useEffect(() => {
    setShareLink(
      `${window.location.protocol}//${window.location.host}/page/${page?.slug}`
    );
  }, [page?.slug]);

  useEffect(() => {
    if (copied) {
      start();
      notifications.show({
        title: 'Sharing',
        message: 'Post Link Copied to Clipboard!'
      });
    }
  }, [copied]);

  return (
    <>
      <Card mb={6} radius="md" className={classes.card}>
        <Card.Section className={classes.header}>
          <Group justify="space-between">
            {page?.title ? (
              <Title order={1} className={classes.title}>
                {page.title}
              </Title>
            ) : null}
            <Group gap={0} p={4}>
              {page?.categories?.length > 0 &&
                page?.categories.map(
                  ({
                    category: { name: categoryName, slug: catSlug },
                    id: catPageId
                  }) => (
                    <Badge
                      key={`${catPageId}`}
                      mr={4}
                      radius="md"
                      size="md"
                      variant="light"
                    >
                      <Link to={`/pages/${catSlug}`}>{categoryName}</Link>
                    </Badge>
                  )
                )}
            </Group>

            <Group gap={0}>
              <TimeSince timestamp={page?.updatedAt} pr={4} />
            </Group>
          </Group>
        </Card.Section>

        <HTMLContent content={page.body} classes={classes} />

        {page?.footer ? (
          <Group mt="xs">
            <Text size="xs" c="dimmed">
              {page?.footer}
            </Text>
          </Group>
        ) : null}

        <Card.Section className={classes.footer}>
          <Group justify="space-between">
            <Group>
              <Avatar
                src={`${page?.avatarURL}sm/${page?.author?.avatar}`}
                radius="sm"
              />
              <div>
                <Text size="sm" fw={500} pl={3}>
                  {page?.author.displayName}
                </Text>
                <Text size="xs" c="dimmed" pl={3}>
                  {page?.author?.description}
                </Text>
              </div>
              <Group gap={10} ml={10}>
                {!page?.published && (
                  <Badge color="yellow" variant="light">
                    Draft
                  </Badge>
                )}
              </Group>
            </Group>
            <Group gap={0}>
              <ActionIcon
                variant="subtle"
                color={copied ? theme.colors.green[7] : theme.colors.blue[6]}
                onClick={() => {
                  clipboard.copy(shareLink);
                  setCopied(true);
                }}
              >
                {copied ? (
                  <IconClipboardCheck
                    size={22}
                    color={theme.colors.green[7]}
                    stroke={1.5}
                  />
                ) : (
                  <IconShare
                    size={22}
                    color={theme.colors.blue[6]}
                    stroke={1.5}
                  />
                )}
              </ActionIcon>
              {canEditPage && (
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
                    <Menu.Label>Post</Menu.Label>
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
      {canEditPage && openEditor && (
        <Grid.Col span={12}>
          <PageEditor {...page} closeEditor={setOpenEditor} />
        </Grid.Col>
      )}
    </>
  );
}
