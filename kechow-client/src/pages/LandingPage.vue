<template>
	<section
		class="max-w-4xl mx-auto flex flex-col items-center text-center space-y-12 fade-in-up text-black dark:text-white px-6 py-24 min-h-[75vh] relative overflow-hidden"
	>
		<!-- Delivery-themed animated background (black) -->
		<div
			class="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center"
		>
			<!-- Bigger delivery route circle -->
			<div
				class="relative w-[80vmin] h-[80vmin] border-4 border-dashed border-black rounded-full animate-spin-slow opacity-30 flex items-center justify-center"
			>
				<!-- Floating package -->
				<div
					class="absolute w-6 h-6 bg-black rotate-12 rounded-sm animate-float1"
					style="top: 15%; left: 50%; transform: translateX(-50%)"
				></div>

				<!-- Floating pin -->
				<div
					class="absolute w-5 h-5 bg-black rounded-full animate-float2"
					style="bottom: 15%; left: 50%; transform: translateX(-50%)"
				></div>

				<!-- Location SVG -->
				<svg
					class="absolute w-8 h-8 text-black animate-float3"
					style="top: 48%; left: 22%; transform: translate(-50%, -50%)"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1114.5 9 2.5 2.5 0 0112 11.5z"
					/>
				</svg>

				<!-- Scooter / Delivery Bike -->
				<svg
					class="absolute w-10 h-10 text-black animate-float4"
					style="top: 18%; right: 28%; transform: translate(50%, -50%)"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path d="M5 13h2l3-6 4 0"></path>
					<circle cx="7" cy="19" r="2"></circle>
					<circle cx="17" cy="19" r="2"></circle>
					<path d="M10 10h6v4H10z"></path>
				</svg>

				<!-- Clock / Timer -->
				<svg
					class="absolute w-8 h-8 text-black animate-float5"
					style="bottom: 28%; left: 18%; transform: translate(-50%, 50%)"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<path d="M12 6v6l4 2"></path>
				</svg>

				<!-- Shopping Bag -->
				<svg
					class="absolute w-8 h-8 text-black animate-float6"
					style="top: 38%; left: 63%; transform: translate(-50%, -50%)"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path d="M6 2h12l-1 7H7l-1-7z"></path>
					<path d="M6 9v13h12V9"></path>
					<path d="M9 13h6"></path>
				</svg>

				<!-- Fork & Knife -->
				<svg
					class="absolute w-8 h-8 text-black animate-float7"
					style="bottom: 34%; right: 15%; transform: translate(50%, 50%)"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path d="M7 3v18"></path>
					<path d="M17 3l-5 7v7"></path>
				</svg>

				<!-- Hot Drink / Coffee Cup -->
				<svg
					class="absolute w-8 h-8 text-black animate-float8"
					style="top: 62%; right: 33%; transform: translate(50%, -50%)"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path d="M8 21h8a4 4 0 0 0 0-8H8v8z" />
					<path d="M12 13v-3" />
					<path d="M16 6a4 4 0 0 0-8 0" />
				</svg>

				<!-- Shopping Cart -->
				<svg
					class="absolute w-8 h-8 text-black animate-float9"
					style="top: 18%; right: 12%; transform: translate(50%, -50%)"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<circle cx="9" cy="21" r="1"></circle>
					<circle cx="20" cy="21" r="1"></circle>
					<path
						d="M1 1h4l2.68 13.39a1 1 0 0 0 1 .61h9a1 1 0 0 0 1-.76l1.38-7.59H6"
					></path>
				</svg>

				<!-- Box with Arrow (Shipping Box) -->
				<svg
					class="absolute w-8 h-8 text-black animate-float10"
					style="bottom: 15%; left: 40%; transform: translate(-50%, 50%)"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path d="M3 9l9 6 9-6"></path>
					<path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"></path>
					<path d="M9 22V9"></path>
				</svg>

				<!-- Heart / Like -->
				<svg
					class="absolute w-8 h-8 text-black animate-float11"
					style="top: 28%; left: 43%; transform: translate(-50%, -50%)"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						d="M12 21s-8-4.5-8-11a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 6.5-8 11-8 11z"
					/>
				</svg>

				<!-- Star (Rating) -->
				<svg
					class="absolute w-8 h-8 text-black animate-float12"
					style="bottom: 27%; right: 63%; transform: translate(50%, 50%)"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
					/>
				</svg>
			</div>
		</div>

		<!-- Actual content (z-10 to stay on top) -->
		<div
			class="z-10 relative flex flex-col items-center text-center space-y-8 max-w-xl mx-auto"
		>
			<h1
				class="text-5xl sm:text-6xl font-extrabold drop-shadow-lg text-black dark:text-white"
			>
				{{ $t('kechowFoodDelivery') }}
			</h1>

			<p class="text-xl max-w-lg opacity-90 leading-relaxed mx-auto">
				{{ $t('yourLocalFoodDeliveryIsCooking') }}
			</p>

			<p
				class="text-lg max-w-md opacity-80 underline underline-offset-4 decoration-accent cursor-pointer hover:decoration-secondary transition mx-auto"
				@click="alertComingSoon"
			>
				{{ $t('comingSoonDescription') }}
			</p>

			<BaseButton
				@click="goHome"
				class="btn px-8 py-3 text-lg font-semibold rounded-md shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition"
				aria-label="Get started"
			>
				{{ $t('getStarted') }}
			</BaseButton>
		</div>
	</section>

	<!-- Separate Testimonials section -->
	<section
		aria-label="Customer testimonials"
		class="max-w-4xl mx-auto mt-32 w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg p-10 shadow-lg text-center min-h-[40vh]"
	>
		<h2 class="text-3xl font-bold mb-6 text-gray-900">
			What our customers say
		</h2>
		<ul class="space-y-6 text-lg">
			<li class="italic text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
				"Amazing food delivered fast! The UI is super clean and easy to use."
				<br />
				<span class="font-semibold">- Jamie L.</span>
			</li>
			<li class="italic text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
				"Love the animations and smooth experience. Can't wait for launch!"
				<br />
				<span class="font-semibold">- Maria G.</span>
			</li>
		</ul>
	</section>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function goHome() {
	router.push('/home');
}

