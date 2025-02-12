import { createTheme } from '@mantine/core';
import { Page } from '!~/theme/pages/Page';
import { Dashboard } from '!~/theme/pages/Dashboard';
import '!~/theme/styles/Styles.css';

export const Theme = {
  Page,
  Dashboard,
  theme: createTheme({
    colors: {
      // https://mantine.dev/colors-generator/?color=C91A25
      crimson: [
        '#ffeaec',
        '#fdd4d6',
        '#f4a7ac',
        '#ec777e',
        '#e64f57',
        '#e3353f',
        '#e22732',
        '#c91a25',
        '#b31220',
        '#9e0419'
      ]
    },
    primaryShade: 9,
    primaryColor: 'crimson'
  })
};

export default Page;
