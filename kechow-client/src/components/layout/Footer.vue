<template>
	<!-- Footer -->
	<footer
		class="bg-[#1B1333] px-8 py-6 border-t border-white/10 text-sm text-white/80 dark:bg-[your-dark-bg-color] dark:text-[your-dark-text-color]"
	>
		<div
			class="flex flex-col md:flex-row justify-evenly items-start text-center gap-10 md:gap-0 px-4 md:px-12"
		>
			<!-- Logo + Message -->
			<div class="flex flex-col items-center text-center mb-4 cursor-pointer">
				<div class="flex items-center gap-2 mb-2">
					<img
						src="/images/kechow_logo.png"
						:alt="$t('kechowFoodDelivery')"
						class="w-8 h-8 object-contain"
					/>
					<span
						class="text-lg font-semibold text-white hover:text-[#ec4899] dark:hover:text-accent"
						>{{ $t('kechowFoodDelivery') }}</span
					>
				</div>

				<p
					class="opacity-80 max-w-xs mt-2 transition-colors duration-200 text-[rgb(106,100,236)] hover:text-[#ec4899] hover:opacity-100 dark:text-primary dark:hover:text-accent"
				>
					{{ $t('yourLocalFoodDeliveryIsCooking') }}
				</p>
			</div>

			<!-- Links -->
			<div class="flex flex-col items-center text-center">
				<h5 class="text-white font-semibold mb-2">{{ $t('explore') }}</h5>
				<div class="grid grid-cols-2 gap-x-6 gap-y-1">
					<a href="#" class="hover:underline">{{ $t('aboutUs') }}</a>
					<a href="#" class="hover:underline">{{ $t('careers') }}</a>
					<a href="#" class="hover:underline">{{ $t('terms') }}</a>
					<a href="#" class="hover:underline">{{ $t('privacy') }}</a>
				</div>
			</div>

			<!-- Social Icons -->
			<div>
				<h5 class="text-white font-semibold mb-2">{{ $t('connect') }}</h5>
				<div class="flex gap-4 text-xl">
					<a
						href="mailto:support@kechow.com"
						aria-label="Email"
						class="hover:text-accent"
					>
						<i class="fa-solid fa-envelope"></i>
					</a>
					<a href="#" aria-label="Instagram" class="hover:text-accent">
						<i class="fa-brands fa-instagram"></i>
					</a>
					<a href="#" aria-label="Twitter" class="hover:text-accent">
						<i class="fa-brands fa-x-twitter"></i>
					</a>
				</div>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div
			class="mt-5 text-center text-md opacity-90 border-t border-white/10 pt-4"
		>
			© 2025
			<span class="font-semibold text-white">{{
				$t('kechowFoodDelivery')
			}}</span
			>. {{ $t('allRightsReserved') }}
		</div>
	</footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
