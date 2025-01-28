/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Theme } from 'app/themes/favorite';
export { Theme } from 'app/themes/favorite';
// Theme name - string
export const themeName = 'favorite';
// Default page name - string
export const pageName = 'Page';
// Theme Object
export const theme = Theme.theme;
export const site = {
  name: 'Grazie!',
  slogan: 'Powered by Grazie!',
  description: 'My Grazie! Site',
  copyright: 2024,
  owner: 'David Dyess II',
  separator: ' | ',
  url: 'http://localhost:3000'
};

export const metaSettings = {
  home: {
    title: 'Home'
  }
};

export const Pages = {
  root: 'Page',
  dashboard: 'Dashboard'
};
