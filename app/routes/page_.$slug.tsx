/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Grid } from '@mantine/core';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, useNavigate } from 'react-router';
import Page from '~/components/Page/Page';
import { getPage } from '~/lib/page.server';
import { sentry } from '~/lib/sentry.server';
import type { Page as PageType } from '~/types/Page';
import { SEO } from '~/utils/meta';
import { createAbility } from '~/utils/session.server';

export function meta({
  data: {
    page: {
      createdAt,
      title,
      meta,
      publishedAt,
      author: { displayName }
    }
  },
  matches
}: {
  data: { page: PageType };
  matches: typeof loader;
}) {
  return SEO({
    createdAt,
    title,
    meta,
    publishedAt,
    author: displayName,
    matches
  });
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const page = await getPage({ slug: params?.slug });
  if (page) {
    await sentry(request, { action: 'read', subject: 'Page', item: page });
    page.body = JSON.parse(page.body);
  }

  return { page };
}

export default function PageView() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { page } = data;

  return (
    <Grid>
      <Grid.Col span={12}>
        <Page key={page.id} page={page} />
      </Grid.Col>
    </Grid>
  );
}
