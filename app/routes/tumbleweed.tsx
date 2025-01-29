import {
  Alert,
  Anchor,
  Box,
  Button,
  Card,
  Grid,
  Group,
  List,
  Loader,
  Text,
  Title
} from '@mantine/core';
import {
  json,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node';
import { getSnapshotData } from '~/lib/tumbleweed';
import { system } from '~/lib/resource.server';
import { createAbility } from '~/utils/session.server';
import {
  Link,
  useFetcher,
  useLoaderData,
  useParams,
  useSearchParams
} from '@remix-run/react';
import { useEffect, useState } from 'react';
import {
  IconClockCheck,
  IconHistory,
  IconHourglassHigh,
  IconLayersDifference
} from '@tabler/icons-react';
import { SEO } from '~/utils/meta';
import { site } from '@/grazie';
import OSIcon from '~/images/opensuse-button.svg';

export const links: LinksFunction = () => [
  {
    rel: 'alternate',
    href: '/tumbleweed/feed.rss',
    title: 'Tumbleweed Snapshots - RSS Feed',
    type: 'application/rss+xml'
  },
  {
    rel: 'alternate',
    href: '/tumbleweed/feed.atom',
    title: 'Tumbleweed Snapshots - Atom Feed',
    type: 'application/atom+xml'
  },
  {
    rel: 'alternate',
    href: '/tumbleweed/feed.json',
    title: 'Tumbleweed Snapshots - JSON Feed',
    type: 'application/feed+json'
  }
];

export const meta: MetaFunction = ({ matches }) => {
  return SEO({
    meta: {
      seo: {
        title: 'Tumbleweed Snapshots',
        description: site?.description
      }
    },
    contentPage: true,
    matches
  });
};

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const systemInfo = await system();

  const snapshots = await getSnapshotData();

  return json({ snapshots, systemInfo });
}

