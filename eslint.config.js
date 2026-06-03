import { defineConfig } from 'eslint/config'
import tsPrefixer from 'eslint-config-ts-prefixer'
import reactHooks from 'eslint-plugin-react-hooks'

export default defineConfig([
  ...tsPrefixer,
  {
    files: ['registry/**/*.ts', 'registry/**/*.tsx'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: {
          allowDefaultProject: ['eslint.config.js', 'scripts/*.mjs'],
          defaultProject: 'tsconfig.json',
        },
      },
    },
  },
])