function alertComingSoon() {
	alert('Stay tuned! We are launching soon 🚀');
}
</script>

<style scoped>
@keyframes float1 {
	0%,
	100% {
		transform: translateY(0) rotate(12deg);
	}
	50% {
		transform: translateY(-20px) rotate(18deg);
	}
}
@keyframes float2 {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(15px);
	}
}
@keyframes float3 {
	0%,
	100% {
		transform: translateY(0) translateX(0);
	}
	50% {
		transform: translateY(-10px) translateX(5px);
	}
}
@keyframes float4 {
	0%,
	100% {
		transform: translateY(0) translateX(0);
	}
	50% {
		transform: translateY(12px) translateX(-6px);
	}
}
@keyframes float5 {
	0%,
	100% {
		transform: translateY(0) translateX(0) rotate(0);
	}
	50% {
		transform: translateY(-8px) translateX(8px) rotate(10deg);
	}
}
@keyframes float6 {
	0%,
	100% {
		transform: translateY(0) translateX(0);
	}
	50% {
		transform: translateY(-14px);
	}
}
@keyframes float7 {
	0%,
	100% {
		transform: translateY(0) translateX(0);
	}
	50% {
		transform: translateY(10px) translateX(6px);
	}
}
@keyframes float8 {
	0%,
	100% {
		transform: translateY(0) translateX(0);
	}
	50% {
		transform: translateY(-12px) translateX(4px);
	}
}
@keyframes float9 {
	0%,
	100% {
		transform: translateY(0) translateX(0);
	}
	50% {
		transform: translateY(15px) translateX(-5px);
	}
}
@keyframes float10 {
	0%,
	100% {
		transform: translateY(0) translateX(0);
	}
	50% {
		transform: translateY(-10px) translateX(-6px);
	}
}
@keyframes float11 {
	0%,
	100% {
		transform: translateY(0) translateX(0);
	}
	50% {
		transform: translateY(13px) translateX(3px);
	}
}
@keyframes float12 {
	0%,
	100% {
		transform: translateY(0) translateX(0) rotate(0deg);
	}
	50% {
		transform: translateY(-8px) translateX(6px) rotate(15deg);
	}
}

.animate-float1 {
	animation: float1 4s ease-in-out infinite;
}
.animate-float2 {
	animation: float2 6s ease-in-out infinite;
}
.animate-float3 {
	animation: float3 5s ease-in-out infinite;
}
.animate-float4 {
	animation: float4 4.5s ease-in-out infinite;
}
.animate-float5 {
	animation: float5 6.5s ease-in-out infinite;
}
.animate-float6 {
	animation: float6 5.5s ease-in-out infinite;
}
.animate-float7 {
	animation: float7 4.7s ease-in-out infinite;
}
.animate-float8 {
	animation: float8 5.2s ease-in-out infinite;
}
.animate-float9 {
	animation: float9 4.9s ease-in-out infinite;
}
.animate-float10 {
	animation: float10 6.1s ease-in-out infinite;
}
.animate-float11 {
	animation: float11 5.8s ease-in-out infinite;
}
.animate-float12 {
	animation: float12 5.3s ease-in-out infinite;
}

@keyframes spinSlow {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
.animate-spin-slow {
	animation: spinSlow 60s linear infinite;
}

@keyframes spinSlow {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.animate-spin-slow {
	animation: spinSlow 60s linear infinite;
}
</style>
