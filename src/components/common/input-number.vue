<script setup lang="ts">
import { computed, watch } from 'vue'
import Label from './label.vue'

const props = withDefaults(defineProps<{
  suffix?: string
  label?: string
  labelPosition?: 'left' | 'bottom'
  min?: number
  max?: number
}>(), {
  labelPosition: 'left',
  min: 0,
  max: 100,
})

const value = defineModel<number>('value', { required: true })

const inputStyle = computed(() => {
  if (!props.suffix) {
    return {
      width: '100%',
    }
  }
  const width = String(value.value).length * 10
  return {
    width: `${width}px`,
  }
})

const inputSuffixStyle = computed(() => {
  return {
    fontSize: props.suffix === '°' ? '1rem' : '0.625rem',
  }
})

watch(
  value,
  (data) => {
    if (Number.isNaN(data) || !data) {
      value.value = props.min
      return
    }

    if (data > props.max)
      value.value = props.max
    if (data < props.min)
      value.value = props.min
  },
)
</script>

<template>
  <div data-color-palette="input-number-container">
    <div data-color-palette="input-number-inner">
      <Label v-if="label && labelPosition === 'left'">{{ label }}</Label>
      <section>
        <input
          v-model="value"
          data-color-palette="input-number"
          type="number"
          :min="min"
          :max="max"
          :style="inputStyle"
        >
        <span
          v-if="suffix"
          data-color-palette="input-number-suffix"
          :style="inputSuffixStyle"
        >
          {{ suffix }}
        </span>
      </section>
    </div>
    <Label v-if="label && labelPosition === 'bottom'">{{ label }}</Label>
  </div>
</template>

<style>
.color-palette [data-color-palette='input-number-container'] {
  display: flex;
  flex-direction: column;
  min-width: 0;
  align-items: center;
}

.color-palette [data-color-palette='input-number-inner'] {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.color-palette [data-color-palette='input-number-inner'] > section {
  display: flex;
  align-items: center;
  background-color: var(--muted);
  border-radius: 0.25rem;
  height: 2rem;
  padding: 0 0.5rem;
  width: 100%;
}

.color-palette [data-color-palette='input-number'] {
  background-color: transparent;
  color: var(--foreground);
  border: none;
  outline: none;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.color-palette [data-color-palette='input-number-icon'] {
  color: var(--muted-foreground);
  width: 0.75rem;
  height: 0.75rem;
}

.color-palette [data-color-palette='input-number-suffix'] {
  color: var(--muted-foreground);
  user-select: none;
}
</style>
