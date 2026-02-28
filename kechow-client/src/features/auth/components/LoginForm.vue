<template>
	<div class="min-h-screen flex flex-col items-center justify-center min-w-0 overflow-x-hidden px-4 py-4 md:py-6 lg:py-8 relative">
		<!-- Light/Dark toggle - top right, hidden on mobile (use burger menu) -->
		<!-- <button
			@click="toggleDarkMode"
			class="hidden lg:flex absolute top-4 right-4 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors"
			aria-label="Cambiar tema claro/oscuro"
		>
			<svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3a9 9 0 009 9 9 9 0 11-9-9z" />
			</svg>
			<svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m8.485-8.485h-1M4.515 12.515h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
			</svg>
		</button> -->

		<div
			class="bg-card dark:bg-gray-800 rounded-2xl border-l-4 border-secondary-300 shadow-lg p-6 sm:p-10 w-full max-w-md animate-fade-in min-w-0 border border-primary-300/50 dark:border-gray-700"
		>
			<div class="flex flex-col items-center justify-center gap-2">
				<img
					src="/images/kechow_logo.png"
					alt="Kechow Logo"
					class="w-24 h-24 object-contain animate-rushIn animate-wiggle"
					role="img"
					aria-hidden="true"
					tabindex="-1"
				/>
				<h2
					class="text-4xl sm:text-5xl font-bold mb-2 text-center font-chewy text-primary-500 dark:text-primary-400"
				>
					¡Bienvenido de nuevo!
				</h2>
			</div>

			<p class="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
				Inicia sesión en tu cuenta de Kechow
			</p>

			<form
				@submit.prevent="handleLogin"
				class="space-y-6 animate-slide-up p-0 sm:p-6 rounded-2xl max-w-md mx-auto w-full min-w-0"
			>
				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</label>
					<div
						class="flex items-center border border-primary-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 bg-white dark:bg-gray-700"
					>
						<span class="pl-3 pr-2 text-gray-500 dark:text-gray-400"><i class="ri-mail-line text-base"></i></span>
						<input
							v-model="loginForm.email"
							type="email"
							placeholder="tu@ejemplo.com"
							class="w-full py-2.5 pl-1 outline-none text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
							required
						/>
					</div>
				</div>

				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
					<div
						class="flex items-center border border-primary-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 relative bg-white dark:bg-gray-700"
					>
						<span class="pl-3 pr-2 text-gray-500 dark:text-gray-400"><i class="ri-lock-line text-base"></i></span>
						<input
							:type="showPassword ? 'text' : 'password'"
							v-model="loginForm.password"
							placeholder="••••••••"
							class="w-full py-2.5 pr-12 pl-1 outline-none text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
							required
						/>
						<button
							type="button"
							@click="showPassword = !showPassword"
							class="absolute rounded-r-xl border-l-2 border-secondary-300 bg-white right-0 top-0 bottom-0 flex items-center justify-center w-12 min-w-[44px] min-h-[44px] text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-600/50 dark:bg-gray-600/30
							active:bg-primary-100 dark:active:bg-gray-600 transition-colors"
							:aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
						>
							<i :class="showPassword ? 'ri-eye-line text-xl' : 'ri-eye-off-line text-xl'"></i>
						</button>
					</div>
				</div>

				<button
					type="submit"
					class="w-full bg-primary-500 hover:bg-primary-600 text-white py-2.5 rounded-lg font-semibold transition hover:scale-[1.02] active:scale-[0.98] shadow-md"
				>
					Iniciar sesión
				</button>
			</form>

			<p class="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
				¿No tienes una cuenta?
				<router-link
					to="/register"
					class="text-primary-500 dark:text-primary-400 hover:underline font-semibold"
				>
					Regístrate aquí
				</router-link>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import { useToast } from 'vue-toastification';
import { useDarkMode } from '@/shared/composables/useDarkMode';

const toast = useToast();
const showPassword = ref(false);
const authStore = useAuthStore();
const { isDark, toggleDarkMode } = useDarkMode();

const loginForm = reactive({
	email: '',
	password: '',
});

async function handleLogin() {
	try {
		await authStore.login({ ...loginForm });
		toast.success('Inicio de sesión exitoso');
		// Redirect is handled by auth store redirectByRole() (supports admin, owner, delivery, customer).
	} catch (error: unknown) {
		console.error('Login error details:', error);
		toast.error('Credenciales inválidas. Verifica tu correo y contraseña.');
	}
}
</script>

<style scoped>
@keyframes fade-in {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
.animate-fade-in {
	animation: fade-in 0.5s ease-out;
}

@keyframes rushIn {
	0% {
		opacity: 0;
		transform: translateY(-20px) scale(0.9) rotate(-2deg);
	}
	100% {
		opacity: 1;
		transform: translateY(0) scale(1) rotate(0deg);
	}
}

.animate-rushIn {
	animation: rushIn 1s ease forwards;
}

@keyframes wiggle {
	0%,
	20%,
	100% {
		transform: rotate(0deg);
	}
	5%,
	15% {
		transform: rotate(5deg);
	}
	10% {
		transform: rotate(-5deg);
	}
	12%,
	18% {
		transform: rotate(3deg);
	}
}

.animate-wiggle {
	animation: wiggle 2.5s ease-in-out infinite;
	animation-delay: 1.2s; /* after rushIn */
}

@keyframes pulseScaleMinimal {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.25);
	}
}

.text-gradient-pulse {
	animation: pulseScaleMinimal 2.5s ease-in-out infinite;
}
</style>
