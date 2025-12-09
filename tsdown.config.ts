import { defineConfig } from 'tsdown'
import { getPlugins } from './shared.ts'

export default defineConfig({
  entry: ['./src/index'],
  target: 'chrome89',
  platform: 'neutral',
  css: {
    splitting: false,
    fileName: 'index.css',
  },
  dts: {
    vue: true,
  },
  plugins: getPlugins(),
  copy: [
    {
      from: ['./src/theme.css'],
      to: './dist',
    },
  ],
})
