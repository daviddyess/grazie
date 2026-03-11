/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import {
  Text,
  Avatar,
  Group,
  Paper,
  Box,
  Button,
  Menu,
  rem,
  ActionIcon
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import classes from '~/components/Comment/CommentCard.module.css';
import { TimeSince } from '~/components/DateTime';
import HTMLContent from '~/components/Tiptap/HTMLContent';
import { subject, useAbility } from '~/hooks/useAbility';
import CommentEditor from './Editor';
import { IconArrowBack, IconDotsVertical, IconEdit } from '@tabler/icons-react';
import { unifiedStyles } from '~/utils/unify';

const actionIconStyle = unifiedStyles.icons.action.style;
const actionIconStroke = unifiedStyles.icons.action.stroke;

export function CommentCard({
  data: {
    id,
    postId,
    parentId,
    authorId,
    author: { displayName, avatar },
    body,
    createdAt,
    path
  },
  avatarURL
}) {
  const [replyEditor, setReplyEditor] = useState(false);
  const [commentEditor, setCommentEditor] = useState(false);
  const [actions, setActions] = useState(false);
  const ability = useAbility();
  const canCreateComment = useMemo(
    () => ability.can('create', subject('Comment', {})),
    [ability]
  );
  const canUpdateComment = useMemo(
    () => ability.can('update', subject('Comment', { authorId })),
    [ability, authorId, id]
  );
  const depth = parentId ? path.split('/').length - 1 : 0;
  useEffect(() => {
    if (replyEditor || commentEditor) {
      setActions(true);
    } else if (!replyEditor && !commentEditor) {
      setActions(false);
    }
  }, [replyEditor, commentEditor]);
  return (
    <Paper
      withBorder
      radius="md"
      bg="transparent"
      mb="sm"
      ml={depth * 20}
      style={{
        borderLeft: depth
          ? '2px solid var(--mantine-primary-color-filled)'
          : undefined
      }}
      className={classes.comment}
    >
      <Group>
        <Avatar
          src={`${avatarURL}md/${avatar}`}
          alt={displayName}
          radius="xl"
        />
        <div>
          <Text fz="sm">{displayName}</Text>
          <TimeSince timestamp={createdAt} fz="xs" c="dimmed" pr={4} />
        </div>
      </Group>
      <Box pl={54} pt="sm">
        <HTMLContent
          content={JSON.parse(body)}
          classes={{
            classes: { body: classes.body, content: classes.content }
          }}
        />
      </Box>
      {!actions && (
        <Group>
          {canCreateComment && (
            <Button
              leftSection={<IconArrowBack size="20" />}
              onClick={() => setReplyEditor(true)}
              radius="xl"
              size="compact-sm"
              variant="light"
            >
              Reply
            </Button>
          )}
          {canUpdateComment && (
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
                <Menu.Label>Comment</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconEdit style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={() => setCommentEditor(true)}
                >
                  Edit
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      )}
      {replyEditor && canCreateComment && (
        <CommentEditor
          postId={postId}
          parentId={id}
          closeEditor={setReplyEditor}
        />
      )}
      {commentEditor && canUpdateComment && (
        <CommentEditor
          id={id}
          postId={postId}
          parentId={id}
          body={body}
          closeEditor={setCommentEditor}
        />
      )}
    </Paper>
  );
}
