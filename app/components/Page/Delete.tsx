import { Button, Group } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useFetcher } from 'react-router';

export default function DeletePage({ id, cancel }) {
  let fetcher = useFetcher();
  return (
    <fetcher.Form method="post" action={`/page/delete`}>
      <input type="hidden" name="id" value={id} />
      {fetcher.state !== 'idle' && <p>Saving...</p>}
      <Group align="center">
        <Button onClick={cancel}>Cancel</Button>
        <Button type="submit" color="red" leftSection={<IconTrash />}>
          Delete
        </Button>
      </Group>
    </fetcher.Form>
  );
}
