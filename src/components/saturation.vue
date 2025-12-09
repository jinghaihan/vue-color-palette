<script setup lang="ts">
import type { Colord } from '../types'
import { useEventListener } from '@vueuse/core'
import { colord } from 'colord'
import { computed, ref } from 'vue'

const color = defineModel<Colord>('color', { required: true })

const containerRef = ref<HTMLElement>()
const isDragging = ref<boolean>(false)

const backgroundColor = computed(() => {
  const hsv = color.value.toHsv()
  return colord({ h: hsv.h, s: 100, v: 100, a: 1 }).toHslString()
})

const thumbColor = computed(() => color.value.toRgbString())

const position = computed(() => {
  const hsv = color.value.toHsv()
  return {
    x: (hsv.s / 100) * 100,
    y: (1 - hsv.v / 100) * 100,
  }
})

function updateColorFromEvent(event: MouseEvent | TouchEvent) {
  if (!containerRef.value)
    return

  const rect = containerRef.value.getBoundingClientRect()
  let clientX: number
  let clientY: number

  if (event instanceof MouseEvent) {
    clientX = event.clientX
    clientY = event.clientY
  }
  else {
    const touch = event.touches[0] || event.changedTouches[0]
    if (!touch)
      return
    clientX = touch.clientX
    clientY = touch.clientY
  }

  const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))

  const saturation = x * 100
  const value = (1 - y) * 100

  const hsv = color.value.toHsv()
  color.value = colord({
    h: hsv.h,
    s: saturation,
    v: value,
    a: hsv.a,
  })
}

function onClick(event: MouseEvent) {
  updateColorFromEvent(event)
}

function onMouseDown(event: MouseEvent) {
  isDragging.value = true
  updateColorFromEvent(event)
  event.preventDefault()
}

function onMouseMove(event: MouseEvent) {
  if (isDragging.value)
    updateColorFromEvent(event)
}

function onMouseUp() {
  isDragging.value = false
}

function onTouchStart(event: TouchEvent) {
  isDragging.value = true
  updateColorFromEvent(event)
  event.preventDefault()
}

function onTouchMove(event: TouchEvent) {
  if (isDragging.value) {
    updateColorFromEvent(event)
    event.preventDefault()
  }
}

function onTouchEnd() {
  isDragging.value = false
}

useEventListener(document, 'mousemove', onMouseMove)
useEventListener(document, 'mouseup', onMouseUp)
useEventListener(document, 'touchmove', onTouchMove, { passive: false })
useEventListener(document, 'touchend', onTouchEnd)
</script>

<template>
  <div
    ref="containerRef"
    data-color-palette="saturation"
    :style="{
      backgroundColor,
      cursor: isDragging ? 'grabbing' : 'grab',
    }"
    @click="onClick"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div
      data-color-palette="saturation-thumb"
      role="slider"
      :style="{
        left: `${position.x}%`,
        top: `${position.y}%`,
        backgroundColor: thumbColor,
      }"
    />
  </div>
</template>

<style>
.color-palette [data-color-palette='saturation'] {
  aspect-ratio: 1;
  border-radius: 0.375rem;
  overflow: hidden;
  position: relative;
}
.color-palette [data-color-palette='saturation']::before {
  background: linear-gradient(90deg, #fff, transparent);
}
.color-palette [data-color-palette='saturation']::after {
  background: linear-gradient(0deg, #000, transparent);
}
.color-palette [data-color-palette='saturation']::before,
.color-palette [data-color-palette='saturation']::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.color-palette [data-color-palette='saturation'] [data-color-palette='saturation-thumb'] {
  z-index: 1;
  position: absolute;
  transform: translate(-50%, -50%);
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}
</style>
