/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Title, Grid, Tabs } from '@mantine/core';
import { useLoaderData, useNavigate } from 'react-router';
import PageCard from '~/components/Page/PageCard';
import Pager from '~/components/Pager/Pager';
import { subject, useAbility } from '~/hooks/useAbility';
import { loader } from '~/routes/pages';

export default function PagesList() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const ability = useAbility();

  const pages =
    data?.pages?.nodes?.length > 0 ? (
      data?.pages?.nodes?.map((article) => (
        <PageCard
          key={article.id}
          data={{
            ...article,
            body: JSON.parse(article.body),
            category: null,
            author: {
              name: article?.author?.displayName,
              description: '',
              image: `${data?.pages?.avatarURL}sm/${article?.author?.avatar}`
            }
          }}
        />
      ))
    ) : (
      <h4>No Pages Stored</h4>
    );

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Pages</Title>
        <Tabs defaultValue="browse" keepMounted={false}>
          <Tabs.List>
            {ability.can('create', subject('Page', {})) && (
              <Tabs.Tab value="create" onClick={() => navigate('/page/create')}>
                Create
              </Tabs.Tab>
            )}
            <Tabs.Tab value="browse">Browse</Tabs.Tab>
          </Tabs.List>
          <Pager />
          <Tabs.Panel value="browse" py={10}>
            {pages}
          </Tabs.Panel>
          <Pager />
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
