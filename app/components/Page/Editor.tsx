import {
  Alert,
  Button,
  Card,
  Grid,
  Group,
  MultiSelect,
  Select,
  Stack,
  Switch,
  TagsInput,
  TextInput,
  Textarea,
  Title
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import { Form, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import type { JSONContent } from '@tiptap/core';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import MantineEditor from '~/components/Tiptap/Editor';
import { Debug } from '../Debug';
import { DebugCollapse } from '../DebugCollapse';

interface Editor {
  id?: number | null;
  createdAt?: string | null;
  published?: boolean;
  publishedAt?: number | null;
  status?: string;
  summary?: string;
  body?: { type?: string; content?: JSONContent[] | undefined };
  title?: string;
  closeEditor?: Dispatch<SetStateAction<string | null>>;
  stream?: { id: string; name: string };
  slug?: string | null;
  slugFormat?: string | null;
  categories?: { category: { name: string } }[];
}

const ArticleEditor = ({
  id = null,
  createdAt = null,
  published = false,
  publishedAt = null,
  status = '',
  summary = '',
  body = { type: 'doc' },
  title = '',
  slug,
  slugFormat,
  categories,
  closeEditor
}: Editor) => {
  const form = useForm({
    initialValues: {
      id,
      createdAt,
      published,
      publishedAt: publishedAt ? new Date(publishedAt * 1000) : null,
      status,
      summary,
      body: typeof body === 'string' ? JSON.parse(body) : body,
      title,
      slug,
      slugFormat: slug ? null : slugFormat ?? 'title-id',
      categories:
        categories && categories?.length > 0
          ? categories.map((cat) => cat.category.name)
          : []
    }
  });

  const loaderData = useLoaderData();

  const [catSearchValue, setCatSearchValue] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const route = !id ? '/page/create' : '/page/update';

  const submit = useSubmit();

  const navigate = useNavigate();

  const DiscardBtn = () => (
    <Button color="red" onClick={() => navigate('pages')} variant="light">
      Discard
    </Button>
  );

  const CancelBtn = ({ slug }: { slug: string }) => (
    <Button
      color="yellow"
      onClick={() => navigate(`/page/${slug}`)}
      variant="light"
    >
      Cancel
    </Button>
  );

  const CloseBtn = () => {
    return closeEditor ? (
      <Button color="yellow" onClick={() => closeEditor('')} variant="light">
        Cancel
      </Button>
    ) : null;
  };

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>Page Editor</Title>
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
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Title"
                  {...form.getInputProps('title')}
                />
                <Textarea
                  label="Summary"
                  name="summary"
                  placeholder="Summary"
                  {...form.getInputProps('summary')}
                />
                <MantineEditor name="body" form={form} />
                <input
                  type="hidden"
                  name="body"
                  value={JSON.stringify(form.values.body)}
                />
                <Switch
                  name="published"
                  checked={form?.values?.published}
                  size="lg"
                  onLabel="Published"
                  offLabel="Draft"
                  onChange={(event) =>
                    form.setFieldValue('published', event.currentTarget.checked)
                  }
                />
                {form.values.published && (
                  <DateTimePicker
                    name="publishedAt"
                    valueFormat="DD MMM YYYY hh:mm A"
                    label="Schedule Published Date (optional)"
                    placeholder="Pick date and time"
                    {...form.getInputProps('publishedAt')}
                  />
                )}
                <Select
                  name="slugFormat"
                  label="URL Format"
                  placeholder={`${slug ? 'Change' : 'Select'} URL Format`}
                  {...form.getInputProps('slugFormat')}
                  data={[
                    { value: '', label: 'Select URL Format' },
                    {
                      value: 'custom',
                      label: `Custom (/your-slug-here)`
                    },
                    {
                      value: 'date-id',
                      label: `Date-ID (/yyyy-mm-dd-id)`
                    },
                    {
                      value: 'date-title',
                      label: `Date-Title (/yyyy-mm-dd-title)`
                    },
                    {
                      value: 'id',
                      label: `ID (/id)`
                    },
                    {
                      value: 'id-title',
                      label: `ID-Title (/id-title)`
                    },
                    {
                      value: 'title',
                      label: `Title (/title)`
                    },
                    {
                      value: 'title-id',
                      label: `Title-ID (/title-id)`
                    }
                  ]}
                />
                <TextInput
                  label="URL Slug"
                  type="text"
                  placeholder={
                    form.values.slugFormat === 'custom'
                      ? 'Add a Custom URL Slug'
                      : form.values?.slug ?? 'System Generated'
                  }
                  {...form.getInputProps('slug')}
                  onChange={({ currentTarget: { value } }) =>
                    form.setFieldValue('slug', value)
                  }
                  disabled={!(form.values.slugFormat === 'custom')}
                />
                <input
                  type="hidden"
                  name="slug"
                  {...form.getInputProps('slug')}
                />
              </Stack>
              <Group align="center" mt="md">
                <Button color="green" type="submit" variant="light">
                  {id ? 'Update' : 'Save'}
                </Button>
                {closeEditor && <CloseBtn />}
                {!id && !closeEditor && <DiscardBtn />}
                {id && slug && !closeEditor && <CancelBtn slug={slug} />}
              </Group>
            </Form>
            <DebugCollapse data={form.values} />
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export default ArticleEditor;