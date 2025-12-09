<script setup lang="ts">
import type { Colord, GradientConfig, GradientStop } from '../types'
import { useEventListener } from '@vueuse/core'
import { colord } from 'colord'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  gradientColor?: string
  stopsMap: Map<number, GradientStop>
}>()

const color = defineModel<Colord>('color', { required: true })
const value = defineModel<GradientConfig>('value', { required: true })
const activeStopId = defineModel<number>('activeStopId', { required: true })

const containerRef = ref<HTMLElement>()
const draggingStopId = ref<number | null>(null)
const hasMoved = ref(false)
const isDragging = computed(() => draggingStopId.value !== null)

const maxId = computed(() => {
  return Math.max(...value.value.stops.map(stop => stop.id))
})

function getStopById(id: number) {
  return props.stopsMap.get(id)
}

function getThumbPosition(percentage: number) {
  return `max(0.5rem, min(calc(100% - 0.5rem), ${percentage}%))`
}

function getColorAtPosition(percentage: number): Colord {
  const stops = [...value.value.stops].sort((a, b) => a.percentage - b.percentage)

  // If position is before the first stop, return the first stop's color
  if (percentage <= stops[0].percentage) {
    return stops[0].color
  }

  // If position is after the last stop, return the last stop's color
  if (percentage >= stops[stops.length - 1].percentage) {
    return stops[stops.length - 1].color
  }

  // Find the two stops that bracket the position
  for (let i = 0; i < stops.length - 1; i++) {
    const stop1 = stops[i]
    const stop2 = stops[i + 1]

    if (percentage >= stop1.percentage && percentage <= stop2.percentage) {
      // Linear interpolation
      const ratio = (percentage - stop1.percentage) / (stop2.percentage - stop1.percentage)

      const rgb1 = stop1.color.toRgb()
      const rgb2 = stop2.color.toRgb()

      const interpolatedRgb = {
        r: Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio),
        g: Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio),
        b: Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio),
        a: rgb1.a + (rgb2.a - rgb1.a) * ratio,
      }

      return colord(interpolatedRgb)
    }
  }

  return stops[0].color
}

function updatePositionFromEvent(event: MouseEvent | TouchEvent, stopId: number) {
  if (!containerRef.value)
    return

  const rect = containerRef.value.getBoundingClientRect()
  let clientX: number

  if (event instanceof MouseEvent) {
    clientX = event.clientX
  }
  else {
    const touch = event.touches[0] || event.changedTouches[0]
    if (!touch)
      return
    clientX = touch.clientX
  }

  const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const percentage = Math.round(x * 100)

  value.value.stops = value.value.stops.map(stop =>
    stop.id === stopId ? { ...stop, percentage } : stop,
  )
}

function handleCreateStop(event: MouseEvent) {
  // Only create stop if not dragging and not just finished a drag
  if (isDragging.value || hasMoved.value || !(event.currentTarget instanceof HTMLElement))
    return

  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = Math.round((x / rect.width) * 100)

  const id = maxId.value + 1
  const colorAtPosition = getColorAtPosition(percentage)
  value.value.stops.push({
    id,
    percentage,
    color: colorAtPosition,
  })
  activeStopId.value = id
}

function onThumbMouseDown(event: MouseEvent, stopId: number) {
  activeStopId.value = stopId
  draggingStopId.value = stopId
  hasMoved.value = false
  updatePositionFromEvent(event, stopId)
  event.preventDefault()
  event.stopPropagation()
}

function onThumbTouchStart(event: TouchEvent, stopId: number) {
  activeStopId.value = stopId
  draggingStopId.value = stopId
  hasMoved.value = false
  updatePositionFromEvent(event, stopId)
  event.preventDefault()
  event.stopPropagation()
}

function onMouseMove(event: MouseEvent) {
  if (draggingStopId.value !== null) {
    hasMoved.value = true
    updatePositionFromEvent(event, draggingStopId.value)
  }
}

function onMouseUp() {
  if (draggingStopId.value !== null) {
    draggingStopId.value = null
    // Reset hasMoved after a short delay to allow click event to check it
    setTimeout(() => {
      hasMoved.value = false
    }, 0)
  }
}

function onTouchMove(event: TouchEvent) {
  if (draggingStopId.value !== null) {
    hasMoved.value = true
    updatePositionFromEvent(event, draggingStopId.value)
    event.preventDefault()
  }
}

function onTouchEnd() {
  if (draggingStopId.value !== null) {
    draggingStopId.value = null
    // Reset hasMoved after a short delay to allow click event to check it
    setTimeout(() => {
      hasMoved.value = false
    }, 0)
  }
}

watch(
  activeStopId,
  (stopId) => {
    const stop = getStopById(stopId)
    if (stop)
      color.value = stop.color
  },
  { immediate: true },
)

watch(
  color,
  (data) => {
    const stop = getStopById(activeStopId.value)
    if (stop)
      stop.color = data
  },
)

useEventListener(document, 'mousemove', onMouseMove)
useEventListener(document, 'mouseup', onMouseUp)
useEventListener(document, 'touchmove', onTouchMove, { passive: false })
useEventListener(document, 'touchend', onTouchEnd)
</script>

<template>
  <div
    ref="containerRef"
    class="slider"
    data-color-palette="gradient-slider"
    :style="{
      background: props.gradientColor || 'var(--primary)',
    }"
    @click="handleCreateStop"
  >
    <div
      v-for="item in value.stops"
      :key="item.id"
      class="slider-thumb"
      :class="{ 'is-selected': activeStopId === item.id }"
      data-color-palette="gradient-slider-thumb"
      :style="{
        position: 'absolute',
        left: getThumbPosition(item.percentage),
        backgroundColor: item.color.toRgbString(),
      }"
      @mousedown.stop="onThumbMouseDown($event, item.id)"
      @touchstart.stop="onThumbTouchStart($event, item.id)"
      @click.stop
    />
  </div>
</template>

<style>
.color-palette [data-color-palette='gradient-slider'] {
  position: relative;
}

.color-palette [data-color-palette='gradient-slider-thumb'] {
  pointer-events: auto;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 50%;
  transform: translate(-50%, -50%);
}

.color-palette [data-color-palette='gradient-slider-thumb'].is-selected::after {
  content: '';
  width: 0.25rem;
  height: 0.25rem;
  background-color: #fff;
  border-radius: 50%;
}
</style>
