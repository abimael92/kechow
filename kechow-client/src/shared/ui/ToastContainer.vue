<template>
  <Teleport to="body">
    <TransitionGroup
      name="toast"
      tag="div"
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'max-w-sm w-full p-4 rounded-lg shadow-lg pointer-events-auto flex items-start gap-3',
          toastClasses[toast.type]
        ]"
        role="alert"
      >
        <i :class="toastIcons[toast.type]" class="text-lg mt-0.5"></i>
        
        <div class="flex-1">
          <p class="text-sm font-medium">{{ toast.message }}</p>
        </div>
        
        <button
          @click="$emit('remove', toast.id)"
          class="text-current opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Cerrar"
        >
          <i class="ri-close-line text-lg"></i>
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import type { Toast } from '../../composables/useNotifications'

defineProps<{
  toasts: Toast[]
}>()

defineEmits<{
  (e: 'remove', id: string): void
}>()

const toastClasses = {
  success: 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800',
  info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
}

const toastIcons = {
  success: 'ri-checkbox-circle-line',
  error: 'ri-error-warning-line',
  warning: 'ri-alert-line',
  info: 'ri-information-line'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>