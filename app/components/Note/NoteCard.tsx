/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Text,
  Tooltip,
  useMantineTheme
} from '@mantine/core';
import { Link } from 'react-router';
import { IconHeart, IconBookmark, IconShare } from '@tabler/icons-react';
import { TimeSince } from '~/components/DateTime';
import HTMLContent from '~/components/Tiptap/HTMLContent';
import classes from '~/components/Note/NoteCard.module.css';
import { type NoteLabel } from '~/types/NoteLabel';
import { ListViewer } from './ListViewer';
import { useElementSize } from '@mantine/hooks';

interface NoteCardProps {
  id: number;
  image?: string;
  labels?: NoteLabel[];
  createdAt: number;
  title: string;
  body: object;
  footer?: string;
  author: {
    name: string;
    description: string;
    image: string;
  };
  updatedAt?: string;
  slug?: string;
}

export default function NoteCard({
  data: {
    id,
    image = '',
    labels = [],
    createdAt,
    body = {},
    title = '',
    footer = '',
    author,
    updatedAt = '',
    type
  },
  ...others
}: {
  data: NoteCardProps;
}) {
  const theme = useMantineTheme();
  const { ref: contentRef, height } = useElementSize();

  return (
    <Card withBorder mb={6} radius="md" className={classes.card} {...others}>
      <Card.Section className={classes.header}>
        <Group justify="space-between">
          <Group gap={0} p={4}>
            {labels?.length > 0 ? (
              labels.map(
                ({
                  label: { name: labelName, slug: labelSlug },
                  labelId: labelNoteId
                }) => (
                  <Link key={`label-${labelNoteId}`} to={`/posts/${labelSlug}`}>
                    <Badge mr={4} radius="md" size="md" variant="light">
                      {labelName}
                    </Badge>
                  </Link>
                )
              )
            ) : (
              <Anchor
                className={classes.title}
                component={Link}
                fw={700}
                to={`/note/${id}`}
              >
                {title}
              </Anchor>
            )}
          </Group>

          <Group gap={0} p={4}>
            <TimeSince timestamp={createdAt} pr={4} />
          </Group>
        </Group>
      </Card.Section>
      {title && labels?.length > 0 ? (
        <Card.Section className={classes.header}>
          <Anchor
            className={classes.title}
            component={Link}
            fw={700}
            gradient={{ from: 'indigo', to: 'blue', deg: 90 }}
            pl={4}
            to={`/note/${id}`}
            variant="gradient"
          >
            {title}
          </Anchor>
        </Card.Section>
      ) : null}
      <Card.Section
        className={classes.body}
        pt={labels?.length > 0 ? 10 : undefined}
        style={{ maxHeight: '60px' }}
      >
        <div ref={contentRef}>
          {type === 'text' && <HTMLContent content={body} />}
          {type === 'list' && <ListViewer data={body} />}
        </div>
      </Card.Section>
      <Card.Section pl={4}>
        {height > 60 && (
          <Tooltip label="View Note">
            <Button
              component={Link}
              size="compact-md"
              variant="subtle"
              to={`/note/${id}`}
            >
              . . .
            </Button>
          </Tooltip>
        )}
      </Card.Section>
      {footer ? (
        <Group mt="xs">
          <Text size="xs" c="dimmed">
            {footer}
          </Text>
        </Group>
      ) : null}
    </Card>
  );
}
