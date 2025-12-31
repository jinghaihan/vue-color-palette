import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  formatters: {
    html: true,
    css: true,
  },
  rules: {
    'pnpm/yaml-enforce-settings': 'off',
  },
})
