/**
 * Grazie
 * @copyright Copyright (c) 2024-2025 David Dyess II
 * @license MIT see LICENSE
 */
/**
 * - DO NOT EDIT THIS FILE
 * - Copy this file to grazie.config.ts and edit that file
 * - Changes to this file will likely be overwritten by future updates
 */
import { Theme } from 'app/theme';
export { Theme } from 'app/theme';

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

export const siteLinks = [];

export const metaSettings = {
  home: {
    title: 'Home'
  }
};

export const Pages = {
  root: 'Page',
  dashboard: 'Dashboard'
};
