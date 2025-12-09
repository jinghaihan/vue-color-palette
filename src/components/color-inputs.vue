<script setup lang="ts">
import type { Colord, ColorFormat } from '../types'
import { colord } from 'colord'
import { computed } from 'vue'
import { InputHex, InputNumber } from './common'

const props = withDefaults(defineProps<{
  format: ColorFormat
  enableAlpha?: boolean
}>(), {
  enableAlpha: true,
})

const color = defineModel<Colord>('color', { required: true })

const rgb = computed(() => color.value.toRgb())
const hsl = computed(() => color.value.toHsl())
const hsv = computed(() => color.value.toHsv())
const cmyk = computed(() => color.value.toCmyk())

const hexValue = computed({
  get: () => color.value.toHex(),
  set: (value: string) => {
    const newColor = colord(value)
    if (newColor.isValid())
      color.value = newColor
  },
})

const rgbValues = {
  r: computed({
    get: () => rgb.value.r,
    set: (value: number) => {
      color.value = colord({ r: value, g: rgb.value.g, b: rgb.value.b, a: rgb.value.a ?? 1 })
    },
  }),
  g: computed({
    get: () => rgb.value.g,
    set: (value: number) => {
      color.value = colord({ r: rgb.value.r, g: value, b: rgb.value.b, a: rgb.value.a ?? 1 })
    },
  }),
  b: computed({
    get: () => rgb.value.b,
    set: (value: number) => {
      color.value = colord({ r: rgb.value.r, g: rgb.value.g, b: value, a: rgb.value.a ?? 1 })
    },
  }),
}

const hslValues = {
  h: computed({
    get: () => Math.round(hsl.value.h || 0),
    set: (value: number) => {
      color.value = colord({ h: value, s: hsl.value.s, l: hsl.value.l, a: hsl.value.a ?? 1 })
    },
  }),
  s: computed({
    get: () => Math.round(hsl.value.s),
    set: (value: number) => {
      color.value = colord({ h: hsl.value.h || 0, s: value, l: hsl.value.l, a: hsl.value.a ?? 1 })
    },
  }),
  l: computed({
    get: () => Math.round(hsl.value.l),
    set: (value: number) => {
      color.value = colord({ h: hsl.value.h || 0, s: hsl.value.s, l: value, a: hsl.value.a ?? 1 })
    },
  }),
}

const hsvValues = {
  h: computed({
    get: () => Math.round(hsv.value.h || 0),
    set: (value: number) => {
      color.value = colord({ h: value, s: hsv.value.s, v: hsv.value.v, a: hsv.value.a ?? 1 })
    },
  }),
  s: computed({
    get: () => Math.round(hsv.value.s),
    set: (value: number) => {
      color.value = colord({ h: hsv.value.h || 0, s: value, v: hsv.value.v, a: hsv.value.a ?? 1 })
    },
  }),
  v: computed({
    get: () => Math.round(hsv.value.v),
    set: (value: number) => {
      color.value = colord({ h: hsv.value.h || 0, s: hsv.value.s, v: value, a: hsv.value.a ?? 1 })
    },
  }),
}

const cmykValues = {
  c: computed({
    get: () => Math.round(cmyk.value.c),
    set: (value: number) => {
      color.value = colord({ c: value, m: cmyk.value.m, y: cmyk.value.y, k: cmyk.value.k })
    },
  }),
  m: computed({
    get: () => Math.round(cmyk.value.m),
    set: (value: number) => {
      color.value = colord({ c: cmyk.value.c, m: value, y: cmyk.value.y, k: cmyk.value.k })
    },
  }),
  y: computed({
    get: () => Math.round(cmyk.value.y),
    set: (value: number) => {
      color.value = colord({ c: cmyk.value.c, m: cmyk.value.m, y: value, k: cmyk.value.k })
    },
  }),
  k: computed({
    get: () => Math.round(cmyk.value.k),
    set: (value: number) => {
      color.value = colord({ c: cmyk.value.c, m: cmyk.value.m, y: cmyk.value.y, k: value })
    },
  }),
}

const alpha = computed({
  get: () => Math.round((rgb.value.a ?? 1) * 100),
  set: (value: number) => {
    color.value = colord({ r: rgb.value.r, g: rgb.value.g, b: rgb.value.b, a: value / 100 })
  },
})

const inputConfigs = {
  RGB: [
    { value: rgbValues.r, label: 'R', max: 255 },
    { value: rgbValues.g, label: 'G', max: 255 },
    { value: rgbValues.b, label: 'B', max: 255 },
  ],
  HSL: [
    { value: hslValues.h, label: 'H', max: 360 },
    { value: hslValues.s, label: 'S' },
    { value: hslValues.l, label: 'L' },
  ],
  HSV: [
    { value: hsvValues.h, label: 'H', max: 360 },
    { value: hsvValues.s, label: 'S' },
    { value: hsvValues.v, label: 'V' },
  ],
  CMYK: [
    { value: cmykValues.c, label: 'C' },
    { value: cmykValues.m, label: 'M' },
    { value: cmykValues.y, label: 'Y' },
    { value: cmykValues.k, label: 'K' },
  ],
}

const alphaConfig = { value: alpha, label: 'A' }
</script>

<template>
  <div data-color-palette="color-inputs">
    <template v-if="props.format === 'HEX' || props.format === 'RGB'">
      <InputHex v-model:value="hexValue" />
      <InputNumber
        v-for="config in inputConfigs.RGB"
        :key="config.label"
        v-model:value="config.value.value"
        :label="config.label"
        label-position="bottom"
        :max="config.max"
      />
      <InputNumber
        v-if="enableAlpha"
        v-model:value="alphaConfig.value.value"
        :label="alphaConfig.label"
        label-position="bottom"
      />
    </template>

    <template v-else-if="props.format === 'HSL'">
      <InputHex v-model:value="hexValue" />
      <InputNumber
        v-for="config in inputConfigs.HSL"
        :key="config.label"
        v-model:value="config.value.value"
        :label="config.label"
        label-position="bottom"
        :max="config.max"
      />
      <InputNumber
        v-if="enableAlpha"
        v-model:value="alphaConfig.value.value"
        :label="alphaConfig.label"
        label-position="bottom"
      />
    </template>

    <template v-else-if="props.format === 'HSV'">
      <InputHex v-model:value="hexValue" />
      <InputNumber
        v-for="config in inputConfigs.HSV"
        :key="config.label"
        v-model:value="config.value.value"
        :label="config.label"
        label-position="bottom"
        :max="config.max"
      />
      <InputNumber
        v-if="enableAlpha"
        v-model:value="alphaConfig.value.value"
        :label="alphaConfig.label"
        label-position="bottom"
      />
    </template>

    <template v-else-if="props.format === 'CMYK'">
      <InputNumber
        v-for="config in inputConfigs.CMYK"
        :key="config.label"
        v-model:value="config.value.value"
        :label="config.label"
        label-position="bottom"
      />
      <InputNumber
        v-if="enableAlpha"
        v-model:value="alphaConfig.value.value"
        :label="alphaConfig.label"
        label-position="bottom"
      />
    </template>
  </div>
</template>

<style>
.color-palette [data-color-palette='color-inputs'] {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: flex-start;
}

.color-palette [data-color-palette='color-inputs'] [data-color-palette='input-number-container'] {
  flex: 1;
}

.color-palette [data-color-palette='color-inputs'] [data-color-palette='input-number'],
.color-palette [data-color-palette='color-inputs'] [data-color-palette='input-hex-field'] {
  font-size: 1rem;
}
</style>
