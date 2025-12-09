<script setup lang="ts">
import type { Colord } from '../types'
import { colord } from 'colord'
import { isClient } from '../utils'
import { Button, Icon } from './common'

const color = defineModel<Colord>('color', { required: true })

function handleEyeDrop() {
  if (!isClient() || !('EyeDropper' in window))
    return

  // @ts-expect-error experimental API
  const eyeDropper = new EyeDropper()
  eyeDropper
    .open()
    .then((result: { sRGBHex: string }) => {
      color.value = colord(result.sRGBHex)
    })
}
</script>

<template>
  <Button @click="handleEyeDrop">
    <Icon.ColorPicker />
  </Button>
</template>
