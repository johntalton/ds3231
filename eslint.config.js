import pluginJs from '@eslint/js'
import prom from 'eslint-plugin-promise'
import sec from 'eslint-plugin-security'

export default [
  {
    ...pluginJs.configs.all,
    ...prom.configs.all,
    ...sec.configs.all,
    // files: ['src/*.js'],
    rules: {
      // semi: 'off'
    }
  }
]
