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
  MultiSelect,
  Stack,
  Switch,
  Text,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import { Form, useFetcher, useSubmit } from 'react-router';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { DebugCollapse } from '../DebugCollapse';

interface Editor {
  id?: number | null;
  roleId: number;
  userId?: number;
  active?: boolean;

  closeEditor?: Dispatch<SetStateAction<boolean | number | string | null>>;
}

const SettingEditor = ({
  id = null,
  roleId,
  userId,
  active = true,
  closeEditor = () => null
}: Editor) => {
  const form = useForm({
    initialValues: {
      id,
      roleId,
      userId,
      active
    }
  });

  const [errorMsg, setErrorMsg] = useState('');

  const route = !id
    ? `/role/${roleId}/user/create`
    : `/role/${roleId}/user/update`;

  const submit = useSubmit();

  const fetcher = useFetcher();

  useEffect(() => {
    if (!userId && fetcher.state === 'idle' && !fetcher.data) {
      fetcher.load(`/role/${roleId}/user/create`);
    }
  }, [fetcher, roleId, userId]);
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>
              {userId ? 'Role User Editor' : 'New Role Users'}
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
              {fetcher?.data?.users?.totalCount !== 0 ? (
                <>
                  <Stack>
                    {id && <input type="hidden" name="id" value={id} />}
                    <input type="hidden" name="roleId" value={roleId} />
                    {!userId && (
                      <MultiSelect
                        name="userId"
                        label="Users"
                        placeholder="Select Role Users"
                        {...form.getInputProps('userId')}
                        data={
                          fetcher?.data?.users
                            ? fetcher?.data?.users?.nodes?.map((user) => ({
                                value: `${user.id}`,
                                label: user.username
                              }))
                            : []
                        }
                      />
                    )}
                    <Switch
                      name="active"
                      checked={form?.values?.active}
                      size="lg"
                      onLabel="Active"
                      offLabel="Inactive"
                      onChange={(event) =>
                        form.setFieldValue(
                          'active',
                          event.currentTarget.checked
                        )
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
                </>
              ) : (
                <>
                  <Text>All users already assigned</Text>
                  <Button
                    color="red"
                    onClick={() => closeEditor(false)}
                    variant="light"
                  >
                    Close
                  </Button>
                </>
              )}
            </Form>
            <DebugCollapse data={form.values} />
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export default SettingEditor;
