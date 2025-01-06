import globals from 'globals';
import pluginTypescript from '@typescript-eslint/eslint-plugin';
import pluginTypescriptParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: globals.browser,
      parser: pluginTypescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTypescript,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-parens': ['error', 'always'],
      'arrow-spacing': 'error',
      'block-spacing': 'error',
      'brace-style': 'error',
      'comma-spacing': 'error',
      'func-call-spacing': 'error',
      'rest-spread-spacing': 'error',
      'object-curly-spacing': ['error', 'always'],
      'indent': ['error', 2],
      'key-spacing': 'error',
      'keyword-spacing': 'error',
      'space-before-function-paren': 'error',
      'new-parens': 'error',
      'quotes': ['error', 'single'],
      'space-before-blocks': 'error',
      'space-in-parens': 'error',
      'eqeqeq': ['error', 'smart'],
    },
  },
];
