<template>
	<div
		class="min-h-screen flex flex-col justify-between px-8 py-12 text-text-primary bg-gradient-to-br from-gradient-start to-gradient-end"
	>
		<header class="absolute top-4 right-4 z-50">
			<button
				@click="toggleLanguage"
				class="uppercase text-xs font-semibold px-3 py-1 border border-white rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition"
			>
				{{ locale === 'en-US' ? 'ESP' : 'ENG' }}
			</button>
		</header>

		<main class="p-4">
			<router-view />
			<!-- THIS renders Landing/Home -->
		</main>

		<footer
			class="text-center text-sm opacity-60 select-none mt-12 text-text-secondary"
		>
			© 2025 Kechow. All rights reserved.
		</footer>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

function toggleLanguage() {
	locale.value = locale.value === 'en-US' ? 'es-ES' : 'en-US';
}
</script>
