import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { getPlugins } from './shared'

export default defineConfig({
  root: './playground',
  plugins: [
    ...getPlugins(),
    UnoCSS(),
  ],
})
