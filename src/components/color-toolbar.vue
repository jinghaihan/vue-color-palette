<script setup lang="ts">
import type { Colord, ColorFormat } from '../types'
import EyeDropper from './eye-dropper.vue'
import FormatPicker from './format-picker.vue'

withDefaults(defineProps<{
  enableEyeDrop?: boolean
  enableFormatPicker?: boolean
}>(), {
  enableEyeDrop: true,
  enableFormatPicker: true,
})

const format = defineModel<ColorFormat>('format', { required: true, default: 'HEX' })
const color = defineModel<Colord>('color', { required: true })
</script>

<template>
  <div data-color-palette="color-toolbar">
    <EyeDropper v-if="enableEyeDrop" v-model:color="color" :enable-eye-drop="enableEyeDrop" />
    <FormatPicker v-if="enableFormatPicker" v-model:format="format" />
  </div>
</template>

<style>
.color-palette [data-color-palette='color-toolbar'] {
  display: inline-flex;
  height: 1.75rem;
  display: flex;
  border-radius: 0.25rem;
  background-color: var(--muted);
  color: var(--muted-foreground);
}
</style>
