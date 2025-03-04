import { AppShell, Box, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { useLoaderData } from 'react-router';
import BlockGroupDisplay from '~/components/BlockGroup/Display';
import { Footer } from '~/theme/components/Footer';
import { Header } from '~/theme/components/Header';
import { empty } from '~/utils/generic';

export function Page({ children }: { children: React.ReactNode }) {
  const { blocksGroup } = useLoaderData();
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={
        !empty(blocksGroup?.left)
          ? {
              width: { base: 250, md: 250, lg: 300 },
              breakpoint: 'sm',
              collapsed: { mobile: !opened }
            }
          : undefined
      }
      padding="sm"
    >
      <AppShell.Header>
        <Header
          handle={
            !empty(blocksGroup?.left) ? (
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
            ) : undefined
          }
        />
      </AppShell.Header>
      {!empty(blocksGroup?.left) && (
        <AppShell.Navbar>
          <BlockGroupDisplay blocks={blocksGroup?.left} />
        </AppShell.Navbar>
      )}
      <AppShell.Main>
        {children}
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}
