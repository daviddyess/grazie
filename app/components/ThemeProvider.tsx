import { useMatches, useRouteLoaderData } from '@remix-run/react';
import { ReactNode, useEffect, useState } from 'react';
import { ThemeContext } from '~/hooks/useTheme';
import useMatchesData from '~/hooks/useMatchesData';
import { themeName, pageName, Theme, Pages } from '@/grazie';
import { notifications } from '@mantine/notifications';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const matches = useMatches();
  const { id } = matches[matches.length - 1];
  const loader = useRouteLoaderData(id);
  const [_theme, setTheme] = useState(themeName);
  const [_page, setPage] = useState('root');
  if (loader && loader?._page !== _page) {
    setPage(loader._page);
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
    <ThemeContext.Provider
      value={{ theme: themeName, setTheme, page: pageName, setPage, data }}
    >
      <Page>{children}</Page>
    </ThemeContext.Provider>
  );
}
