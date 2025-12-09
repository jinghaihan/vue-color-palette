<script setup lang="ts">
import type { ColorMode } from '../types'
import { computed, watch } from 'vue'
import { useI18n } from '../composables'
import { Button } from './common'

const props = withDefaults(defineProps<{
  colorModes?: ColorMode[]
}>(), {
  colorModes: () => ['monochrome', 'linear-gradient', 'radial-gradient'],
})

const colorMode = defineModel<ColorMode>('colorMode', { required: true, default: 'monochrome' })

const { t } = useI18n()

const modeOptions = computed(() => {
  return props.colorModes.map(mode => ({
    label: t(`button.${mode}`),
    value: mode,
  }))
})

const colorModeInOptions = computed(() =>
  modeOptions.value.find(option => option.value === colorMode.value),
)

const isSegmented = computed(() => props.colorModes.length > 1)

watch(
  colorModeInOptions,
  () => {
    if (!colorModeInOptions.value)
      colorMode.value = props.colorModes[0] ?? 'monochrome'
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="isSegmented" data-color-palette="mode-picker">
    <Button
      v-for="option in modeOptions"
      :key="option.value"
      :data-active="colorMode === option.value"
      :value="option.value"
      @click="colorMode = option.value"
    >
      {{ option.label }}
    </Button>
  </div>
</template>

<style>
.color-palette [data-color-palette='mode-picker'] {
  display: inline-flex;
  height: 1.75rem;
  width: fit-content;
  align-items: center;
  padding: 3px;
  border-radius: 0.25rem;
  background-color: var(--muted);
  color: var(--muted-foreground);
}

.color-palette [data-color-palette='mode-picker'] [data-color-palette='button'] {
  height: 100%;
  padding-inline: 0.5rem;
  border-radius: 0.25rem;
}

.color-palette [data-color-palette='mode-picker'] [data-active='true'] {
  background-color: var(--background);
  color: var(--foreground);
  box-shadow:
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
}
</style>
