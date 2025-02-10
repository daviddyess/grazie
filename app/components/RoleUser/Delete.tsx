/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Alert, Button, Card, Grid, Group, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import { Form, useSubmit } from 'react-router';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { DebugCollapse } from '../DebugCollapse';
import { type User } from '~/types/User';

interface Editor {
  id: number;
  roleId: number;
  user: User;
  closeEditor?: Dispatch<SetStateAction<boolean | number | string | null>>;
}

const RoleUserDelete = ({
  id,
  roleId,
  user,
  closeEditor = () => null
}: Editor) => {
  const form = useForm({
    initialValues: {
      id,
      roleId
    }
  });

  const [errorMsg, setErrorMsg] = useState('');

  const route = `/role/${roleId}/user/delete`;

  const submit = useSubmit();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={4}>Delete Role from User: {user?.username}</Title>
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
              <input type="hidden" name="id" value={id} />
              <Group align="center" mt="md">
                <Button color="red" type="submit" variant="light">
                  Delete
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
export default RoleUserDelete;
