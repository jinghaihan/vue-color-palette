import type { Plugin } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'

export function getPlugins<T = Plugin>(): T[] {
  return [
    Vue(),
    Icons({ compiler: 'vue3' }),
  ] as T[]
}
