import globals from 'globals';
import eslint from '@eslint/js';
import { config, configs } from 'typescript-eslint';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default config(
  eslint.configs.recommended,
  ...configs.recommended,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  eslintPluginJsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2024
      }
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      'react/jsx-uses-react': 0,
      'react/react-in-jsx-scope': 0
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true
        }
      }
    }
  },
  eslintPluginPrettier
);
