/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { getBreakpointValue, Paper, useMantineTheme } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { useLoaderData } from 'react-router';
import { lazy } from 'react';

// Lazy Import Category Editor
const CategoryEditor = lazy(
  async () => await import('~/components/Category/Editor')
);
// Lazy Import Note Editor
const NoteEditor = lazy(async () => await import('~/components/Note/Editor'));
// Lazy Import Page Editor
const PageEditor = lazy(async () => await import('~/components/Page/Editor'));
// Lazy Import Post Editor
const PostEditor = lazy(async () => await import('~/components/Post/Editor'));

export default function Editor({
  category,
  note,
  page,
  post
}: {
  category?: boolean;
  note?: boolean;
  page?: boolean;
  post?: boolean;
}) {
  const { width } = useViewportSize();
  const theme = useMantineTheme();
  const currentBreakpoint = getBreakpointValue(theme.breakpoints.md, theme);
  const breakpoint = Boolean(width >= currentBreakpoint);
  const data = useLoaderData();
  let noteData, pageData, postData, categoryData;
  // Component props control the flow into the lazy loaded editor components
  // - props are necessary, because more than one of the objects could be in the loader data
  if (note) {
    noteData = data.note;
  }
  if (page) {
    pageData = data.page;
  }
  if (post) {
    postData = data.post;
  }
  if (category) {
    categoryData = data.category;
  }

  return (
    <Paper px={breakpoint ? 10 : 0} py={breakpoint ? 0 : 10}>
      {note && <NoteEditor {...noteData} />}
      {page && <PageEditor {...pageData} />}
      {post && <PostEditor {...postData} />}
      {category && <CategoryEditor {...categoryData} />}
    </Paper>
  );
}
