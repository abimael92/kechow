<template>
	<div class="min-h-screen flex items-center justify-center">
		<div
			class="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md animate-fade-in"
		>
			<div class="flex flex-col items-center justify-center gap-2">
				<img
					src="/images/kechow_logo.png"
					alt="Kechow Logo"
					class="w-16 h-16 object-contain animate-rushIn animate-wiggle"
					role="img"
					aria-hidden="true"
					tabindex="-1"
				/>
				<h2
					class="text-3xl font-bold mb-2 text-center text-gradient-pulse text-primary"
				>
					Welcome back!
				</h2>
			</div>

			<p class="text-sm text-center text-gray-500 mb-6">
				Login to your Kechow account
			</p>

			<form
				@submit.prevent="handleLogin"
				class="space-y-6 animate-slide-up p-6 rounded-2xl max-w-md mx-auto"
			>
				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700"
						>Email</label
					>
					<div
						class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500"
					>
						<span class="px-3 text-gray-400"
							><i class="fas fa-envelope"></i
						></span>
						<input
							v-model="loginForm.email"
							type="email"
							placeholder="you@example.com"
							class="w-full p-2 outline-none text-gray-900"
							required
						/>
					</div>
				</div>

				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700"
						>Password</label
					>
					<div
						class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 relative"
					>
						<span class="px-3 text-gray-400"><i class="fas fa-lock"></i></span>
						<input
							:type="showPassword ? 'text' : 'password'"
							v-model="loginForm.password"
							placeholder="••••••••"
							class="w-full p-2 outline-none text-gray-900"
							required
						/>
						<button
							type="button"
							@click="showPassword = !showPassword"
							class="absolute right-0 text-white"
						>
							<i :class="!showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
						</button>
					</div>
				</div>

				<button
					type="submit"
					class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition hover:scale-105 transition-transform"
				>
					Login
				</button>
			</form>

			<p class="mt-6 text-sm text-center text-gray-600">
				Don't have an account?
				<router-link
					to="/register"
					class="text-indigo-600 hover:underline font-semibold"
				>
					Register here
				</router-link>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import { useRouter } from 'vue-router';

const showPassword = ref(false);
const authStore = useAuthStore();
const router = useRouter(); // Add this line to get the router instance

const loginForm = reactive({
	email: '',
	password: '',
});

async function handleLogin() {
	try {
		const response = await authStore.login({ ...loginForm });

		// Debug logging
		console.log('Login successful', response);
		console.log('User role:', authStore.user?.role);
		console.log('Token:', authStore.token);

		// Redirect based on role - using exact route names from your router
		if (authStore.isOwner) {
			await router.push({ name: 'OwnerDashboard' }); // Changed from 'owner-dashboard'
		} else {
			await router.push({ name: 'Home' }); // Changed from 'home' to match your route definition
		}
	} catch (error: unknown) {
		console.error('Login error details:', error);
		const errorMessage =
			error instanceof Error
				? error.message
				: 'Invalid credentials. Please check your email and password.';
		alert(errorMessage);
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
