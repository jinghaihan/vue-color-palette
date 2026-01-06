<script setup lang="ts">
import type { ColorFormat, ColorPickerProps } from './types'
import { ref, toRefs, watch } from 'vue'
import { useDarkDetector, useFloating, useTailwindV3Theme } from './composables'
import ColorPicker from './index.vue'

const props = withDefaults(defineProps<ColorPickerProps & { placeholder?: string }>(), {
  colorModes: () => ['monochrome', 'linear-gradient', 'radial-gradient'],
  gradientMode: 'linear',
  enableModePicker: true,
  enableFormatPicker: true,
  enableInput: true,
  enableAlpha: true,
  enableEyeDrop: true,
  swatchColors: () => [],
  isDark: undefined,
  placeholder: '',
})

const emits = defineEmits<{
  (e: 'recentColorsChange', value: string[]): void
}>()
const { isDark: isDarkProp } = toRefs(props)

const { cssVariables } = useTailwindV3Theme({ element: props.themeElement })
const { isDark } = useDarkDetector(isDarkProp)

const value = defineModel<string | undefined>('value', { required: false, default: '' })
const format = defineModel<ColorFormat>('format', { default: 'HEX' })
const recentColors = defineModel<false | string[]>('recentColors', { default: [] })

const inputValue = ref<string>(value.value || '')

const {
  referenceEl: _referenceEl,
  floatingEl: _floatingEl,
  open,
  appendTo,
  floatingStyle,
  onClick,
} = useFloating({})

function handleBlur() {
  value.value = inputValue.value
}

function handleRecentColorsChange(colors: string[]) {
  emits('recentColorsChange', colors)
}

watch(value, (data) => {
  inputValue.value = data || ''
})
</script>

<template>
  <div
    class="color-palette-trigger"
    :class="[isDark ? 'dark' : 'light']"
    :style="cssVariables"
  >
    <div
      ref="_referenceEl"
      :data-disabled="disabled"
      data-color-palette="trigger"
      @click="!disabled && onClick()"
    >
      <div
        data-color-palette="trigger-preview"
        :style="{ background: value }"
        :data-disabled="disabled"
      />

      <input
        v-model="inputValue"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        data-color-palette="trigger-input"
        @blur="handleBlur"
      >

      <Teleport :to="appendTo">
        <div
          v-if="open"
          ref="_floatingEl"
          data-color-palette="trigger-popup"
          :style="floatingStyle"
        >
          <ColorPicker
            v-bind="props"
            v-model:value="value"
            v-model:format="format"
            v-model:recent-colors="recentColors"
            :is-dark="isDark"
            @recent-colors-change="handleRecentColorsChange"
          />
        </div>
      </Teleport>
    </div>
  </div>
</template>

<style>
.color-palette-trigger {
  display: inline-block;
}

.color-palette-trigger [data-color-palette='trigger'] {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--muted);
  height: 2.5rem;
  width: 100%;
  padding-inline: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}

.color-palette-trigger [data-color-palette='trigger'][data-disabled='true'] {
  cursor: not-allowed;
}

.color-palette-trigger [data-color-palette='trigger'][data-disabled='true'] * {
  pointer-events: none;
}

.color-palette-trigger [data-color-palette='trigger-preview'] {
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  cursor: pointer;
  flex-shrink: 0;
}

.color-palette-trigger [data-color-palette='trigger-preview'][data-disabled='true'] {
  cursor: not-allowed;
}

.color-palette-trigger [data-color-palette='trigger-input'] {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--foreground);
}

.color-palette-trigger [data-color-palette='trigger-input']:disabled {
  cursor: not-allowed;
}

.color-palette-trigger [data-color-palette='trigger-input']::placeholder {
  color: var(--muted-foreground);
}

.color-palette-trigger [data-color-palette='trigger-popup'] {
  z-index: 1000;
}
</style>
