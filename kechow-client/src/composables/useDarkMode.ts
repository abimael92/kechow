// composables/useDarkMode.ts
import { ref, watchEffect } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  const html = document.documentElement

  const updateClass = () => {
    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  watchEffect(updateClass)

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggleDarkMode,
  }
}
