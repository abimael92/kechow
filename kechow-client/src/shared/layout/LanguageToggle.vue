<template>
	<!-- Use same style as Profile/Logout buttons -->
	<button
		@click="toggleLanguage"
		class="flex items-center w-full px-3 py-2 text-left rounded-lg hover:bg-white/10 transition-colors"
	>
		{{ currentLocale === 'en-US' ? 'ESP' : 'ENG' }}
	</button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { isRef, ref, unref } from 'vue';

const { locale } = useI18n();
const currentLocale = isRef(locale) ? locale : ref(locale);

function toggleLanguage() {
	currentLocale.value = unref(currentLocale) === 'en-US' ? 'es-ES' : 'en-US';
	if (!isRef(locale)) {
		// @ts-ignore
		locale = currentLocale.value;
	}
}
</script>