export default function TumbleweedSnapshots() {
  const { snapshots, systemInfo } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const twUser = systemInfo.os.distro === 'openSUSE Tumbleweed';
  let userSnapshotsBehind;
  if (twUser) {
    const findUserSnapshot = snapshots.published.findIndex(
      (ss: { version: number }) => ss.version === systemInfo.os.release
    );
    userSnapshotsBehind = findUserSnapshot === -1 ? 0 : findUserSnapshot + 1;
  }
  // allow for initial diff selection to be passed in as a search param
  const [viewSnapshot, setViewSnapshot] = useState(
    searchParams.get('diff') ?? snapshots.current.change
  );
  // reset search params to clear incoming diff
  useEffect(() => {
    if (searchParams.get('diff')) {
      setSearchParams((prev) => {
        prev.delete('diff');
        return prev;
      });
    }
  }, [searchParams]);
  const fetcher = useFetcher();
  // fetch diff for current or initial selected snapshot
  useEffect(() => {
    if (fetcher.state === 'idle' && !fetcher.data) {
      fetcher.load(`/tumbleweed/diff/${viewSnapshot}`);
    }
  }, [snapshots]);
  // fetch diff for snapshot
  const fetchSnapshot = (version: number) => {
    fetcher.load(`/tumbleweed/diff/${version}`);
    setViewSnapshot(version);
  };

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title mb="lg">Tumbleweed Snapshots</Title>
        <Grid>
          {twUser ? (
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Card withBorder shadow="xs" radius="sm">
                <Card.Section inheritPadding py="xs">
                  <Group justify="flex-start">
                    <Box w={28}>
                      <svg
                        fill="currentColor"
                        version="1.1"
                        viewBox="0 0 256 256"
                        id="svg234"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="m 76.510755,36.114699 c -32.013526,-0.07672 -58.084488,25.99399 -58.007511,58.007503 0.07679,32.013518 26.207808,58.140948 58.221335,58.217918 l 14.392996,0.0343 -0.03053,-0.002 c 0.0098,4e-5 0.01376,-3e-5 0.02287,0 h 0.0037 c 13.080435,0.0295 24.495505,0.0562 30.058315,0.069 0.0157,7.63314 0.0699,32.17089 0.0994,44.44773 0.0765,32.01353 26.2044,58.14435 58.21792,58.22133 32.01353,0.0769 58.0845,-25.99399 58.00751,-58.00751 -0.0765,-32.01352 -26.2078,-58.14094 -58.22133,-58.21792 -3.75232,-0.009 -7.72601,-0.0176 -13.58322,-0.0307 -13.30522,-0.0304 -25.22082,-0.0563 -30.86058,-0.0687 -0.0156,-7.63314 -0.07,-32.17092 -0.0995,-44.447754 C 134.6555,62.323451 108.52448,36.192598 76.510994,36.115624 Z m -0.03447,13.694052 c 1.886777,0.0049 3.741042,0.139889 5.565381,0.370516 V 99.488476 H 32.544348 c -0.217359,-1.771478 -0.3432,-3.571351 -0.347592,-5.401158 -0.05899,-24.615263 19.664832,-44.338255 44.278391,-44.278396 z m 19.25941,4.396552 c 14.948765,7.189741 25.260165,22.449639 25.302915,40.161013 0.0295,12.255984 0.0821,36.698804 0.0995,44.382724 -7.68343,-0.0177 -32.123017,-0.0699 -44.37759,-0.0995 -17.774672,-0.0427 -33.079236,-10.43043 -40.238031,-25.46713 H 95.737573 V 54.205205 Z m 39.126155,98.267707 c 7.68579,0.0177 32.12641,0.07 44.38274,0.0995 18.01069,0.043 33.47775,10.71067 40.50826,26.07098 h -58.97059 v 58.61136 c -15.2269,-7.08541 -25.77846,-22.48731 -25.8212,-40.40223 -0.0295,-12.25596 -0.0822,-36.69538 -0.0995,-44.37762 z m 39.6119,39.85659 h 49.05779 c 0.17217,1.57862 0.26727,3.18114 0.27117,4.80535 0.0591,24.61526 -19.66481,44.33824 -44.27838,44.27841 -1.70868,-0.002 -3.39177,-0.11521 -5.04981,-0.30558 v -48.77895 z"
                          strokeWidth="1"
                        ></path>
                      </svg>
                    </Box>
                    <Title order={3}>Your Tumbleweed</Title>
                  </Group>
                  <Text
                    component={Title}
                    order={2}
                    ta="center"
                    variant="gradient"
                    gradient={
                      systemInfo.os.release === snapshots.current.version
                        ? {
                            from: 'rgba(31, 143, 44, 1)',
                            to: 'lime',
                            deg: 90
                          }
                        : {
                            from: 'yellow',
                            to: 'red',
                            deg: 90
                          }
                    }
                  >
                    {systemInfo.os.release}
                  </Text>
                  {userSnapshotsBehind > 0 && (
                    <Text ta="center">
                      You are <strong>{userSnapshotsBehind}</strong> snapshots
                      behind the current snapshot
                    </Text>
                  )}
                </Card.Section>
              </Card>
            </Grid.Col>
          ) : (
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Card withBorder shadow="xs" radius="sm">
                <Card.Section inheritPadding py="xs">
                  <Group justify="flex-start">
                    <Box w={28}>
                      <svg
                        fill="currentColor"
                        version="1.1"
                        viewBox="0 0 256 256"
                        id="svg234"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="m 76.510755,36.114699 c -32.013526,-0.07672 -58.084488,25.99399 -58.007511,58.007503 0.07679,32.013518 26.207808,58.140948 58.221335,58.217918 l 14.392996,0.0343 -0.03053,-0.002 c 0.0098,4e-5 0.01376,-3e-5 0.02287,0 h 0.0037 c 13.080435,0.0295 24.495505,0.0562 30.058315,0.069 0.0157,7.63314 0.0699,32.17089 0.0994,44.44773 0.0765,32.01353 26.2044,58.14435 58.21792,58.22133 32.01353,0.0769 58.0845,-25.99399 58.00751,-58.00751 -0.0765,-32.01352 -26.2078,-58.14094 -58.22133,-58.21792 -3.75232,-0.009 -7.72601,-0.0176 -13.58322,-0.0307 -13.30522,-0.0304 -25.22082,-0.0563 -30.86058,-0.0687 -0.0156,-7.63314 -0.07,-32.17092 -0.0995,-44.447754 C 134.6555,62.323451 108.52448,36.192598 76.510994,36.115624 Z m -0.03447,13.694052 c 1.886777,0.0049 3.741042,0.139889 5.565381,0.370516 V 99.488476 H 32.544348 c -0.217359,-1.771478 -0.3432,-3.571351 -0.347592,-5.401158 -0.05899,-24.615263 19.664832,-44.338255 44.278391,-44.278396 z m 19.25941,4.396552 c 14.948765,7.189741 25.260165,22.449639 25.302915,40.161013 0.0295,12.255984 0.0821,36.698804 0.0995,44.382724 -7.68343,-0.0177 -32.123017,-0.0699 -44.37759,-0.0995 -17.774672,-0.0427 -33.079236,-10.43043 -40.238031,-25.46713 H 95.737573 V 54.205205 Z m 39.126155,98.267707 c 7.68579,0.0177 32.12641,0.07 44.38274,0.0995 18.01069,0.043 33.47775,10.71067 40.50826,26.07098 h -58.97059 v 58.61136 c -15.2269,-7.08541 -25.77846,-22.48731 -25.8212,-40.40223 -0.0295,-12.25596 -0.0822,-36.69538 -0.0995,-44.37762 z m 39.6119,39.85659 h 49.05779 c 0.17217,1.57862 0.26727,3.18114 0.27117,4.80535 0.0591,24.61526 -19.66481,44.33824 -44.27838,44.27841 -1.70868,-0.002 -3.39177,-0.11521 -5.04981,-0.30558 v -48.77895 z"
                          strokeWidth="1"
                        ></path>
                      </svg>
                    </Box>
                    <Title
                      component={Anchor}
                      order={3}
                      href="https://get.opensuse.org/tumbleweed/"
                    >
                      Get Tumbleweed
                    </Title>
                  </Group>
                </Card.Section>
              </Card>
            </Grid.Col>
          )}
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <Card withBorder shadow="xs" radius="sm">
              <Card.Section inheritPadding py="xs">
                <Group justify="flex-start">
                  <IconClockCheck size={24} />
                  <Title order={3}>Current Snapshot</Title>
                </Group>
                {snapshots.current ? (
                  <Text
                    component={Title}
                    order={2}
                    ta="center"
                    variant="gradient"
                    gradient={{
                      from: 'rgba(31, 143, 44, 1)',
                      to: 'lime',
                      deg: 90
                    }}
                  >
                    {snapshots.current.version}
                  </Text>
                ) : (
                  <p>No current snapshot</p>
                )}
              </Card.Section>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <Card withBorder shadow="xs" radius="sm">
              <Card.Section inheritPadding py="xs">
                <Group justify="flex-start">
                  <IconHourglassHigh size={24} />
                  <Title order={3}>Pending Snapshots</Title>
                </Group>
                {snapshots.pending.length > 0 ? (
                  <List>
                    {snapshots.pending.map((snapshot) => (
                      <List.Item key={`pending-${snapshot.version}`}>
                        {snapshot.version}
                      </List.Item>
                    ))}
                  </List>
                ) : (
                  <p>
                    <strong>No pending snapshots</strong>
                  </p>
                )}
              </Card.Section>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder shadow="xs" radius="sm">
              <Card.Section inheritPadding py="xs">
                <Group justify="flex-start">
                  <IconHistory size={24} />
                  <Title order={3}>Snapshots</Title>
                </Group>
                {snapshots.published.length > 0 ? (
                  <List>
                    {snapshots.published.map((snapshot) => (
                      <List.Item key={`published-${snapshot.version}`}>
                        <Button
                          variant="transparent"
                          onClick={() => fetchSnapshot(snapshot.version)}
                          rightSection={
                            viewSnapshot === snapshot.version ? (
                              <IconLayersDifference size={24} color="green" />
                            ) : undefined
                          }
                        >
                          {snapshot.version}
                        </Button>
                      </List.Item>
                    ))}
                  </List>
                ) : (
                  <p>
                    <strong>No published snapshots</strong>
                  </p>
                )}
              </Card.Section>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
            <Card withBorder shadow="xs" radius="sm">
              <Card.Section inheritPadding py="xs">
                <Group justify="flex-start">
                  <IconLayersDifference size={24} />
                  <Title order={3}>
                    Snapshot Diff ({viewSnapshot} to {snapshots.current.version}
                    )
                  </Title>
                </Group>
                <Box pos="relative" py="md">
                  {fetcher.state === 'idle' &&
                    fetcher?.data?.changes.length > 0 && (
                      <List>
                        {fetcher?.data?.changes
                          .sort((a, b) =>
                            a.name
                              .toLowerCase()
                              .localeCompare(b.name.toLowerCase())
                          )
                          .map((update, idx) => (
                            <List.Item key={`update-${update.name}-${idx}`}>
                              {update.name}
                              {update?.version_change &&
                                `: ${update.version_change}`}
                            </List.Item>
                          ))}
                      </List>
                    )}
                  {fetcher.state === 'idle' &&
                    fetcher?.data?.changes.length === 0 && (
                      <p>No published snapshots</p>
                    )}
                </Box>
                {fetcher.state === 'loading' && (
                  <Box p="lg">
                    <Loader color="lime" size={25} type="bars" />
                  </Box>
                )}
              </Card.Section>
            </Card>
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col span={12}>
        <Alert
          variant="outline"
          color="lime"
          title="Source"
          icon={<img src={OSIcon} alt="OpenSUSE Logo" width="30" />}
        >
          Data for this page and the feeds collected from the openQA{' '}
          <Link to="https://openqa.opensuse.org/snapshot-changes/opensuse/Tumbleweed/">
            Snapshot
          </Link>{' '}
          pages
        </Alert>
      </Grid.Col>
    </Grid>
  );
}
