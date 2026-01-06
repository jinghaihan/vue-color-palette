<script setup lang="ts">
import type { Colord, ColorFormat, ColorMode, ColorPickerProps, GradientConfig } from './types'
import { colord, extend } from 'colord'
import cmykPlugin from 'colord/plugins/cmyk'
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import ColorInputs from './components/color-inputs.vue'
import ColorList from './components/color-list.vue'
import ColorToolbar from './components/color-toolbar.vue'
import GradientControls from './components/gradient-controls.vue'
import GradientSlider from './components/gradient-slider.vue'
import HueAlphaSliders from './components/hue-alpha-sliders.vue'
import ModePicker from './components/mode-picker.vue'
import Saturation from './components/saturation.vue'
import { useDarkDetector, useI18n, useLocaleDetector, useTailwindV3Theme } from './composables'
import { DEFAULT_GRADIENT_STOPS, SWATCH_COLORS } from './constants'
import { loadLocaleMessages, localeLoaded } from './locales'
import { isClient, parseGradient } from './utils'

const props = withDefaults(defineProps<ColorPickerProps>(), {
  colorModes: () => ['monochrome', 'linear-gradient', 'radial-gradient'],
  gradientMode: 'linear',
  enableModePicker: true,
  enableFormatPicker: true,
  enableInput: true,
  enableAlpha: true,
  enableEyeDrop: true,
  swatchColors: () => [],
  isDark: undefined,
})

const emits = defineEmits<{
  (e: 'recentColorsChange', value: string[]): void
}>()

extend([cmykPlugin])

const value = defineModel<string | undefined>('value', { required: false, default: '' })
const format = defineModel<ColorFormat>('format', { default: 'HEX' })
const recentColors = defineModel<false | string[]>('recentColors', { default: [] })

const { locale: localeProp, isDark: isDarkProp } = toRefs(props)

const { cssVariables } = useTailwindV3Theme({ element: props.themeElement })
const { isDark } = useDarkDetector(isDarkProp)
const { locale } = useLocaleDetector(localeProp)
const { t } = useI18n()

const currentColorMode = ref<ColorMode>(props.colorModes[0] ?? 'monochrome')
const selectedStopId = ref<number>(1)

const gradientConfig = ref<GradientConfig>({
  angle: 90,
  positionX: 0,
  positionY: 50,
  stops: DEFAULT_GRADIENT_STOPS.map(stop => ({
    id: stop.id,
    percentage: stop.percentage,
    color: colord(stop.color),
  })),
})

const stopsMap = computed(() => {
  return new Map(gradientConfig.value.stops.map(stop => [stop.id, stop]))
})

const currentColor = ref<Colord>(parseColor())

const enableEyeDrop = computed(() => props.enableEyeDrop && isClient() && 'EyeDropper' in window)

const hasControls = computed(() => {
  return props.enableModePicker
    || props.enableFormatPicker
    || enableEyeDrop.value
})

const gradientColor = computed(() => {
  if (currentColorMode.value === 'monochrome')
    return ''

  const stops = [...gradientConfig.value.stops]
    .sort((a, b) => a.percentage - b.percentage)
    .map(stop => `${generateColor(stop.color)} ${stop.percentage}%`)
    .join(', ')

  if (currentColorMode.value === 'linear-gradient')
    return `linear-gradient(${gradientConfig.value.angle}deg, ${stops})`

  if (currentColorMode.value === 'radial-gradient')
    return `radial-gradient(circle at ${gradientConfig.value.positionX}% ${gradientConfig.value.positionY}%, ${stops})`

  return ''
})

const color = computed(
  () => currentColorMode.value === 'monochrome'
    ? generateColor(currentColor.value)
    : gradientColor.value,
)

const swatchColors = computed(() => {
  if (props.swatchColors === false)
    return []
  if (props.swatchColors === true)
    return SWATCH_COLORS
  return Array.isArray(props.swatchColors) ? props.swatchColors : []
})

const enableRecentColors = computed(() => props.recentColors !== false)
const _recentColors = computed({
  get: () => Array.isArray(recentColors.value) ? recentColors.value : [],
  set: (value: string[]) => {
    recentColors.value = value
  },
})

