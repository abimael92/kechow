<script setup lang="ts">
const emit = defineEmits(['click'])
</script>

<template>
  <button class="button" @click="$emit('click')">
    <slot />
  </button>
</template>
