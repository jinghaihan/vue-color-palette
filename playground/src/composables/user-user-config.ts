import { useStorage } from '@vueuse/core'

export const userConfig = useStorage<{
  color: string
  locale: string
  monochrome: boolean
  linearGradient: boolean
  radialGradient: boolean
  disabled: boolean
  enableModePicker: boolean
  enableFormatPicker: boolean
  enableInput: boolean
  enableAlpha: boolean
  enableEyeDrop: boolean
  swatchColors: boolean
  recentColors: string[]
  recentColorsEnable: boolean
}>(
  'user-config',
  {
    color: 'linear-gradient(to right, #4e4376, #2b5876)',
    locale: 'en-US',
    monochrome: true,
    linearGradient: true,
    radialGradient: true,
    disabled: false,
    enableModePicker: true,
    enableFormatPicker: true,
    enableInput: true,
    enableAlpha: true,
    enableEyeDrop: true,
    swatchColors: true,
    recentColors: [],
    recentColorsEnable: true,
  },
  localStorage,
  {
    mergeDefaults: true,
  },
)
