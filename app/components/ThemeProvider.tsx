/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { useMatches, useRouteLoaderData } from 'react-router';
import React, { useEffect, useState } from 'react';
import { ThemeContext } from '~/hooks/useTheme';
import useMatchesData from '~/hooks/useMatchesData';
import { pageName, Theme, Pages } from '@/grazie';
import { notifications } from '@mantine/notifications';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const { id } = matches[matches.length - 1];
  const loader = useRouteLoaderData(id);
  const [_page, setPage] = useState(undefined);
  if (loader?._page !== _page) {
    setPage(loader?._page);
  }

  const Page = Theme?.[Pages?.[_page] ?? Theme?.[Pages?.[_page]] ?? pageName];
  const { theme: themeData, site, toast } = useMatchesData('root');
  const data = { ...themeData, site };

  useEffect(() => {
    if (toast) {
      let color;
      switch (toast?.type) {
        case 'success':
          color = 'green';
          break;
        case 'error':
          color = 'red';
          break;
        case 'warning':
          color = 'yellow';
          break;
        default:
          color = undefined;
      }

      notifications.show({ color, message: toast.message });
    }
  }, [toast]);

  return (
    <ThemeContext.Provider value={{ page: pageName, setPage, data }}>
      <Page>{children}</Page>
    </ThemeContext.Provider>
  );
}
