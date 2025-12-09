<script setup lang="ts">
import { useCycleList } from '@vueuse/core'
import { watch } from 'vue'
import Languages from '~icons/lucide/languages'
import { SUPPORT_LANGUAGES } from '../../../src'
import Button from './button.vue'

const locale = defineModel<string>('locale', { required: true, default: 'en-US' })

const { state, next } = useCycleList(SUPPORT_LANGUAGES, {
  initialValue: locale.value,
})

watch(state, () => locale.value = state.value)
</script>

<template>
  <Button @click="() => next()">
    <Languages />
  </Button>
</template>
