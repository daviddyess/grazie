import {
  Alert,
  Button,
  Card,
  Grid,
  Group,
  Select,
  Stack,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import { Form, useSubmit } from 'react-router';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { BlockEditors, BlockTypesList } from '~/blocks';
import { DebugCollapse } from '~/components/DebugCollapse';

interface Editor {
  block?: {
    blockType?: string;
    id?: string | null;
    name?: string;
    title?: string;
    status?: string;
    content?: any;
  };
  closeEditor?: Dispatch<SetStateAction<number | boolean | null>>;
}

const getBlockContentEditor = ({
  type,
  content,
  form
}: {
  type: string;
  content: any;
  form: any;
}) => {
  switch (type) {
    case 'html':
      return <BlockEditors.HTMLBlockContentEditor form={form} />;
    case 'rich-text':
      return <BlockEditors.RichTextBlockContentEditor form={form} />;
    default:
      return null;
  }
};

const BlockEditor = ({
  block: {
    blockType = '',
    id = null,
    name = '',
    title = '',
    status = '',
    content = ''
  } = {},
  closeEditor = () => null
}: Editor) => {
  const [errorMsg, setErrorMsg] = useState('');
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
  const route = !id ? '/block/create' : '/block/update';

  const submit = useSubmit();

  const form = useForm({
    initialValues: {
      blockType,
      id,
      name,
      title,
      content: content ? JSON.parse(content) : '',
      status: status ? 'enabled' : 'disabled'
    }
  });
  const Content = getBlockContentEditor({
    type: form.values?.blockType,
    content,
    form
  });

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>{title} Editor</Title>
          </Card.Section>
          <Card.Section p={10}>
            {errorMsg ? (
              <Alert title="Error" color="red">
                {errorMsg}
              </Alert>
            ) : null}
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
                  label="Block Title"
                  name="title"
                  type="text"
                  placeholder="Title"
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
                <Select
                  label="Block Type"
                  name="blockType"
                  placeholder="Select Block Type"
                  {...form.getInputProps('blockType')}
                  data={BlockTypesList.map((blockT) => ({
                    value: blockT,
                    label: blockT
                  }))}
                  readOnly={!!id}
                />
                {Content}
                <Select
                  label="Block Status"
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
              </Stack>
              <Group align="center" mt="md">
                <Button type="submit">Save</Button>
                <Button onClick={() => closeEditor(false)}>Cancel</Button>
              </Group>
            </Form>
            <DebugCollapse data={form.values} />
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export default BlockEditor;
