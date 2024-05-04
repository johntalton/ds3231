import pluginJs from '@eslint/js'
import sec from 'eslint-plugin-security'

export default [
  // sec.configs.recommended,
  // pluginJs.configs.all,
  {
    ...pluginJs.configs.all,

    files: ['src/*.js'],
    rules: {
      // semi: 'off'
      "no-unused-vars": 'warn',

      complexity: ['warn', 5],

      'array-callback-return': ['error', { allowImplicit: true }],
      'consistent-return': 'error',
      curly: ['error', 'multi-line'], // multiline
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'max-classes-per-file': ['error', 1],
      'no-else-return': ['error', { allowElseIf: false }],
      'no-empty-pattern': 'error',
      'no-empty-static-block': 'warn',
      'no-global-assign': ['error', { exceptions: [] }],
      'no-invalid-this': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-magic-numbers': ['warn', {
        ignore: [],
        ignoreArrayIndexes: true,
        enforceConst: true,
        // detectObjects: false,
      }],
      'no-multi-spaces': ['error', {
        ignoreEOLComments: false,
      }],
      'no-new': 'error',
      'no-proto': 'error',
      'no-redeclare': 'error',
      'no-return-assign': ['error', 'always'],
      'no-return-await': 'error',
      'no-sequences': 'error',
      'no-useless-catch': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
      radix: 'error',
      'require-await': 'off',
      'vars-on-top': 'error',
      yoda: 'error'
    }
  }
]
