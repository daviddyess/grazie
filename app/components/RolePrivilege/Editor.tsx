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
  rem,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import { Form, useFetcher, useSubmit } from 'react-router';
import { IconJson } from '@tabler/icons-react';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
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

  const route = !id
    ? `/role/${roleId}/privilege/create`
    : `/role/${roleId}/privilege/update`;

  const submit = useSubmit();

  const fetcher = useFetcher();

  useEffect(() => {
    if (!privilegeId && fetcher.state === 'idle' && !fetcher.data) {
      fetcher.load(`/role/${roleId}/privilege/create`);
    }
  }, [fetcher, roleId, privilegeId]);
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>
              {privilegeId ? 'Role Privilege Editor' : 'New Role Privilege'}
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
              {fetcher?.data?.privileges?.totalCount !== 0 ? (
                <>
                  <Stack>
                    {id && <input type="hidden" name="id" value={id} />}
                    <input type="hidden" name="roleId" value={roleId} />
                    {!privilegeId ? (
                      <Select
                        name="privilegeId"
                        label="Privilege"
                        placeholder="Select a Privilege"
                        {...form.getInputProps('privilegeId')}
                        data={
                          fetcher?.data?.privileges
                            ? fetcher?.data?.privileges?.nodes?.map(
                                (privilege) => ({
                                  value: `${privilege.id}`,
                                  label: `${privilege.subject} ${privilege.action}`
                                })
                              )
                            : []
                        }
                      />
                    ) : (
                      <Title order={4}>
                        {privilege.subject} {privilege.action}
                      </Title>
                    )}
                    <Switch
                      checked={form?.values?.inverted}
                      color="red"
                      name="inverted"
                      onLabel="Cannot"
                      offLabel="Can"
                      onChange={(event) =>
                        form.setFieldValue(
                          'inverted',
                          event.currentTarget.checked
                        )
                      }
                      size="lg"
                    />
                    <JsonInput
                      label="Conditions"
                      leftSection={
                        <IconJson
                          style={{
                            width: rem(24),
                            height: rem(24)
                          }}
                        />
                      }
                      name="conditions"
                      placeholder="Conditions"
                      validationError="Invalid JSON"
                      formatOnBlur
                      autosize
                      minRows={4}
                      {...form.getInputProps('conditions')}
                    />
                    <Textarea
                      label="Description"
                      name="description"
                      placeholder="Description"
                      {...form.getInputProps('description')}
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
                  <Text>All privileges already assigned</Text>
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
