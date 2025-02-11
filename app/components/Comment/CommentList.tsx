/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Box, Button, Loader, Text, Title } from '@mantine/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CommentCard } from '~/components/Comment/CommentCard';
import { type Comment } from '~/types/Comment';
import CommentEditor from './Editor';
import { IconSquarePlus } from '@tabler/icons-react';
import { subject, useAbility } from '~/hooks/useAbility';
import { useFetcher, useSearchParams } from 'react-router';
import { useInViewport } from '@mantine/hooks';

export function CommentList({
  postId,
  data: { nodes: commentNodes, avatarURL, totalCount, count }
}: {
  postId: number;
  data: { nodes: Comment[] };
}) {
  const [openEditor, setOpenEditor] = useState(false);
  const [comments, setComments] = useState(commentNodes);
  const [page, setPage] = useState(1);
  const [limit] = useState(count);
  const [offset] = useState(count);
  const ability = useAbility();
  const canCreateComment = useMemo(
    () => ability.can('create', subject('Comment', {})),
    [ability]
  );
  const fetcher = useFetcher();
  const { ref, inViewport } = useInViewport();
  const pages = Math.ceil(totalCount / count);
  const commentsRef = useRef(commentNodes);
  const [searchParams, setSearchParams] = useSearchParams();

  const refresh = Number(searchParams.get('refresh'));
  useEffect(() => {
    if (refresh) {
      if (fetcher.state === 'idle') {
        fetcher.load(
          `/comments/post/${postId}?limit=${comments?.length}&offset=0`
        );
        const params = new URLSearchParams();
        params.delete('refresh');
        setSearchParams(params, {
          preventScrollReset: true
        });
      }
    }
  });

  useEffect(() => {
    if (
      totalCount !== comments?.length &&
      inViewport &&
      fetcher.state === 'idle' &&
      page !== pages
    ) {
      fetcher.load(
        `/comments/post/${postId}?limit=${limit}&offset=${page * offset}`
      );
      setPage((prev) => prev + 1);
    }
  }, [comments?.length, fetcher, inViewport, postId, totalCount]);

  useEffect(() => {
    if (fetcher?.data?.comments?.nodes) {
      setComments((prev) => [...prev, ...fetcher.data.comments.nodes]);
    }
  }, [fetcher?.data?.comments?.nodes]);

  useEffect(() => {
    if (
      totalCount !== comments?.length &&
      commentsRef.current !== commentNodes
    ) {
      setComments(commentNodes);
      setPage(1);
      commentsRef.current = commentNodes;
    }
  }, [commentNodes, comments, totalCount]);

  return (
    <>
      <Title order={2}>Comments</Title>
      {canCreateComment && !openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
          >
            New Comment
          </Button>
        </Box>
      )}
      {canCreateComment && openEditor && (
        <Box my={10}>
          <CommentEditor postId={postId} closeEditor={setOpenEditor} />
        </Box>
      )}
      {comments?.length > 0 ? (
        <>
          {comments?.map((comment, index) => (
            <CommentCard
              key={`comment-${comment.id}`}
              data={comment}
              avatarURL={avatarURL}
            />
          ))}
          <Box ref={ref}>
            {fetcher.state === 'loading' && (
              <Loader color="violet" type="dots" />
            )}
          </Box>
        </>
      ) : (
        <Text>No Comments</Text>
      )}
    </>
  );
}
