# Site Folder

Grazie! allows you to override the default routes and theme of your site, by creating a `site` folder in the root of your project.

## Site Imports

The default path prefix for the `app` folder is `~/`, to import files from the `site` folder, you can use the `!~/` prefix.

## Site Routes

The `site` folder is allowed to contain a `routes.ts` file, which can be used to add new routes to your site. This file supports the same syntax as the `app/routes.ts` file, which is the standard React Router 7 Framework route file.

Routes matching the file names in `app/routes` and located in the `site/routes` folder will automatically override those `app` routes.

For example, if you create a file named `site/routes/test.tsx`, it will override the default route file used for `app/routes/test.tsx`.

## Site Theme

The `site` folder also contains a `theme` folder, which can be used to override the default theme of your site.

To override the default theme, create a file named `site/theme/index.tsx` and export a `Theme` object from it.

For example, if you create a file named `site/theme/index.tsx` and export a `Theme` object from it, it will override the default theme used for your site.

```tsx
// site/theme/index.tsx
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
```

In the above example, we're overriding the default theme with a custom theme that uses the `crimson` color palette, custom pages, and custom styles. It's still possible to import parts of the default theme if preferred.

Update the `import { Theme }` and `export { Theme }` statements in `grazie.config.ts` to use the `site/theme` file instead of the default `app/theme` file.
