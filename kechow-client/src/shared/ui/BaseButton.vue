<script setup lang="ts">
defineEmits<{ (e: 'click'): void }>();
</script>

<template>
  <button
    type="button"
    class="button btn-press min-h-[44px] min-w-[44px] px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus:outline-none inline-flex items-center justify-center gap-2 text-center break-words"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
