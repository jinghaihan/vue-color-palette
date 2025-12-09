<template>
  <button data-color-palette="button">
    <slot />
  </button>
</template>

<style>
.color-palette [data-color-palette='button'] {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  padding: 0.25rem;
  background-color: transparent;
  color: var(--muted-foreground);
  transition-duration: var(--default-transition-duration);
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.color-palette [data-color-palette='button']:hover {
  background-color: var(--muted);
  color: var(--foreground);
}
</style>
