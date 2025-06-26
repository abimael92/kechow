<template>
	<button
		@click="toggleLanguage"
		class="uppercase text-xs font-semibold px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/30 focus:outline-none focus:ring focus:ring-white/20 focus:ring-offset-0"
	>
		{{ locale === 'en-US' ? 'ESP' : 'ENG' }}
	</button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

function toggleLanguage() {
	locale.value = locale.value === 'en-US' ? 'es-ES' : 'en-US';
}
</script>
