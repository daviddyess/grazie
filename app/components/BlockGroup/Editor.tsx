import {
  Button,
  Card,
  Grid,
  Group,
  Input,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Form, useLoaderData, useSubmit } from 'react-router';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { MultiSelectCheckbox } from '../Input/MultiSelectCheckbox';
import { DebugCollapse } from '~/components/DebugCollapse';

interface Editor {
  id?: string | null;
  name?: string;
  title?: string;
  description?: string;
  status?: string;
  blocks?: [];
  closeEditor?: Dispatch<SetStateAction<number | null | boolean>>;
  refetch: Function;
}

const BlockGroupEditor = ({
  id = null,
  name = '',
  title = '',
  description = '',
  status,
  blocks = [],
  closeEditor = () => false,
  refetch = Function
}: Editor) => {
  const [errorMsg] = useState({});
  const { error, blocksList } = useLoaderData();

  const route = !id ? '/block/group/create' : '/block/group/update';

  const submit = useSubmit();
  const form = useForm({
    initialValues: {
      id,
      name,
      title,
      description,
      status: status ? 'enabled' : 'disabled',
      blocks: blocks.map((block) => block.blockId)
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const autoFill = (name: string, value: string) => {
    switch (name) {
      case 'title':
        if (form.values.name === '') {
          form.setFieldValue('name', value.toLowerCase());
        }
        break;
      default:
    }
  };

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6, lg: 4, xl: 4 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>Block Group Editor</Title>
          </Card.Section>
          <Card.Section p={10}>
            <Form
              method="POST"
              action={route}
              onSubmit={form.onSubmit((_v, e) => {
                if (e) {
                  submit(e.currentTarget);
                  if (closeEditor) closeEditor(false);
                }
              })}
            >
              <Stack>
                {id && <input type="hidden" name="id" value={id} />}
                <TextInput
                  label="Block Group Title"
                  name="title"
                  type="text"
                  placeholder="e.g. Announcements"
                  {...form.getInputProps('title')}
                  onBlur={({ currentTarget: { value } }) =>
                    autoFill('title', value)
                  }
                />
                <TextInput
                  label="Unique Name"
                  name="name"
                  type="text"
                  placeholder="e.g. announcements"
                  {...form.getInputProps('name')}
                  onBlur={({ currentTarget: { value } }) =>
                    autoFill('name', value)
                  }
                />
                <Textarea
                  placeholder="e.g. purpose, audience, .etc of articles"
                  label="Block Group Description"
                  name="description"
                  {...form.getInputProps('description')}
                />
                <Select
                  label="Block Group Status"
                  name="status"
                  placeholder="Select Status"
                  {...form.getInputProps('status')}
                  data={[
                    { value: '', label: 'Select Status' },
                    {
                      value: 'enabled',
                      label: 'Enabled'
                    },
                    {
                      value: 'disabled',
                      label: 'Disabled'
                    }
                  ]}
                />
                <MultiSelectCheckbox
                  label="Blocks"
                  name="blocks"
                  form={form}
                  data={blocksList}
                />
                <Group align="center" mt="md">
                  <Button type="submit">Save</Button>
                  <Button onClick={() => closeEditor(false)}>Cancel</Button>
                </Group>
              </Stack>
            </Form>
            <DebugCollapse data={form.values} />
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export default BlockGroupEditor;
