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
  Select,
  Stack,
  Textarea,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import { Form, useLoaderData, useSubmit } from 'react-router';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { DebugCollapse } from '../DebugCollapse';

interface Editor {
  id?: number | null;
  parentId?: number | null;
  name?: string | null;
  description?: string | null;
  closeEditor?: Dispatch<SetStateAction<string | null>>;
}

const CategoryEditor = ({
  id = null,
  parentId = null,
  name = '',
  description = '',
  closeEditor = () => null
}: Editor) => {
  const form = useForm({
    initialValues: {
      id,
      parentId: `${parentId}`,
      name,
      description
    }
  });

  const loaderData = useLoaderData();
  const { categories } = loaderData;

  const [errorMsg, setErrorMsg] = useState('');

  const route = !id ? '/category/create' : '/category/update';

  const submit = useSubmit();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>Category Editor</Title>
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
                  name="parentId"
                  label="Parent Category"
                  placeholder="Select a Parent Category"
                  {...form.getInputProps('parentId')}
                  data={
                    categories?.totalCount > 0
                      ? categories?.nodes?.map(
                          (cat: { id: string; name: string }) => ({
                            value: `${cat.id}`,
                            label: cat.name
                          })
                        )
                      : []
                  }
                  disabled={categories?.totalCount === 0}
                />
                <Textarea
                  label="Description"
                  name="description"
                  placeholder="Optional Description"
                  {...form.getInputProps('description')}
                />
              </Stack>
              <Group align="center" mt="md">
                <Button type="submit">Save</Button>
                <Button onClick={() => closeEditor('')}>Cancel</Button>
              </Group>
            </Form>
            <DebugCollapse data={form.values} />
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export default CategoryEditor;
