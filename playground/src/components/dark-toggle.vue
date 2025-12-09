<script setup lang="ts">
import Moon from '~icons/lucide/moon'
import Sun from '~icons/lucide/sun'
import { isDark, toggleDark } from '../composables'
import Button from './button.vue'
</script>

<template>
  <Button @click="toggleDark">
    <component :is="isDark ? Moon : Sun" />
  </Button>
</template>
