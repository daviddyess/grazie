import { Textarea } from '@mantine/core';

export const HTMLBlockContentEditor = ({ form }: { form: any }) => {
  return (
    <Textarea
      name="content"
      label="Content"
      {...form.getInputProps('content')}
    />
  );
};
