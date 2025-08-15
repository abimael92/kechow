<template>
	<MenuItemsList :items="menuItems" />
</template>

<script setup lang="ts">
import MenuItemsList from '@/features/business-owner/components/MenuManagement.vue';

const menuItems = [
	{ id: 1, name: 'Burger', price: 9.99 },
	{ id: 2, name: 'Pizza', price: 12.5 },
];
</script>
dsgdghdfh
