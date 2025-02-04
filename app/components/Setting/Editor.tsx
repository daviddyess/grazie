/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import {
  Alert,
  Button,
  Card,
  Grid,
  Group,
  JsonInput,
  NumberInput,
  rem,
  Select,
  Stack,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import { Form, useSubmit } from 'react-router';
import { IconJson } from '@tabler/icons-react';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { DebugCollapse } from '../DebugCollapse';

interface Editor {
  id?: number | null;
  name?: string | null;
  value?: string | number | null;
  type?: string | null;
  closeEditor?: Dispatch<SetStateAction<boolean | number | string | null>>;
}

const SettingEditor = ({
  id = null,
  name = '',
  value = '',
  type = '',
  closeEditor = () => null
}: Editor) => {
  const form = useForm({
    initialValues: {
      id,
      name,
      value,
      type
    }
  });

  const [errorMsg, setErrorMsg] = useState('');

  const route = !id ? '/setting/create' : '/setting/update';

  const submit = useSubmit();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>{id ? 'Setting Editor' : 'New Setting'}</Title>
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
              onSubmit={form.onSubmit((_v, e) => submit(e.currentTarget))}
            >
              <Stack>
                {id && <input type="hidden" name="id" value={id} />}
                <TextInput
                  label="Name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  {...form.getInputProps('name')}
                />
                <Select
                  name="type"
                  label="Setting Type"
                  placeholder="Select a Setting Type"
                  {...form.getInputProps('type')}
                  data={[
                    {
                      value: 'array',
                      label: 'Array'
                    },
                    {
                      value: 'boolean',
                      label: 'Boolean'
                    },
                    {
                      value: 'number',
                      label: 'Number'
                    },
                    {
                      value: 'object',
                      label: 'Object'
                    },
                    {
                      value: 'string',
                      label: 'String'
                    }
                  ]}
                />
                {form.values.type === 'number' && (
                  <NumberInput
                    label="Value"
                    name="value"
                    placeholder="Insert a Value"
                    {...form.getInputProps('value')}
                  />
                )}
                {(form.values.type === 'object' ||
                  form.values.type === 'array') && (
                  <JsonInput
                    label="Value"
                    leftSection={
                      <IconJson
                        style={{
                          width: rem(24),
                          height: rem(24)
                        }}
                      />
                    }
                    name="value"
                    placeholder="Insert a Value"
                    validationError="Invalid JSON"
                    formatOnBlur
                    autosize
                    minRows={4}
                    {...form.getInputProps('value')}
                  />
                )}
                {form.values.type === 'string' && (
                  <TextInput
                    label="Value"
                    name="value"
                    placeholder="Insert a Value"
                    {...form.getInputProps('value')}
                  />
                )}
              </Stack>
              <Group align="center" mt="md">
                <Button color="green" type="submit" variant="light">
                  {id ? 'Update' : 'Save'}
                </Button>
                <Button
                  color="yellow"
                  onClick={() => closeEditor(false)}
                  variant="light"
                >
                  Cancel
                </Button>
              </Group>
            </Form>
            <DebugCollapse data={form.values} />
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export default SettingEditor;
