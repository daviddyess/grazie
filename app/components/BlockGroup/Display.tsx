import { Grid, Group, Stack } from '@mantine/core';
import BlockDisplay from '../Block/Display';

export default function BlockGroupDisplay({
  blocks,
  row = false
}: {
  blocks: any;
  row?: boolean;
}) {
  const Wrapper = row ? Group : Stack;
  return (
    <Wrapper>
      {blocks?.map((block: any, index: number) => (
        <BlockDisplay block={block} key={index} />
      ))}
    </Wrapper>
  );
}
