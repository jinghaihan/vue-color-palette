<script setup lang="ts">
import GitHub from '~icons/lucide/github'
import { homepage } from '../../../package.json'
import Button from './button.vue'

function openGitHub() {
  window.open(homepage, '_blank')
}
</script>

<template>
  <Button @click="openGitHub">
    <GitHub />
  </Button>
</template>
