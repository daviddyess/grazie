/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import {
  Container,
  Grid,
  Group,
  Paper,
  RingProgress,
  Text,
  Title
} from '@mantine/core';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { system } from '~/lib/resource.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'manage', subject: 'Dashboard' });
  const systemInfo = await system();
  return { _page: 'dashboard', systemInfo };
}

export default function DashboardAdmin() {
  const data = useLoaderData();

  return (
    <>
      <Grid align="stretch">
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Paper shadow="xs" withBorder p="xl" h={'100%'}>
            <Title order={2} ta="center">
              Operating System
            </Title>
            <Container>
              <Group>
                <Text size="sm" w={60}>
                  platform:
                </Text>{' '}
                <Text>{data.systemInfo.os.platform}</Text>
              </Group>
              <Group>
                <Text size="sm" w={60}>
                  name:
                </Text>{' '}
                <Text>{data.systemInfo.os.distro}</Text>
              </Group>
              <Group>
                <Text size="sm" w={60}>
                  version:
                </Text>{' '}
                <Text>{data.systemInfo.os.release}</Text>
              </Group>
              <Group>
                <Text size="sm" w={60}>
                  arch:
                </Text>{' '}
                <Text>{data.systemInfo.os.arch}</Text>
              </Group>
              <Group>
                <Text size="sm" w={60}>
                  kernel:
                </Text>{' '}
                <Text>{data.systemInfo.os.kernel}</Text>
              </Group>
              {data.systemInfo.os?.build !== '' && (
                <Group>
                  <Text size="sm" w={60}>
                    build:
                  </Text>{' '}
                  <Text>{data.systemInfo.os?.build}</Text>
                </Group>
              )}
            </Container>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Paper shadow="xs" withBorder p="xl">
            <Title order={2} ta="center">
              CPU
            </Title>

            <RingProgress
              label={
                <Text size="sm" ta="center">
                  CPU Usage
                </Text>
              }
              mx="auto"
              sections={[
                {
                  value: data.systemInfo.cpu,
                  color: 'purple',
                  tooltip: `${data.systemInfo.cpu} % in use`
                },
                {
                  value: 100 - data.systemInfo.cpu,
                  color: 'gray',
                  tooltip: `${100 - data.systemInfo.cpu} % available`
                }
              ]}
              size={175}
            />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Paper shadow="xs" withBorder p="xl">
            <Title order={2} ta="center">
              Memory
            </Title>
            <RingProgress
              label={
                <Text size="sm" ta="center">
                  Memory Usage
                </Text>
              }
              mx="auto"
              sections={[
                {
                  value: data.systemInfo.memory.used,
                  color: 'pink',
                  tooltip: `${data.systemInfo.memory.used} % used`
                },
                {
                  value: 100 - data.systemInfo.memory.used,
                  color: 'gray',
                  tooltip: `${100 - data.systemInfo.memory.used} % available`
                }
              ]}
              size={175}
            />
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
}
