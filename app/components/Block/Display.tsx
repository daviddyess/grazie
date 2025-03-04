import { Box, Title } from '@mantine/core';
import { BlockContents } from '~/blocks';
const getBlockContent = ({
  blockType,
  content
}: {
  blockType: string;
  content: any;
}) => {
  switch (blockType) {
    case 'html':
      return <BlockContents.HTMLBlockContent content={content} />;
    case 'rich-text':
      return (
        <BlockContents.RichTextBlockContent content={JSON.parse(content)} />
      );
    default:
      return null;
  }
};
export default function BlockDisplay({ block }: { block: any }) {
  const content = getBlockContent(block);
  return (
    <Box p="md">
      <Title order={3}>{block.title}</Title>
      <Box>{content}</Box>
    </Box>
  );
}
