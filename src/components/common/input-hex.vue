<script setup lang="ts">
import Label from './label.vue'

const value = defineModel<string>('value', { required: true })
</script>

<template>
  <div data-color-palette="input-hex-container">
    <input
      v-model="value"
      data-color-palette="input-hex"
      type="text"
    >
    <Label>HEX</Label>
  </div>
</template>

<style>
.color-palette [data-color-palette='input-hex-container'] {
  display: flex;
  flex-direction: column;
  width: 6rem;
  flex-shrink: 0;
  align-items: center;
}

.color-palette [data-color-palette='input-hex'] {
  background-color: var(--muted);
  color: var(--foreground);
  border: none;
  outline: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  height: 2rem;
  width: 100%;
  text-align: center;
}
</style>
