<script setup lang="ts">
defineEmits<{ (e: 'click'): void }>();
</script>

<template>
  <button
    type="button"
    class="btn-primary focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus:outline-none inline-flex items-center justify-center gap-2 text-center break-words min-w-0"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
