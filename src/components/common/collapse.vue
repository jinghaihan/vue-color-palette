<script setup lang="ts">
import { ref } from 'vue'
import Button from './button.vue'
import { Icon } from './icons'
import Label from './label.vue'

const props = withDefaults(defineProps<{
  title?: string
  defaultCollapsed?: boolean
}>(), {
  title: '',
  defaultCollapsed: false,
})

const collapsed = ref<boolean>(props.defaultCollapsed)

function toggleCollapse() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div data-color-palette="collapse">
    <div data-color-palette="collapse-header">
      <Label v-if="title">{{ title }}</Label>

      <div data-color-palette="collapse-header-actions">
        <slot name="actions" />
        <Button :data-collapsed="collapsed" @click="toggleCollapse">
          <Icon.ChevronDown />
        </Button>
      </div>
    </div>
    <div v-if="!collapsed" data-color-palette="collapse-content">
      <slot />
    </div>
  </div>
</template>

<style>
.color-palette [data-color-palette='collapse'] {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.color-palette [data-color-palette='collapse-header'] {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.color-palette [data-color-palette='collapse-header'] [data-collapsed='true'] {
  transform: rotate(180deg);
  transition-duration: var(--default-transition-duration);
}

.color-palette [data-color-palette='collapse-header-actions'] {
  display: flex;
  align-items: center;
}
</style>
