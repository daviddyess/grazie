import { Anchor, AppShell, Burger, Group, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router';
import React from 'react';
import Navbar from '~/components/Dashboard/Navbar';
import { useTheme } from '~/hooks/useTheme';
import { site as defaultSite } from '@/grazie';

export function Dashboard({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const {
    data: { site }
  } = useTheme();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Anchor component={Link} to="/" underline="never">
            <Title order={1} size="1.50rem">
              {site?.name ?? defaultSite?.name ?? 'Site Name'}
            </Title>
          </Anchor>
          <Text fw={500} size="xl">
            Dashboard
          </Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
