import tseslint from 'typescript-eslint';
export default [{
  files: ['design/src/domain/**/*.ts', 'design/src/variants/**/*.ts', 'design/src/application/**/*.ts'],
  languageOptions: { parser: tseslint.parser },
  rules: { complexity: ['error', { max: 10, variant: 'classic' }] }
}];
