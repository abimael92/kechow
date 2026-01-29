<script setup lang="ts">
defineEmits<{ (e: 'click'): void }>();
</script>

<template>
  <button
    type="button"
    class="button btn-press focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus:outline-none"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
