import { createTheme } from '@mantine/core';
import { Page } from '~/theme/pages/Page';
import { Dashboard } from '~/theme/pages/Dashboard';
import '~/theme/styles/Styles.css';

export const Theme = {
  Page,
  Dashboard,
  theme: createTheme({
    primaryColor: 'cyan',
    headings: {
      fontFamily: 'Greycliff CF, var(--mantine-font-family)'
    }
  })
};

export default Page;
