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
  Text,
  Title,
  rem,
  useMantineTheme
} from '@mantine/core';
import { Link, useSubmit } from 'react-router';
import {
  IconHeart,
  IconBookmark,
  IconShare,
  IconMessage,
  IconEye,
  IconDotsVertical,
  IconEdit,
  IconHeartFilled,
  IconBookmarkFilled,
  IconClipboardCheck
} from '@tabler/icons-react';
import { TimeSince } from '~/components/DateTime';
import HTMLContent from '~/components/Tiptap/HTMLContent';
import classes from '~/components/Post/PostCard.module.css';
import { type CategoryPost } from '~/types/CategoryPost';
import { useEffect, useMemo, useState } from 'react';
import PostEditor from './Editor';
import { unifiedStyles } from '~/utils/unify';
import { useClipboard, useTimeout } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { subject, useAbility } from '~/hooks/useAbility';
import useUser from '~/hooks/useUser';

interface ArticleCardProps {
  id: number;
  image?: string;
  categories?: CategoryPost[];
  createdAt?: number;
  title: string;
  slug: string;
  body: object;
  footer?: string;
  author: {
    name: string;
    description: string;
    image: string;
  };
  published?: boolean;
  updatedAt?: string;
  commentsCount?: number;
  bookmarks?: [];
  bookmarksCount?: number;
  favorites?: [];
  favoritesCount?: number;
  viewsCount?: number;
}

const actionIconStyle = unifiedStyles.icons.action.style;
const actionIconStroke = unifiedStyles.icons.action.stroke;

export default function Post({ data }: { data: ArticleCardProps }) {
  const {
    id,
    image = '',
    categories = [],
    createdAt,
    commentsCount = 0,
    viewsCount,
    body = {},
    title = '',
    slug,
    footer = '',
    author,
    updatedAt = '',
    published,
    bookmarks,
    bookmarksCount,
    favorites,
    favoritesCount
  } = data;
  const theme = useMantineTheme();
  const ability = useAbility();
  const canEditPost = useMemo(
    () => ability?.can('edit', subject('post', data)),
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
      `${window.location.protocol}//${window.location.host}/post/${slug}`
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
    <>
      <Card withBorder mb={6} radius="md" className={classes.card}>
        <Card.Section className={classes.header}>
          <Group justify="space-between">
            <Group gap={0} p={4}>
              {categories?.length > 0 ? (
                categories.map(
                  ({
                    category: { name: categoryName, slug: catSlug },
                    catId: catPostId
                  }) => (
                    <Link key={`catgory-${catPostId}`} to={`/posts/${catSlug}`}>
                      <Badge mr={4} radius="md" size="md" variant="light">
                        {categoryName}
                      </Badge>
                    </Link>
                  )
                )
              ) : (
                <Title order={1} className={classes.title}>
                  {title}
                </Title>
              )}
            </Group>

            <Group gap={0} p={4}>
              <TimeSince timestamp={createdAt} pr={4} />
            </Group>
          </Group>
        </Card.Section>
        {title && categories?.length > 0 ? (
          <Card.Section className={classes.header}>
            <Title order={1} className={classes.title}>
              {title}
            </Title>
          </Card.Section>
        ) : null}
        <Card.Section
          className={classes.body}
          pt={categories?.length > 0 ? 10 : undefined}
        >
          <HTMLContent content={body} />
        </Card.Section>
        {footer ? (
          <Group mt="xs">
            <Text size="xs" c="dimmed">
              {footer}
            </Text>
          </Group>
        ) : null}

        <Card.Section className={classes.footer}>
          <Group gap={0} justify="space-between">
            <Group gap={0}>
              <Avatar src={author.image} radius="sm" />
              <div>
                <Text size="sm" fw={500} pl="xs">
                  {author.name}
                </Text>
                <Text size="xs" c="dimmed" pl="sm">
                  {author.description}
                </Text>
              </div>
              <Group gap={10} ml={10}>
                <Badge
                  variant="default"
                  leftSection={
                    <IconHeart
                      color={theme.colors.red[6]}
                      stroke={1}
                      style={{ width: rem(20), height: rem(20) }}
                    />
                  }
                >
                  {favoritesCount}
                </Badge>
                <Badge
                  variant="default"
                  leftSection={
                    <IconMessage
                      color={theme.colors.green[6]}
                      stroke={1}
                      style={{ width: rem(20), height: rem(20) }}
                    />
                  }
                >
                  {commentsCount}
                </Badge>
                <Badge
                  variant="default"
                  leftSection={
                    <IconBookmark
                      color={theme.colors.green[6]}
                      stroke={1}
                      style={{ width: rem(20), height: rem(20) }}
                    />
                  }
                >
                  {bookmarksCount}
                </Badge>
                <Badge
                  variant="default"
                  leftSection={
                    <IconEye
                      color={theme.colors.blue[6]}
                      stroke={1}
                      style={{ width: rem(22), height: rem(22) }}
                    />
                  }
                >
                  {viewsCount}
                </Badge>
                {!published && (
                  <Badge color="yellow" variant="light">
                    Draft
                  </Badge>
                )}
              </Group>
            </Group>

            <Group gap={0}>
              {isLoggedIn && (
                <>
                  <ActionIcon
                    variant="subtle"
                    color={theme.colors.red[6]}
                    onClick={() =>
                      submit(
                        { postId: id },
                        {
                          navigate: false,
                          method: 'post',
                          encType: 'application/json',
                          action: `/post/favorite`
                        }
                      )
                    }
                  >
                    {favorites?.length > 0 ? (
                      <IconHeartFilled size={22} color={theme.colors.red[6]} />
                    ) : (
                      <IconHeart
                        size={22}
                        color={theme.colors.red[6]}
                        stroke={1.5}
                      />
                    )}
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color={theme.colors.yellow[6]}
                    onClick={() =>
                      submit(
                        { postId: id },
                        {
                          navigate: false,
                          method: 'post',
                          encType: 'application/json',
                          action: `/post/bookmark`
                        }
                      )
                    }
                  >
                    {bookmarks?.length > 0 ? (
                      <IconBookmarkFilled
                        size={22}
                        color={theme.colors.red[6]}
                      />
                    ) : (
                      <IconBookmark
                        size={22}
                        color={theme.colors.yellow[6]}
                        stroke={1.5}
                      />
                    )}
                  </ActionIcon>
                </>
              )}
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
                    color={
                      copied ? theme.colors.green[7] : theme.colors.blue[6]
                    }
                    stroke={1.5}
                  />
                ) : (
                  <IconShare
                    size={22}
                    color={
                      copied ? theme.colors.green[7] : theme.colors.blue[6]
                    }
                    stroke={1.5}
                  />
                )}
              </ActionIcon>
              {canEditPost && (
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
      {canEditPost && openEditor && (
        <Grid.Col span={12}>
          <PostEditor {...data} closeEditor={setOpenEditor} />
        </Grid.Col>
      )}
    </>
  );
}
