/// <reference types="./types.d.ts" />

import eslint from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

/**
 * All packages that leverage t3-env should use this rule
 */
const restrictEnvAccess = tseslint.config(
  { ignores: ['**/env.js', '**/env.ts'] },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message: "Use `import { env } from '@/env'` instead to ensure validated types.",
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          name: 'process',
          importNames: ['env'],
          message: "Use `import { env } from '@/env'` instead to ensure validated types.",
        },
      ],
    },
  },
)

const baseConfig = tseslint.config(
  { ignores: ['**/*.config.*'] },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    plugins: {
      import: importPlugin,
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-misused-promises': [2, { checksVoidReturn: { attributes: false } }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        { allowConstantLoopConditions: true },
      ],
      '@typescript-eslint/require-await': 'off',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    },
  },
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: { parserOptions: { projectService: true } },
  },
)

/** @type {Awaited<import('typescript-eslint').Config>} */
const reactConfig = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      'react-refresh': reactRefreshPlugin, // Assuming this plugin is available
    },
    settings: {
      react: { version: '18.3' }, // Using 18.x
    },
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...hooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 0,
      'react/display-name': 0,

      'no-console': 1, // Check for debugging using Console.log()
      'no-lonely-if': 1, // else if not else {if}
      'no-unused-vars': 1, // declared/defined but never used
      'no-trailing-spaces': 1,
      'no-multi-spaces': 1,
      'no-multiple-empty-lines': 1,
      'space-before-blocks': ['error', 'always'],
      'object-curly-spacing': [1, 'always'],
      'indent': ['warn', 2],
      'semi': [1, 'never'],
      'quotes': ['error', 'single'],
      'array-bracket-spacing': 1,
      'linebreak-style': 0,
      'no-unexpected-multiline': 'warn',
      'keyword-spacing': 1,
      'comma-dangle': 1,
      'comma-spacing': 1,
      'arrow-spacing': 1,
    },
    languageOptions: { globals: { React: 'writable' } },
  },
]

/** @type {Awaited<import('typescript-eslint').Config>} */
const nextjsConfig = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // TypeError: context.getAncestors is not a function
      '@next/next/no-duplicate-head': 'off',
    },
  },
]

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.next/**', '.source/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
]
