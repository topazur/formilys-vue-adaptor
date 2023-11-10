module.exports = {
  extends: ['@antfu/eslint-config'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    '@typescript-eslint/no-unused-vars': 1,
    // curly braces in object
    'curly': ['error', 'multi-line', 'consistent'],
    // 每行最大语句数
    'max-statements-per-line': ['error', { max: 2 }],
    // [import/order](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md)
    'import/order': ['error',
      {
        'groups': ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], 'unknown', 'object', 'type'],
        'newlines-between': 'always',
        'pathGroupsExcludedImportTypes': ['builtin'],
        'warnOnUnassignedImports': false,
      },
    ],
  },
}
