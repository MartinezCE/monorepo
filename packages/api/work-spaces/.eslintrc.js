module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['airbnb-typescript/base', 'plugin:prettier/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars-experimental': 'off',
    'object-curly-spacing': ['warn', 'always'],
    '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-use-before-define': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-throw-literal': 'off',
    'no-param-reassign': 'off',
    "no-console": "off" // TODO: Remove this rule when implemeting winston
  },
};
