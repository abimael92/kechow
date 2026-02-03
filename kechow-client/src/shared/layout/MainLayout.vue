<template>
	<div
		class="min-h-screen min-w-0 bg-gradient-to-br from-primary-50 via-primary-100/40 to-primary-200/50 dark:from-gray-900 dark:to-gray-800 text-secondary-900 dark:text-secondary-100 flex flex-col font-sans"
		role="application"
		aria-label="Kechow Food Delivery Application"
	>
		<a href="#main-content" class="skip-link">Saltar al contenido principal</a>
		<Header />
		<RoleNavbar />

		<!-- Main Content: min-h-0 + overflow-auto so content scrolls inside flex child -->
		<main
			id="main-content"
			class="flex-grow min-h-0 overflow-auto px-4 py-6 sm:px-6 sm:py-8 md:px-12 lg:px-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
			tabindex="-1"
			role="main"
		>
			<router-view v-slot="{ Component }">
				<Transition name="page" mode="out-in">
					<component :is="Component" />
				</Transition>
			</router-view>
		</main>

		<Footer />
	</div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import RoleNavbar from '@/components/layout/RoleNavbar.vue';
</script>
