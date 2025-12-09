<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  min?: number | string
  max?: number | string
  step?: number | string
  thumbColor?: string
}>(), {
  min: 0,
  max: 100,
  step: 1,
  thumbColor: 'white',
})

const value = defineModel<number>('value', { required: true })

const percent = computed(() => {
  const min = Number(props.min)
  const max = Number(props.max)
  return `${((value.value - min) / (max - min)) * 100}%`
})
</script>

<template>
  <input
    v-model="value"
    data-color-palette="slider"
    class="slider"
    type="range"
    :min="min"
    :max="max"
    :step="step"
    :style="{
      '--thumb-color': thumbColor,
      '--percent': percent,
    }"
  >
</template>

<style>
.color-palette [data-color-palette='slider'] {
  background: linear-gradient(to right, var(--primary) var(--percent), var(--muted) var(--percent));
}
</style>
