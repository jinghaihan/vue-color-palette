import type { MaybeRef } from 'vue'
import { useMutationObserver } from '@vueuse/core'
import { computed, onMounted, ref, unref, watch } from 'vue'

export function useDarkDetector(darkProp: MaybeRef<boolean | undefined>) {
  const target = ref<HTMLElement | null>()

  const isDarkProvided = computed(() => typeof unref(darkProp) === 'boolean')
  const detectedDark = ref<boolean>(false)
  const isDark = computed(() => isDarkProvided.value ? unref(darkProp)! : detectedDark.value)

  function detect() {
    detectedDark.value = document.documentElement.classList.contains('dark')
  }

  const { stop } = useMutationObserver(
    target,
    detect,
    {
      attributes: true,
      attributeFilter: ['class'],
    },
  )

  watch(isDarkProvided, () => {
    if (isDarkProvided.value)
      target.value = null
  })

  onMounted(() => {
    if (!isDarkProvided.value) {
      detect()
      target.value = document.documentElement
    }
  })

  return { isDark, isDarkProvided, stop }
}
