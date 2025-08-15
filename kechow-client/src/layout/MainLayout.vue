<template>
	<div
		class="min-h-screen bg-gradient-to-br from-[#734ce8] via-[#a98dd4] via-50% to-[#6b4476] dark:from-gray-900 dark:to-gray-800 text-skin-base dark:text-skin-dark flex flex-col font-sans"
		role="application"
		aria-label="Kechow Food Delivery Application"
	>
		<Header />

		<!-- Main Content -->
		<main
			class="flex-grow px-6 py-10 md:px-12 lg:px-20 animate-fadeInUp focus:outline-none"
			tabindex="-1"
			role="main"
		>
			<router-view />
		</main>

		<Footer />
	</div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
</script>
