<template>
	<section
		class="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8 fade-in-up text-black dark:text-white"
	>
		<h1
			class="text-5xl sm:text-6xl drop-shadow-lg font-semibold text-black dark:text-white"
		>
			{{ $t('kechowFoodDelivery') }}
		</h1>

		<p class="text-xl max-w-lg opacity-90 text-black dark:text-white/80">
			{{ $t('yourLocalFoodDeliveryIsCooking') }}
		</p>

		<p
			class="text-lg max-w-md opacity-80 underline underline-offset-4 decoration-accent text-black dark:text-white/70"
		>
			{{ $t('comingSoonDescription') }}
		</p>

		<BaseButton @click="goHome" class="btn">{{ $t('getStarted') }}</BaseButton>
	</section>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function goHome() {
	router.push('/home');
}
</script>
