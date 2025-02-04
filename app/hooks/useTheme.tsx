/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { createContext, useContext } from 'react';

export type ThemeContextType = {
  theme?: string;
  page?: string;
  setPage?: Function;
  setTheme?: Function;
  data?: {
    footer: { links: { to: string; label: string } };
    navbar: { links: { to: string; label: string } };
    site: {
      name: string;
      copyright: string | number;
      slogan: string;
      description: string;
      url: string;
      owner: string;
      separator: string;
    };
  };
};

export const ThemeContext = createContext<ThemeContextType>({});

export const useTheme = () => useContext(ThemeContext);
