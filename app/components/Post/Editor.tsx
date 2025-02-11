/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import {
  Button,
  Card,
  Grid,
  Group,
  Select,
  Stack,
  Switch,
  TagsInput,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import {
  Form,
  useFetcher,
  useLoaderData,
  useNavigate,
  useSubmit
} from 'react-router';
import type { JSONContent } from '@tiptap/core';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import MantineEditor from '~/components/Tiptap/Editor';
import { DebugCollapse } from '~/components/DebugCollapse';
import { SEO } from '~/components/SEO';

type Editor = {
  id?: number | null;
  createdAt?: string | null;
  published?: boolean;
  publishedAt?: number | null;
  status?: string;
  summary?: string;
  body?: { type?: string; content?: JSONContent[] | undefined };
  search?: string;
  title?: string;
  closeEditor?: Dispatch<SetStateAction<string | null>>;
  stream?: { id: string; name: string };
  slug?: string | null;
  slugFormat?: string | null;
  categories?: { category: { name: string } }[];
  meta?: string | null;
};

const PostEditor = ({
  id = null,
  createdAt = null,
  published = false,
  publishedAt = null,
  status = '',
  summary = '',
  body = { type: 'doc' },
  search = '',
  title = '',
  slug,
  slugFormat,
  categories,
  meta,
  closeEditor
}: Editor) => {
  const form = useForm({
    initialValues: {
      id,
      createdAt,
      published,
      publishedAt: publishedAt && new Date(publishedAt),
      status,
      summary,
      body: typeof body === 'string' ? JSON.parse(body) : body,
      search,
      title,
      slug,
      slugFormat: slug ? null : slugFormat ?? 'title-id',
      categories:
        categories && categories?.length > 0
          ? categories.map((cat) => cat.category.name)
          : [],
      meta: meta
        ? JSON.parse(meta)
        : {
            seo: {
              keywords: '',
              title: '',
              description: ''
            }
          }
    },
    validate: {
      // We want this to be required, but need a workaround if only a video is in the body
      //search: (value) => (value.length === 0 ? 'Post body is required' : null)
    }
  });

  const loaderData = useLoaderData();

  const [categoriesList, setCategoriesList] = useState(loaderData?.categories);

  const [catSearchValue, setCatSearchValue] = useState('');

  const route = !id ? '/post/create' : '/post/update';

  const submit = useSubmit();

  const navigate = useNavigate();

  const DiscardBtn = () => (
    <Button color="red" onClick={() => navigate('/posts')} variant="light">
      Discard
    </Button>
  );

  const CancelBtn = ({ slug }: { slug: string }) => (
    <Button
      color="yellow"
      onClick={() => navigate(`/post/${slug}`)}
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

  const fetcher = useFetcher();

  useEffect(() => {
    if (!categoriesList) {
      if (fetcher.state === 'idle') {
        fetcher.load(`/post/update`);
      }
    }
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setCategoriesList(fetcher.data.categories);
    }
  }, [fetcher.data]);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>Post Editor</Title>
          </Card.Section>
          <Card.Section p={10}>
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
                <MantineEditor name="body" form={form} withSearch />
                {form.errors?.search && (
                  <Text size="xs" c="red">
                    {form.errors.search}
                  </Text>
                )}
                <input
                  type="hidden"
                  name="body"
                  value={JSON.stringify(form.values.body)}
                />
                <input type="hidden" name="search" value={form.values.search} />
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
                <TagsInput
                  data={
                    categoriesList?.nodes?.length > 0
                      ? categoriesList?.nodes?.map(
                          (cat: {
                            name: string;
                            slug: string;
                            parent: { name: string };
                          }) => ({
                            value: cat.slug,
                            label: cat.name
                          })
                        )
                      : []
                  }
                  label="Categories"
                  name="categories"
                  onSearchChange={setCatSearchValue}
                  placeholder="Categories"
                  searchValue={catSearchValue}
                  {...form.getInputProps('categories')}
                />
              </Stack>
              <SEO form={form} />
              <Group align="center" mt="md">
                <Button
                  color="green"
                  type="submit"
                  variant="light"
                  disabled={!(Number(form.values.body?.content?.length) > 0)}
                >
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
export default PostEditor;
