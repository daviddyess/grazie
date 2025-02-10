/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Alert, Button, Card, Grid, Group, Stack, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import { Form, useSubmit } from 'react-router';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { DebugCollapse } from '../DebugCollapse';
import { type Privilege } from '~/types/Privilege';

interface Editor {
  id?: number | null;
  roleId: number;
  privilegeId?: number;
  inverted?: boolean;
  conditions?: string | null;
  description?: string | null;
  privilege?: Privilege;
  closeEditor?: Dispatch<SetStateAction<boolean | number | string | null>>;
}

const SettingEditor = ({
  id = null,
  roleId,
  privilegeId,
  inverted = false,
  conditions,
  description,
  privilege,
  closeEditor = () => null
}: Editor) => {
  const form = useForm({
    initialValues: {
      id,
      roleId,
      privilegeId: privilegeId ?? null,
      inverted,
      conditions: conditions ?? '',
      description: description ?? ''
    }
  });

  const [errorMsg, setErrorMsg] = useState('');

  const route = `/role/${roleId}/privilege/delete`;

  const submit = useSubmit();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>
              Delete Privilege {privilege.subject} {privilege.action}?
            </Title>
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
              <>
                <Stack>
                  {id && <input type="hidden" name="id" value={id} />}
                </Stack>
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
              </>
            </Form>
            <DebugCollapse data={form.values} />
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export default SettingEditor;
