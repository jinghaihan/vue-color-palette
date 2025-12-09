import type { colord } from 'colord'
import type { COLOR_FORMAT_CHOICES, COLOR_MODE_CHOICES } from './constants'

export type Colord = Omit<ReturnType<typeof colord>, 'parsed'>

export type ColorMode = (typeof COLOR_MODE_CHOICES)[number]
export type ColorFormat = (typeof COLOR_FORMAT_CHOICES)[number]

export interface ColorPickerProps {
  value?: string
  defaultValue?: string
  colorModes?: ColorMode[]
  format?: ColorFormat
  disabled?: boolean
  enableModePicker?: boolean
  enableFormatPicker?: boolean
  enableInput?: boolean
  enableAlpha?: boolean
  enableEyeDrop?: boolean
  recentColors?: false | string[]
  swatchColors?: boolean | string[]
  locale?: string | LocaleConfig
  isDark?: boolean
}

export interface ColorPickerTriggerProps extends Omit<ColorPickerProps, 'value'> {
  placeholder?: string
}

export interface GradientConfig {
  angle: number
  positionX: number
  positionY: number
  stops: GradientStop[]
}

export interface GradientStop {
  id: number
  percentage: number
  color: Colord
}

export interface LocaleConfig {
  button: {
    'monochrome': string
    'linear-gradient': string
    'radial-gradient': string
  }
  gradient: {
    'angle': string
    'position-x': string
    'position-y': string
    'percentage': string
  }
  text: {
    'swatch-colors': string
    'recent-colors': string
  }
}
