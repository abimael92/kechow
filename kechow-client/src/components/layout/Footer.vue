<template>
	<!-- Footer -->
	<footer
		class="bg-[#1B1333] px-4 sm:px-6 md:px-8 py-6 border-t border-white/10 text-sm text-white/80 dark:bg-[your-dark-bg-color] dark:text-[your-dark-text-color]"
	>
		<div
			class="flex flex-col md:flex-row justify-between lg:justify-evenly items-center md:items-start text-center gap-8 md:gap-4 lg:gap-0 px-2 md:px-4 lg:px-12"
		>
			<!-- Logo + Message -->
			<div
				class="flex flex-col items-center text-center mb-4 md:mb-0 cursor-pointer"
			>
				<div class="flex items-center gap-2 mb-2">
					<img
						src="/images/kechow_logo.png"
						:alt="$t('kechowFoodDelivery')"
						class="w-8 h-8 object-contain"
					/>
					<span
						class="text-base sm:text-lg font-semibold text-white hover:text-[#ec4899] dark:hover:text-accent"
						>{{ $t('kechowFoodDelivery') }}</span
					>
				</div>

				<p
					class="opacity-80 max-w-xs mt-2 transition-colors duration-200 text-[rgb(106,100,236)] hover:text-[#ec4899] hover:opacity-100 dark:text-primary dark:hover:text-accent text-xs sm:text-sm"
				>
					{{ $t('yourLocalFoodDeliveryIsCooking') }}
				</p>
			</div>

			<!-- Links -->
			<div class="flex flex-col items-center text-center">
				<h5 class="text-white font-semibold mb-2 text-sm sm:text-base">
					{{ $t('explore') }}
				</h5>
				<div
					class="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1 text-xs sm:text-sm"
				>
					<a href="#" class="hover:underline">{{ $t('aboutUs') }}</a>
					<a href="#" class="hover:underline">{{ $t('careers') }}</a>
					<a href="#" class="hover:underline">{{ $t('terms') }}</a>
					<a href="#" class="hover:underline">{{ $t('privacy') }}</a>
				</div>
			</div>

			<!-- Social Icons -->
			<div class="flex flex-col items-center text-center">
				<h5 class="text-white font-semibold mb-2 text-sm sm:text-base">
					{{ $t('connect') }}
				</h5>
				<div class="flex gap-3 sm:gap-4 text-lg sm:text-xl">
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
			class="mt-5 text-center text-sm sm:text-md opacity-90 border-t border-white/10 pt-4"
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
