<template>
  <label data-color-palette="label">
    <slot />
  </label>
</template>

<style>
.color-palette [data-color-palette='label'] {
  color: var(--muted-foreground);
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  white-space: nowrap;
}
</style>
