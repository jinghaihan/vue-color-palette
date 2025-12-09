<script setup lang="ts">
import type { Colord } from '../types'
import { colord } from 'colord'
import { computed } from 'vue'
import { Slider } from './common'

const props = withDefaults(defineProps<{
  previewColor?: string
  enableAlpha?: boolean
}>(), {
  enableAlpha: true,
})

const color = defineModel<Colord>('color', { required: true })

const hue = computed({
  get: () => {
    const hsv = color.value.toHsv()
    return hsv.h || 0
  },
  set: (value: number) => {
    const hsv = color.value.toHsv()
    color.value = colord({
      h: value,
      s: hsv.s,
      v: hsv.v,
      a: hsv.a,
    })
  },
})

const hueColor = computed(() => {
  const hsv = color.value.toHsv()
  return colord({
    h: hsv.h,
    s: 100,
    v: 100,
    a: 1,
  }).toRgbString()
})

const alpha = computed({
  get: () => {
    const rgba = color.value.toRgb()
    return (rgba.a ?? 1) * 100
  },
  set: (value: number) => {
    const rgba = color.value.toRgb()
    color.value = colord({
      r: rgba.r,
      g: rgba.g,
      b: rgba.b,
      a: value / 100,
    })
  },
})

const rgbColor = computed(() => color.value.toRgbString())

const backgroundGradient = computed(() => `linear-gradient(90deg, transparent 0%, ${hueColor.value} 100%)`)

const previewColor = computed(() => props.previewColor || hueColor.value)
</script>

<template>
  <div data-color-palette="hue-alpha-sliders-container">
    <div data-color-palette="hue-alpha-inner">
      <Slider
        v-model:value="hue"
        data-color-palette="hue-slider"
        max="360"
        step="0.1"
        :thumb-color="hueColor"
      />

      <div
        v-if="enableAlpha"
        class="alpha"
        data-color-palette="alpha-slider-container"
      >
        <Slider
          v-model:value="alpha"
          data-color-palette="alpha-slider"
          :thumb-color="rgbColor"
          :style="{
            background: backgroundGradient,
          }"
        />
      </div>
    </div>

    <div data-color-palette="color-preview">
      <div class="alpha">
        <div
          data-color-palette="color-preview-inner"
          :style="{
            background: previewColor,
          }"
        />
      </div>
    </div>
  </div>
</template>

<style>
.color-palette [data-color-palette='hue-alpha-sliders-container'] {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.color-palette [data-color-palette='hue-alpha-inner'] {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.color-palette [data-color-palette='hue-slider'] {
  background: linear-gradient(
    to right,
    #ff0000 0%,
    #ffff00 17%,
    #00ff00 33%,
    #00ffff 50%,
    #0000ff 67%,
    #ff00ff 83%,
    #ff0000 100%
  );
}

.color-palette [data-color-palette='alpha-slider-container'] {
  position: relative;
  height: 0.75rem;
  border-radius: 0.375rem;
}
.color-palette [data-color-palette='alpha-slider'] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.color-palette [data-color-palette='color-preview'] {
  flex-shrink: 0;
  height: 2.5rem;
  width: 2.5rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  overflow: hidden;
  margin-left: 0.25rem;
}
.color-palette [data-color-palette='color-preview'] .alpha {
  height: 100%;
}
.color-palette [data-color-palette='color-preview'] [data-color-palette='color-preview-inner'] {
  height: 100%;
  width: 100%;
}
</style>
