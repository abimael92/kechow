<template>
	<!-- Language Toggle -->
	<div class="flex items-center justify-center w-full">
		<button
			@click="toggleLanguage"
			class="flex items-center justify-center min-h-[44px] min-w-[44px] gap-2 px-4 py-2 rounded-button bg-nav text-white/90 hover:bg-white/10 hover:text-white transition-colors duration-200 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700"
		>
			<i class="fa-solid fa-globe"></i>
			<span class="font-semibold text-sm sm:text-base">
				Idioma
			</span>
		</button>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';

// ✅ matches your i18n config
const { t, locale } = useI18n();
const currentLocale = ref(locale.value);

// Toggle between "en" and "es"
function toggleLanguage() {
	currentLocale.value = currentLocale.value === 'es' ? 'en' : 'es';
	locale.value = currentLocale.value;
}

// Keep locale synced if changed elsewhere
watch(locale, (newVal) => {
	currentLocale.value = newVal;
});
</script>

<style scoped>
button {
	@apply cursor-pointer select-none;
}
</style>
