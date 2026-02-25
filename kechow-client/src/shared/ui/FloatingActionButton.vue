<template>
  <Teleport to="body">
    <Transition name="fab">
      <button
        v-if="show"
        :class="[
          'fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 z-40',
          variantClasses[variant]
        ]"
        :aria-label="ariaLabel"
        @click="$emit('click')"
      >
        <i 
          :class="[icon, { 'animate-spin': loading }]" 
          class="text-xl"
        ></i>
      </button>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  show?: boolean
  icon: string
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  ariaLabel?: string
}>(), {
  show: true,
  variant: 'primary'
})

defineEmits<{
  (e: 'click'): void
}>()

const variantClasses = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600',
  secondary: 'bg-gray-500 text-white hover:bg-gray-600',
  success: 'bg-green-500 text-white hover:bg-green-600',
  danger: 'bg-red-500 text-white hover:bg-red-600'
}
</script>

<style scoped>
.fab-enter-active,
.fab-leave-active {
  transition: all 0.3s ease;
}

.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>