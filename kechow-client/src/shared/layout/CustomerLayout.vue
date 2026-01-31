<template>
	<div
		class="min-h-screen min-w-0 bg-gradient-to-br from-[#734ce8] via-[#a98dd4] via-50% to-[#6b4476] dark:from-gray-900 dark:to-gray-800 text-skin-base dark:text-skin-dark flex flex-col font-sans"
		role="application"
		aria-label="Kechow - Cliente"
	>
		<a href="#main-content" class="skip-link">Saltar al contenido principal</a>
		<Header />
		<RoleNavigation :role="'customer'" />

		<!-- Main Content: min-h-0 + overflow-auto so content scrolls inside flex child -->
		<main
			id="main-content"
			class="flex-grow min-h-0 overflow-auto px-4 py-6 sm:px-6 sm:py-8 md:px-12 lg:px-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
			tabindex="-1"
			role="main"
		>
			<router-view v-slot="{ Component }">
				<Transition name="page" mode="out-in">
					<component
						v-if="Component"
						:is="Component"
						:key="route.path"
					/>
					<div
						v-else
						key="loading"
						class="flex items-center justify-center min-h-[200px] text-gray-500 dark:text-gray-400"
					>
						Cargando...
					</div>
				</Transition>
			</router-view>
		</main>

		<Footer />
	</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import RoleNavigation from '@shared/layout/RoleNavigation.vue';

const route = useRoute();
</script>
