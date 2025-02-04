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
  Stack,
  Switch,
  Textarea,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import { Form, useSubmit } from 'react-router';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { DebugCollapse } from '../DebugCollapse';

interface Editor {
  id?: number | null;
  active?: boolean | undefined;
  name?: string | null;
  description?: string | number | null;
  closeEditor?: Dispatch<SetStateAction<boolean | number | string | null>>;
}

const RoleEditor = ({
  id = null,
  active = true,
  name = '',
  description = '',
  closeEditor = () => null
}: Editor) => {
  const form = useForm({
    initialValues: {
      id,
      active,
      name,
      description
    }
  });

  const [errorMsg, setErrorMsg] = useState('');

  const route = !id ? '/role/create' : '/role/update';

  const submit = useSubmit();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>{id ? 'Role Editor' : 'New Role'}</Title>
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
                <Textarea
                  label="Description"
                  name="description"
                  placeholder="Description"
                  {...form.getInputProps('description')}
                />
                <Switch
                  name="active"
                  checked={form?.values?.active}
                  size="lg"
                  onLabel="Active"
                  offLabel="Inactive"
                  onChange={(event) =>
                    form.setFieldValue('active', event.currentTarget.checked)
                  }
                />
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
export default RoleEditor;
