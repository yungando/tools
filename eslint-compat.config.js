import { GLOB_SRC, GLOB_TESTS } from '@antfu/eslint-config';
import config from '@yungando/eslint-config';
import jestPlugin from 'eslint-plugin-jest';
import reactPlugin from 'eslint-plugin-react';

const jestGlobalsConfig = {
  name: 'yungando/jest/globals',
  files: [
    ...GLOB_TESTS,
    '**/__test_helpers__/**',
    '**/__mocks__/**',
  ],
  languageOptions: {
    globals: {
      ...jestPlugin.configs['flat/recommended'].languageOptions.globals,
      fetchMock: false,
    },
  },
};

const reactConfig = {
  name: 'yungando/react/compat',
  plugins: { reactCompat: reactPlugin },
  files: [GLOB_SRC],
  /// keep-sorted
  rules: {
    'reactCompat/jsx-uses-react': 'error',
    'reactCompat/jsx-uses-vars': 'error',
  },
};

export default config({ test: true, react: true })
  .append([jestGlobalsConfig, reactConfig]); ;
