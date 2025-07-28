<template>
	<div class="min-h-screen flex items-center justify-center">
		<div
			class="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg animate-fade-in"
		>
			<div class="flex flex-col items-center justify-center gap-2">
				<h2
					class="text-2xl font-bold mb-2 text-center text-gradient-pulse text-primary"
				>
					Create your Kechow account
				</h2>
			</div>

			<p class="text-sm text-center text-gray-500 mb-6">
				Join Kechow <br />
				Get food fast, fresh, and right to your door.
			</p>

			<form
				@submit.prevent="handleRegister"
				class="space-y-6 animate-slide-up p-6 rounded-2xl max-w-md mx-auto"
			>
				<!-- Name -->
				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700"
						>Name</label
					>
					<div
						class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500"
					>
						<span class="px-3 text-gray-400"><i class="fas fa-user"></i></span>
						<input
							v-model="registerForm.name"
							type="text"
							placeholder="Your name"
							class="w-full p-2 outline-none"
							required
						/>
					</div>
				</div>

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
							v-model="registerForm.email"
							type="email"
							placeholder="you@example.com"
							class="w-full p-2 outline-none"
							required
						/>
					</div>
				</div>

				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700"
						>Password</label
					>
					<div
						class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500"
					>
						<span class="px-3 text-gray-400"><i class="fas fa-lock"></i></span>
						<input
							v-model="registerForm.password"
							type="password"
							placeholder="••••••••"
							class="w-full p-2 outline-none"
							required
						/>
					</div>
				</div>

				<div>
					<label class="block mb-1 text-sm font-medium text-gray-700"
						>Confirm Password</label
					>
					<div
						class="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500"
					>
						<span class="px-3 text-gray-400"><i class="fas fa-lock"></i></span>
						<input
							v-model="registerForm.password_confirmation"
							type="password"
							placeholder="••••••••"
							class="w-full p-2 outline-none"
							required
						/>
					</div>
				</div>

				<button
					type="submit"
					class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition hover:scale-105 transition-transform active:scale-95 shadow-md"
				>
					Register
				</button>
			</form>

			<p class="mt-6 text-sm text-center text-gray-600">
				Already have an account?
				<router-link
					to="/login"
					class="text-indigo-600 hover:underline font-semibold"
				>
					Login here
				</router-link>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAuthStore } from '@/features/auth/auth.store';

const authStore = useAuthStore();

const registerForm = reactive({
	name: '',
	email: '',
	password: '',
	password_confirmation: '',
});

async function handleRegister() {
	try {
		await authStore.register({
			name: registerForm.name,
			email: registerForm.email,
			password: registerForm.password,
		});
	} catch (error) {
		alert('Registration failed.');
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

@keyframes slide-up {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
.animate-slide-up {
	animation: slide-up 0.6s ease-out;
}
</style>
