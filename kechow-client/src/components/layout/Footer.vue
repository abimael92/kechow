<template>
	<!-- Footer: old layout — logo + tagline, two columns (Explorar | Contacto + Conecta), titles centered -->
	<footer
		class="bg-nav border-t border-primary-200/80 px-4 sm:px-6 md:px-8 py-6 text-sm text-secondary-800 overflow-auto dark:bg-secondary-900 dark:border-secondary-700 dark:text-white/90"
	>
		<div class="flex flex-col md:flex-row justify-between lg:justify-evenly items-center md:items-start text-center gap-6 sm:gap-8 md:gap-4 lg:gap-0 px-2 md:px-4 lg:px-12">
			<!-- Logo + Message (old style) -->
			<div class="flex flex-col items-center text-center mb-4 md:mb-0 min-w-0">
				<div class="flex items-center gap-2 mb-2">
					<img
						src="/images/kechow_logo.png"
						alt="Comida Deliciosa, Entrega Rápida"
						class="w-14 h-14 object-contain flex-shrink-0"
					/>
					<span class="text-lg sm:text-xl font-bold text-primary-800 dark:text-white hover:text-primary-500 dark:hover:text-primary-400">
						Comida Deliciosa, Entrega Rápida
					</span>
				</div>
				<p class="opacity-90 max-w-xs mt-2 transition-colors duration-200 text-primary-300 dark:text-primary-300 hover:text-primary-500 text-xs sm:text-sm">
					Pide a tus restaurantes favoritos y recibe comida fresca y caliente en la puerta de tu casa en minutos.
				</p>
			</div>

			<!-- Explorar: all enlaces in double column, title centered -->
			<div class="flex flex-col items-center text-center min-w-0">
				<h5 class="text-primary-900 text-2xl dark:text-white font-semibold mb-2 sm:text-3xl w-full">
					Explorar
				</h5>
				<div class="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-0 text-xs sm:text-sm">
					<router-link to="/" class="flex items-center justify-center min-h-[44px] hover:underline text-primary-700 dark:text-white/90 hover:text-primary-500 dark:hover:text-white">Inicio</router-link>
					<router-link to="/restaurants" class="flex items-center justify-center min-h-[44px] hover:underline text-primary-700 dark:text-white/90 hover:text-primary-500 dark:hover:text-white">Restaurantes</router-link>
					<a :href="landingHash('#how-it-works')" class="flex items-center justify-center min-h-[44px] hover:underline text-primary-700 dark:text-white/90 hover:text-primary-500 dark:hover:text-white">Cómo funciona</a>
					<a :href="landingHash('#testimonials')" class="flex items-center justify-center min-h-[44px] hover:underline text-primary-700 dark:text-white/90 hover:text-primary-500 dark:hover:text-white">Testimonios</a>
					<a href="#contacto" class="flex items-center justify-center min-h-[44px] hover:underline text-primary-700 dark:text-white/90 hover:text-primary-500 dark:hover:text-white">Contacto</a>
					<a href="#" class="flex items-center justify-center min-h-[44px] hover:underline text-primary-700 dark:text-white/90 hover:text-primary-500 dark:hover:text-white">Sobre nosotros</a>
					<a href="#" class="flex items-center justify-center min-h-[44px] hover:underline text-white/90 hover:text-white dark:text-primary-200">Carreras</a>
					<a href="#" class="flex items-center justify-center min-h-[44px] hover:underline text-white/90 hover:text-white dark:text-primary-200">Términos</a>
					<a href="#" class="flex items-center justify-center min-h-[44px] hover:underline text-white/90 hover:text-white dark:text-primary-200">Privacidad</a>
					<a href="#" class="flex items-center justify-center min-h-[44px] hover:underline text-white/90 hover:text-white dark:text-primary-200">FAQ</a>
				</div>
			</div>

			<!-- Contacto + Conecta (Conecta under Contacto), titles centered -->
			<div class="flex flex-col items-center text-center min-w-0">
				<h5 class="text-primary-900 text-2xl dark:text-white font-semibold mb-2 sm:text-3xl w-full">
					Contacto
				</h5>
				<div class="flex flex-col gap-1 text-primary-700 dark:text-white/90 text-xs sm:text-sm mb-4">
					<a href="tel:+526281234567" class="min-h-[44px] flex items-center justify-center hover:underline hover:text-primary-500 dark:hover:text-white">(628) 123-4567</a>
					<a href="mailto:hola@kechow.mx" class="min-h-[44px] flex items-center justify-center hover:underline hover:text-primary-500 dark:hover:text-white">hola@kechow.mx</a>
				</div>
				<h5 class="text-primary-900 text-2xl dark:text-white font-semibold mb-2 sm:text-3xl w-full">
					Conecta
				</h5>
				<div class="flex gap-2 sm:gap-4 text-lg sm:text-xl">
					<a href="mailto:hola@kechow.mx" aria-label="Correo" class="flex items-center justify-center min-h-[44px] min-w-[44px] hover:text-primary-500 dark:text-primary-200 dark:hover:text-primary-400">
						<i class="fa-solid fa-envelope"></i>
					</a>
					<a href="#" aria-label="Instagram" class="flex items-center justify-center min-h-[44px] min-w-[44px] hover:text-accent dark:text-gray-200 dark:hover:text-accent">
						<i class="fa-brands fa-instagram"></i>
					</a>
					<a href="#" aria-label="Twitter" class="flex items-center justify-center min-h-[44px] min-w-[44px] hover:text-accent dark:text-gray-200 dark:hover:text-accent">
						<i class="fa-brands fa-x-twitter"></i>
					</a>
				</div>
			</div>
		</div>

		<!-- Bottom Bar (old style) -->
		<div class="mt-5 text-center text-sm sm:text-base opacity-90 border-t border-primary-200 dark:border-primary-700 pt-4 text-primary-300 dark:text-primary-300">
			© {{ new Date().getFullYear() }}
			<span class="font-bold text-lg text-primary-900 dark:text-white">Comida Deliciosa, Entrega Rápida</span>
			. Todos los derechos reservados.
		</div>
	</footer>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
function landingHash(hash: string): string {
	return route.name === 'Landing' ? hash : `/${hash}`;
}
</script>
