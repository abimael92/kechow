<template>
	<!-- Footer: flex/grid, scroll-safe, touch targets, dark contrast -->
	<footer
		class="bg-[#1B1333] px-4 sm:px-6 md:px-8 py-6 border-t border-white/10 text-sm text-white/80 dark:bg-gray-900 dark:text-gray-200 overflow-auto"
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
						class="text-base sm:text-lg font-semibold text-white hover:text-[#ec4899] dark:text-white dark:hover:text-accent"
						>Comida Deliciosa, Entrega Rápida</span
					>
				</div>

				<p
					class="opacity-80 max-w-xs mt-2 transition-colors duration-200 text-[rgb(106,100,236)] hover:text-[#ec4899] hover:opacity-100 dark:text-gray-300 dark:hover:text-accent text-xs sm:text-sm"
				>
					Pide a tus restaurantes favoritos y recibe comida fresca y caliente en la puerta de tu casa en minutos.
				</p>
			</div>

			<!-- Links: touch-friendly min height -->
			<div class="flex flex-col items-center text-center min-w-0">
				<h5 class="text-white dark:text-white font-semibold mb-2 text-sm sm:text-base">
					Explorar
				</h5>
				<div
					class="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-0 text-xs sm:text-sm"
				>
					<a href="#" class="flex items-center justify-center min-h-[44px] hover:underline dark:text-gray-200">Sobre nosotros</a>
					<a href="#" class="flex items-center justify-center min-h-[44px] hover:underline dark:text-gray-200">Carreras</a>
					<a href="#" class="flex items-center justify-center min-h-[44px] hover:underline dark:text-gray-200">Términos</a>
					<a href="#" class="flex items-center justify-center min-h-[44px] hover:underline dark:text-gray-200">Privacidad</a>
				</div>
			</div>

			<!-- Social Icons: 44px tap targets -->
			<div class="flex flex-col items-center text-center min-w-0">
				<h5 class="text-white dark:text-white font-semibold mb-2 text-sm sm:text-base">
					Conecta
				</h5>
				<div class="flex gap-2 sm:gap-4 text-lg sm:text-xl">
					<a
						href="mailto:support@kechow.com"
						aria-label="Correo"
						class="flex items-center justify-center min-h-[44px] min-w-[44px] hover:text-accent dark:text-gray-200 dark:hover:text-accent"
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
			class="mt-5 text-center text-sm sm:text-base opacity-90 border-t border-white/10 pt-4 dark:text-gray-300"
		>
			© 2025
			<span class="font-semibold text-white dark:text-white">Comida Deliciosa, Entrega Rápida</span
			>. Todos los derechos reservados.
		</div>
	</footer>
</template>
