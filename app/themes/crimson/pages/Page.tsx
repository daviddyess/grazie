import { Box } from '@mantine/core';
import React from 'react';
import { Footer } from '~/themes/favorite/components/Footer';
import { Header } from '~/themes/favorite/components/Header';

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box p={15}>{children}</Box>
      <Footer />
    </>
  );
}
