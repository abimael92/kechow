<template>
	<!-- Footer: flex/grid, scroll-safe, touch targets, dark contrast -->
	<footer
		class="bg-primary-900/45 border-t border-primary-200/80 px-4 sm:px-6 md:px-8 py-6 text-sm text-secondary-800 overflow-auto dark:bg-nav dark:from-transparent dark:via-transparent dark:to-transparent dark:border-secondary-700 dark:text-white/90"
	>
		<div
			class="flex flex-col md:flex-row justify-between lg:justify-evenly items-center md:items-start text-center gap-6 sm:gap-8 md:gap-4 lg:gap-0 px-2 md:px-4 lg:px-12"
		>
			<!-- Logo + Message -->
			<div
				class="flex flex-col items-center text-center mb-4 md:mb-0 cursor-pointer min-w-0"
			>
				<div class="flex items-center gap-2 mb-2">
					<img
						src="/images/kechow_logo.png"
						alt="Comida Deliciosa, Entrega Rápida"
						class="w-8 h-8 object-contain flex-shrink-0"
					/>
					<span
						class="text-base sm:text-lg font-semibold text-secondary-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400"
						>Comida Deliciosa, Entrega Rápida</span
					>
				</div>

				<p
					class="opacity-90 max-w-xs mt-2 transition-colors duration-200 text-secondary-600 dark:text-secondary-300 hover:text-primary-500 text-xs sm:text-sm"
				>
					Pide a tus restaurantes favoritos y recibe comida fresca y caliente en la puerta de tu casa en minutos.
				</p>
			</div>

			<!-- Links: touch-friendly min height -->
			<div class="flex flex-col items-center text-center min-w-0">
				<h5 class="text-secondary-900 dark:text-white font-semibold mb-2 text-sm sm:text-base">
					Explorar
				</h5>
				<div
					class="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-0 text-xs sm:text-sm"
				>
					<a href="#" class="flex items-center justify-center min-h-[44px] hover:underline text-secondary-700 dark:text-white/90 hover:text-primary-500 dark:hover:text-white">Sobre nosotros</a>
					<a href="#" class="flex items-center justify-center min-h-[44px] hover:underline text-white/90 hover:text-white dark:text-secondary-200">Carreras</a>
					<a href="#" class="flex items-center justify-center min-h-[44px] hover:underline text-white/90 hover:text-white dark:text-secondary-200">Términos</a>
					<a href="#" class="flex items-center justify-center min-h-[44px] hover:underline text-white/90 hover:text-white dark:text-secondary-200">Privacidad</a>
				</div>
			</div>

			<!-- Social Icons: 44px tap targets -->
			<div class="flex flex-col items-center text-center min-w-0">
				<h5 class="text-secondary-900 dark:text-white font-semibold mb-2 text-sm sm:text-base">
					Conecta
				</h5>
				<div class="flex gap-2 sm:gap-4 text-lg sm:text-xl">
					<a
						href="mailto:support@kechow.com"
						aria-label="Correo"
						class="flex items-center justify-center min-h-[44px] min-w-[44px] hover:text-primary-500 dark:text-secondary-200 dark:hover:text-primary-400"
					>
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

		<!-- Bottom Bar -->
		<div
			class="mt-5 text-center text-sm sm:text-base opacity-90 border-t border-secondary-200 dark:border-secondary-700 pt-4 text-secondary-600 dark:text-secondary-300"
		>
			© 2025
			<span class="font-semibold text-secondary-900 dark:text-white">Comida Deliciosa, Entrega Rápida</span
			>. Todos los derechos reservados.
		</div>
	</footer>
</template>
