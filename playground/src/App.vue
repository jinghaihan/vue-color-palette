<script setup lang="ts">
import type { ColorMode, ColorPickerProps } from '../../src'
import { useClipboard } from '@vueuse/core'
import { computed, watch } from 'vue'
import Check from '~icons/lucide/check'
import Copy from '~icons/lucide/copy'
import { version } from '../../package.json'
import { ColorPicker, ColorPickerTrigger } from '../../src'
import Button from './components/button.vue'
import DarkToggle from './components/dark-toggle.vue'
import GitHubButton from './components/github-button.vue'
import Label from './components/label.vue'
import LocaleToggle from './components/locale-toggle.vue'
import Switch from './components/switch.vue'
import { userConfig } from './composables'

const { copy, copied } = useClipboard({
  legacy: true,
})

const colorModes = computed(() => {
  const data: ColorMode[] = []

  if (userConfig.value.monochrome)
    data.push('monochrome')
  if (userConfig.value.linearGradient)
    data.push('linear-gradient')
  if (userConfig.value.radialGradient)
    data.push('radial-gradient')
  return data
})

const recentColors = computed({
  get: () => userConfig.value.recentColorsEnable
    ? userConfig.value.recentColors
    : false,
  set: (value: false | string[]) => {
    if (typeof value !== 'boolean')
      userConfig.value.recentColors = value
  },
})

const colorPickerProps = computed<ColorPickerProps>(() => ({
  disabled: userConfig.value.disabled,
  colorModes: colorModes.value,
  enableModePicker: userConfig.value.enableModePicker,
  enableFormatPicker: userConfig.value.enableFormatPicker,
  enableInput: userConfig.value.enableInput,
  enableAlpha: userConfig.value.enableAlpha,
  enableEyeDrop: userConfig.value.enableEyeDrop,
  swatchColors: userConfig.value.swatchColors,
  locale: userConfig.value.locale,
}))

const BLOCK_CLASSES = [
  'flex',
  'items-center',
  'justify-between',
]

function handleCopy() {
  copy(userConfig.value.color)
}

watch(
  () => userConfig.value.color,
  () => {
    document.body.style.background = userConfig.value.color
  },
  { immediate: true },
)
</script>

<template>
  <div class="p-4 flex flex-col gap-4 size-full items-center overflow-auto lg:flex-row lg:justify-center">
    <ColorPicker
      v-model:value="userConfig.color"
      v-model:recent-colors="recentColors"
      v-bind="colorPickerProps"
    />

    <div class="px-3 py-2 border border-border rounded-md bg-card w-80">
      <div class="flex gap-2">
        <h3 class="text-lg font-bold">
          Vue Color Palette
        </h3>
        <small class="font-mono">v{{ version }}</small>
      </div>

      <div class="mb-1 flex items-center justify-end">
        <Button @click="handleCopy">
          <component :is="copied ? Check : Copy" />
        </Button>
        <LocaleToggle v-model:locale="userConfig.locale" />
        <DarkToggle />
        <GitHubButton />
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex gap-1 items-center">
          <ColorPickerTrigger
            v-model:value="userConfig.color"
            v-model:recent-colors="recentColors"
            class="w-full"
            v-bind="colorPickerProps"
          />
        </div>

        <div class="flex flex-col gap-3">
          <div :class="BLOCK_CLASSES">
            <Label>Disabled</Label>
            <Switch v-model:value="userConfig.disabled" />
          </div>

          <div :class="BLOCK_CLASSES">
            <Label>Solid Color</Label>
            <Switch v-model:value="userConfig.monochrome" />
          </div>

          <div :class="BLOCK_CLASSES">
            <Label>Linear Gradient</Label>
            <Switch v-model:value="userConfig.linearGradient" />
          </div>

          <div :class="BLOCK_CLASSES">
            <Label>Radial Gradient</Label>
            <Switch v-model:value="userConfig.radialGradient" />
          </div>

          <div :class="BLOCK_CLASSES">
            <Label>Mode Picker</Label>
            <Switch v-model:value="userConfig.enableModePicker" />
          </div>

          <div :class="BLOCK_CLASSES">
            <Label>Format Picker</Label>
            <Switch v-model:value="userConfig.enableFormatPicker" />
          </div>

          <div :class="BLOCK_CLASSES">
            <Label>Input</Label>
            <Switch v-model:value="userConfig.enableInput" />
          </div>

          <div :class="BLOCK_CLASSES">
            <Label>Alpha</Label>
            <Switch v-model:value="userConfig.enableAlpha" />
          </div>

          <div :class="BLOCK_CLASSES">
            <Label>Eye Drop</Label>
            <Switch v-model:value="userConfig.enableEyeDrop" />
          </div>

          <div :class="BLOCK_CLASSES">
            <Label>Recent Colors</Label>
            <Switch v-model:value="userConfig.recentColorsEnable" />
          </div>

          <div :class="BLOCK_CLASSES">
            <Label>Swatch Colors</Label>
            <Switch v-model:value="userConfig.swatchColors" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
