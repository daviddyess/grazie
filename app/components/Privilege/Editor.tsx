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
  subject?: string | null;
  action?: string | null;
  closeEditor?: Dispatch<SetStateAction<boolean | number | string | null>>;
}

const PrivilegeEditor = ({
  id = null,
  subject = '',
  action = '',
  closeEditor = () => null
}: Editor) => {
  const form = useForm({
    initialValues: {
      id,
      subject,
      action
    }
  });

  const [errorMsg, setErrorMsg] = useState('');

  const route = !id ? '/privilege/create' : '/privilege/update';

  const submit = useSubmit();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>{id ? 'Privilege Editor' : 'New Privilege'}</Title>
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
                  label="Subject"
                  name="subject"
                  type="text"
                  placeholder="Subject"
                  {...form.getInputProps('subject')}
                />
                <TextInput
                  label="Action"
                  name="action"
                  type="text"
                  placeholder="Action"
                  {...form.getInputProps('action')}
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
export default PrivilegeEditor;
