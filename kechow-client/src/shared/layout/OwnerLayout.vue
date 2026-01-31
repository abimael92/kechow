<template>
	<div
		class="min-h-screen min-w-0 bg-gradient-to-br from-[#734ce8] via-[#a98dd4] via-50% to-[#6b4476] dark:from-gray-900 dark:to-gray-800 text-skin-base dark:text-skin-dark flex flex-col font-sans"
		role="application"
		aria-label="Kechow - Propietario"
	>
		<a href="#main-content" class="skip-link">Saltar al contenido principal</a>
		<Header :role="'owner'" />
		<RoleNavigation :role="'owner'" />

		<!-- Main Content: min-h-0 + overflow-auto so content scrolls inside flex child -->
		<main
			id="main-content"
			class="flex-grow min-h-0 overflow-auto px-4 py-6 sm:px-6 sm:py-8 md:px-12 lg:px-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
			tabindex="-1"
			role="main"
		>
			<router-view />
		</main>

		<Footer />
		<BottomNav :role="'owner'" />
	</div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import RoleNavigation from '@shared/layout/RoleNavigation.vue';
import BottomNav from '@shared/layout/BottomNav.vue';
</script>
