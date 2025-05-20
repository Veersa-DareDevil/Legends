import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { configs, parser as _parser } from 'typescript-eslint'

export default [
  {
    ignores: [
      'playwright-report/',
      'reports/',
      'custom-reporter.ts',
      'playwright.config.ts',
      'eslint.config.js',
      '.prettierrc.js',
    ],
  },
  ...configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      parser: _parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    files: ['**/*.ts'],
    rules: {
      // Enforce one line space between functions, classes, exports, and test cases
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: ['function', 'class', 'export'] },
        { blankLine: 'always', prev: ['function', 'class', 'export'], next: '*' },
      ],
      // Report unused variables/classes as errors
      '@typescript-eslint/no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
      ],
    },
  },
]
