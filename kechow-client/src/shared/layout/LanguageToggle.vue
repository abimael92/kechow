<template>
	<!-- Language Toggle -->
	<div class="flex items-center justify-center w-full">
		<button
			@click="toggleLanguage"
			class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1B1333] text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200"
		>
			<i class="fa-solid fa-globe"></i>
			<span class="font-semibold text-sm sm:text-base">
				{{ currentLocale === 'en' ? 'Español' : 'English' }}
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
