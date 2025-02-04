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
  Group,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import { Link } from 'react-router';
import { IconShare, IconClipboardCheck } from '@tabler/icons-react';
import { TimeSince } from '~/components/DateTime';
import HTMLContent from '~/components/Tiptap/HTMLContent';
import classes from '~/components/Page/Page.module.css';
import { useEffect, useState } from 'react';
import { useClipboard, useTimeout } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

interface PageProps {
  image?: string;
  createdAt: string;
  title: string;
  body: object;
  footer?: string;
  slug: string;
  author: {
    name: string;
    description: string;
    image: string;
  };
  updatedAt?: string;
}

export default function PageCard({
  data: {
    image = '',
    categories = [],
    createdAt,
    body = {},
    title = '',
    slug,
    footer = '',
    author,
    updatedAt = ''
  }
}: {
  data: PageProps;
}) {
  const theme = useMantineTheme();
  const clipboard = useClipboard();
  const [copied, setCopied] = useState(false);
  const { start } = useTimeout(() => setCopied(false), 3000);
  const [shareLink, setShareLink] = useState();
  useEffect(() => {
    setShareLink(
      `${window.location.protocol}//${window.location.host}/page/${slug}`
    );
  }, [slug]);

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
    <Card mb={6} radius="md" className={classes.card}>
      <Card.Section className={classes.header}>
        <Group justify="space-between">
          {title ? (
            <Title order={1} className={classes.title}>
              {title}
            </Title>
          ) : null}
          <Group gap={0} p={4}>
            {categories?.length > 0 &&
              categories.map(
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
            <TimeSince timestamp={updatedAt} pr={4} />
          </Group>
        </Group>
      </Card.Section>

      <HTMLContent content={body} classes={classes} />

      {footer ? (
        <Group mt="xs">
          <Text size="xs" c="dimmed">
            {footer}
          </Text>
        </Group>
      ) : null}

      <Card.Section className={classes.footer}>
        <Group justify="space-between">
          <Group>
            <Avatar src={author.image} radius="sm" />
            <div>
              <Text size="sm" fw={500} pl={3}>
                {author.name}
              </Text>
              <Text size="xs" c="dimmed" pl={3}>
                {author.description}
              </Text>
            </div>
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
          </Group>
        </Group>
      </Card.Section>
    </Card>
  );
}
