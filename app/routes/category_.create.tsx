/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Title, Grid, Tabs } from '@mantine/core';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import { redirectWithToast } from 'remix-toast';
import Editor from '~/components/Editor';
import { createCategory, getCategories } from '~/lib/category.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';
import { site } from '@/grazie';
import { SEO } from '~/utils/meta';

export function meta({ matches }: { matches: typeof loader }) {
  return SEO({
    title: `Create Category`,
    matches
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Category' });
  const categories = await getCategories({});
  const data = { categories };

  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Category' });
  const form = await request.formData();
  const name = form.get('name') as string;
  const description = form.get('description') as string;
  const parentId = form.get('parentId') as string;
  const category = await createCategory({
    name,
    description,
    parentId: parentId ? Number(parentId) : undefined
  });

  if (category?.slug) {
    return redirectWithToast(`/categories`, {
      message: 'Category Created!',
      type: 'success'
    });
  } else return category;
}

export default function CategoryCreate() {
  const navigate = useNavigate();

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Categories</Title>
        <Tabs defaultValue="create" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="create">Create</Tabs.Tab>
            <Tabs.Tab value="browse" onClick={() => navigate('/categories')}>
              Browse
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="create" py={10}>
            <Editor category />
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
