import globals from 'globals';
import eslint from '@eslint/js';
import { config, configs } from 'typescript-eslint';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default config(
  eslint.configs.recommended,
  ...configs.recommended,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2024
      }
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true
        }
      }
    }
  },
  eslintPluginPrettier
);
