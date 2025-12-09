<script setup lang="ts">
import type { ColorFormat } from '../types'
import { useFloating } from '../composables'
import { COLOR_FORMAT_CHOICES } from '../constants'
import { Button, Icon } from './common'

const format = defineModel<ColorFormat>('format', { required: true, default: 'HEX' })

const {
  referenceEl: _referenceEl,
  floatingEl: _floatingEl,
  open,
  floatingStyle,
  onClick,
  appendTo,
} = useFloating({})

function handleSelect(value: ColorFormat) {
  format.value = value
  open.value = false
}
</script>

<template>
  <div data-color-palette="format-picker">
    <span ref="_referenceEl" @click="onClick">
      <Button>
        <div data-color-palette="format-picker-label">
          {{ format }}
        </div>
        <Icon.ChevronDown />
      </Button>
    </span>

    <Teleport :to="appendTo">
      <div
        v-if="open"
        ref="_floatingEl"
        data-color-palette="format-picker-dropdown"
        :style="floatingStyle"
      >
        <Button
          v-for="choice in COLOR_FORMAT_CHOICES"
          :key="choice"
          :data-active="format === choice"
          @click="handleSelect(choice)"
        >
          {{ choice }}
        </Button>
      </div>
    </Teleport>
  </div>
</template>

<style>
.color-palette [data-color-palette='format-picker'] {
  height: 100%;
  display: inline-flex;
  align-items: center;
}

.color-palette [data-color-palette='format-picker-dropdown'] {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.25rem;
  background-color: var(--popover);
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  z-index: 1000;
  min-width: 4rem;
}

.color-palette [data-color-palette='format-picker-dropdown'] [data-active='true'] {
  background-color: var(--accent);
  color: var(--accent-foreground);
}
.color-palette [data-color-palette='format-picker-label'] {
  padding-top: 1px;
}
</style>
