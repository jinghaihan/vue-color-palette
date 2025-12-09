<script setup lang="ts">
import type { ColorMode, GradientConfig, GradientStop } from '../types'
import { computed } from 'vue'
import { useI18n } from '../composables'
import { Button, Icon, InputNumber } from './common'

const props = defineProps<{
  stopsMap: Map<number, GradientStop>
}>()

const colorMode = defineModel<ColorMode>('colorMode', { required: true, default: 'monochrome' })

const { t } = useI18n()

const angle = defineModel<number>('angle', { required: false, default: 90 })
const positionX = defineModel<number>('positionX', { required: false, default: 0 })
const positionY = defineModel<number>('positionY', { required: false, default: 50 })

const gradientConfig = defineModel<GradientConfig>('gradientConfig', { required: true })
const activeStopId = defineModel<number>('activeStopId', { required: true })

function getStopById(id: number) {
  return props.stopsMap.get(id)
}

const percentage = computed({
  get() {
    return getStopById(activeStopId.value)?.percentage ?? 0
  },
  set(value) {
    gradientConfig.value.stops = gradientConfig.value.stops.map(stop =>
      stop.id === activeStopId.value ? { ...stop, percentage: value } : stop,
    )
  },
})

function handleDelete() {
  if (gradientConfig.value.stops.length <= 2)
    return

  gradientConfig.value.stops = gradientConfig.value.stops.filter(
    stop => stop.id !== activeStopId.value,
  )
  activeStopId.value = gradientConfig.value.stops[0].id
}
</script>

<template>
  <div data-color-palette="gradient-controls">
    <div data-color-palette="gradient-input-controls">
      <InputNumber
        v-if="colorMode === 'linear-gradient'"
        v-model:value="angle"
        :label="t('gradient.angle')"
        :max="360"
        suffix="°"
      />

      <InputNumber
        v-if="colorMode === 'radial-gradient'"
        v-model:value="positionX"
        :label="t('gradient.position-x')"
        suffix="%"
      />
      <InputNumber
        v-if="colorMode === 'radial-gradient'"
        v-model:value="positionY"
        :label="t('gradient.position-y')"
        suffix="%"
      />

      <InputNumber
        v-model:value="percentage"
        :label="t('gradient.percentage')"
        suffix="%"
      />
    </div>

    <Button @click="handleDelete">
      <Icon.Trash />
    </Button>
  </div>
</template>

<style>
.color-palette [data-color-palette='gradient-controls'] {
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--muted);
  border-radius: 0.25rem;
  overflow: hidden;
}

.color-palette [data-color-palette='gradient-input-controls'] {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-inline: 1rem;
}
</style>