function parseColor(): Colord {
  const colorValue = value.value || props.defaultValue
  if (!colorValue)
    return colord(DEFAULT_GRADIENT_STOPS[0].color)

  const gradientResult = parseGradient(colorValue)
  if (gradientResult) {
    currentColorMode.value = gradientResult.mode
    gradientConfig.value = gradientResult.config

    const currentStopExists = stopsMap.value.has(selectedStopId.value)
    if (!currentStopExists) {
      selectedStopId.value = gradientResult.config.stops[0]?.id || 1
    }

    return stopsMap.value.get(selectedStopId.value)?.color
      || gradientResult.config.stops[0]?.color
      || DEFAULT_GRADIENT_STOPS[0].color
  }

  return colord(colorValue)
}

function generateColor(color: Colord): string | undefined {
  switch (format.value) {
    case 'HEX':
      return color.toHex()
    case 'RGB':
      return color.toRgbString()
    case 'HSL':
      return color.toHslString()
    default:
      return color.toRgbString()
  }
}

function handleRecentColorsChange(value: string[]) {
  recentColors.value = value
  emits('recentColorsChange', value)
}

onMounted(() => {
  if (props.locale !== 'en-US')
    loadLocaleMessages(locale.value)
})

watch(value, () => currentColor.value = parseColor())
watch(color, () => value.value = color.value)
watch(locale, () => loadLocaleMessages(locale.value))
</script>

<template>
  <div
    v-if="localeLoaded"
    :data-disabled="disabled"
    class="color-palette"
    :class="[isDark ? 'dark' : 'light']"
    data-color-palette="color-palette"
    :style="cssVariables"
  >
    <Saturation
      v-model:color="currentColor"
    />

    <div v-if="hasControls" data-color-palette="controls-container">
      <div>
        <ModePicker
          v-if="enableModePicker"
          v-model:color-mode="currentColorMode"
          :color-modes="colorModes"
        />
      </div>

      <ColorToolbar
        v-model:color="currentColor"
        v-model:format="format"
        :enable-eye-drop="enableEyeDrop"
        :enable-format-picker="enableFormatPicker"
      />
    </div>

    <GradientControls
      v-if="currentColorMode !== 'monochrome'"
      v-model:color-mode="currentColorMode"
      v-model:angle="gradientConfig.angle"
      v-model:position-x="gradientConfig.positionX"
      v-model:position-y="gradientConfig.positionY"
      v-model:gradient-config="gradientConfig"
      v-model:active-stop-id="selectedStopId"
      :stops-map="stopsMap"
    />

    <GradientSlider
      v-if="currentColorMode !== 'monochrome'"
      v-model:color="currentColor"
      v-model:value="gradientConfig"
      v-model:active-stop-id="selectedStopId"
      :gradient-color="gradientColor"
      :stops-map="stopsMap"
    />

    <HueAlphaSliders
      v-model:color="currentColor"
      :preview-color="color"
      :enable-alpha="enableAlpha"
      :enable-eye-drop="enableEyeDrop"
    />

    <ColorInputs
      v-if="enableInput"
      v-model:color="currentColor"
      :format="format"
      :enable-alpha="enableAlpha"
    />

    <ColorList
      v-if="enableRecentColors"
      v-model:value="value"
      v-model:colors="_recentColors"
      v-model:color-mode="currentColorMode"
      :label="t('text.recent-colors')"
      :enable-add-color="true"
      :enable-remove-color="true"
      @change="handleRecentColorsChange"
    />

    <ColorList
      v-if="swatchColors.length > 0"
      v-model:value="value"
      v-model:color-mode="currentColorMode"
      :colors="swatchColors"
      :label="t('text.swatch-colors')"
    />
  </div>
</template>

<style>
@import './style.css';

.color-palette {
  --default-transition-duration: 150ms;

  background-color: var(--popover);
  border: 1px solid var(--border);

  display: flex;
  flex-direction: column;
  width: 320px;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.color-palette * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border: 0 solid;
}

.color-palette[data-disabled='true'] {
  cursor: not-allowed;
}

.color-palette[data-disabled='true'] * {
  pointer-events: none;
}

.color-palette [data-color-palette='controls-container'] {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
