<template>
	<div
		class="min-h-screen bg-gradient-to-br from-[#734ce8] via-[#a98dd4] via-50% to-[#6b4476] dark:from-gray-900 dark:to-gray-800 text-skin-base dark:text-skin-dark flex flex-col font-sans"
		role="application"
		aria-label="Kechow Food Delivery Application"
	>
		<a href="#main-content" class="skip-link">{{ $t('skipToContent') || 'Skip to main content' }}</a>
		<Header />
		<RoleNavbar />

		<!-- Main Content -->
		<main
			id="main-content"
			class="flex-grow px-6 py-10 md:px-12 lg:px-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
			tabindex="-1"
			role="main"
		>
			<Transition name="page" mode="out-in">
				<router-view />
			</Transition>
		</main>

		<Footer />
	</div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
</script>
