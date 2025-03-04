import { Box } from '@mantine/core';
import React from 'react';
import { Footer } from '~/theme/components/Footer';
import { Header } from '~/theme/components/Header';

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box p={15}>{children}</Box>
      <Footer />
    </>
  );
}
