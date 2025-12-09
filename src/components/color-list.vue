<script setup lang="ts">
import type { ColorMode } from '../types'
import { computed } from 'vue'
import { detectColorMode } from '../utils'
import { Button, Icon } from './common'
import Collapse from './common/collapse.vue'

const props = withDefaults(defineProps<{
  label?: string
  enableAddColor?: boolean
  enableRemoveColor?: boolean
}>(), {
  enableAddColor: false,
  enableRemoveColor: false,
})

const value = defineModel<string | undefined>('value', { required: true })
const colors = defineModel<string[]>('colors', { required: false, default: () => [] })
const colorMode = defineModel<ColorMode>('colorMode')

const enableActions = computed(() => props.enableAddColor || props.enableRemoveColor)

function handleSelect(item: string) {
  const detectedMode = detectColorMode(item)
  if (colorMode?.value !== detectedMode) {
    colorMode!.value = detectedMode
  }

  value.value = item
}

function handleAddColor() {
  const colorToAdd = value.value
  if (colorToAdd && !colors.value.includes(colorToAdd))
    colors.value.push(colorToAdd)
}

function handleRemoveColor() {
  const colorToRemove = value.value
  if (colorToRemove) {
    colors.value = colors.value.filter(
      item => item.toLowerCase() !== colorToRemove.toLowerCase(),
    )
  }
}
</script>

<template>
  <Collapse :title="label">
    <template v-if="enableActions" #actions>
      <Button v-if="enableAddColor" @click="handleAddColor">
        <Icon.Plus />
      </Button>
      <Button v-if="enableRemoveColor && colors.length > 0" @click="handleRemoveColor">
        <Icon.Trash />
      </Button>
    </template>

    <div data-color-palette="color-list">
      <div
        v-for="item in colors"
        :key="item"
        data-color-palette="color-list-item"
        :style="{ background: item }"
        @click="() => handleSelect(item)"
      />
    </div>
  </Collapse>
</template>

<style>
.color-palette [data-color-palette='color-list'] {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.color-palette [data-color-palette='color-list-item'] {
  aspect-ratio: 1;
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  cursor: pointer;
}

.color-palette [data-color-palette='color-list-item']:hover {
  transform: scale(1.15);
  transition-duration: var(--default-transition-duration);
}
</style>
