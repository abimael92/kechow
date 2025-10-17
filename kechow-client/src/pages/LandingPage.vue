<template>
	<section
		class="max-w-4xl mx-auto flex flex-col items-center text-center space-y-12 fade-in-up text-black dark:text-white px-6 py-24 min-h-[90vh] relative overflow-hidden"
	>
		<!-- Delivery-themed animated background (black) -->
		<div
			class="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center"
		>
			<!-- Bigger delivery route circle -->
			<div
				class="relative w-[80vmin] h-[80vmin] border-8 border-dashed border-black rounded-full animate-spin-slow opacity-30 flex items-center justify-center"
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
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path
						d="M13 4a1 1 0 0 1 1 1h4a1 1 0 0 1 .783 .378l.074 .108l3 5l.055 .103l.04 .107l.029 .109l.016 .11l.003 .085v6a1 1 0 0 1 -1 1h-1.171a3.001 3.001 0 0 1 -5.658 0h-4.342a3.001 3.001 0 0 1 -5.658 0h-1.171a1 1 0 0 1 -1 -1v-11a2 2 0 0 1 2 -2zm-6 12a1 1 0 1 0 0 2a1 1 0 0 0 0 -2m10 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2m.434 -9h-3.434v3h5.234z"
					/>
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
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path
						d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z"
					/>
					<path d="M9 11v-5a3 3 0 0 1 6 0v5" />
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
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path
						d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12zm0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3"
					/>
				</svg>

				<!-- Hot Drink / Coffee Cup -->
				<svg
					class="absolute w-8 h-8 text-black animate-float8"
					style="top: 62%; right: 33%; transform: translate(50%, -50%)"
					xmlns="https://tabler.io/icons"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path
						d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1"
					/>
					<path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
					<path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
					<path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5z" />
					<path d="M16.746 16.726a3 3 0 1 0 .252 -5.555" />
				</svg>

				<!-- Shopping Cart -->
				<svg
					class="absolute w-8 h-8 text-black animate-float9"
					style="top: 32%; right: 12%; transform: translate(50%, -50%)"
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
					style="bottom: 52%; left: 8%; transform: translate(-50%, 50%)"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M12 21l-8 -4.5v-9l8 -4.5l8 4.5v4.5" />
					<path d="M12 12l8 -4.5" />
					<path d="M12 12v9" />
					<path d="M12 12l-8 -4.5" />
					<path d="M15 18h7" />
					<path d="M19 15l3 3l-3 3" />
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

				<!-- pizza slice -->
				<svg
					class="absolute w-8 h-8 text-black animate-float11"
					style="top: 18%; left: 20%; transform: translate(-50%, -50%)"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path
						d="M12 21.5c-3.04 0 -5.952 -.714 -8.5 -1.983l8.5 -16.517l8.5 16.517a19.09 19.09 0 0 1 -8.5 1.983z"
					/>
					<path
						d="M5.38 15.866a14.94 14.94 0 0 0 6.815 1.634a14.944 14.944 0 0 0 6.502 -1.479"
					/>
					<path d="M13 11.01v-.01" />
					<path d="M11 14v-.01" />
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
				class="text-5xl sm:text-6xl mt-16 font-extrabold drop-shadow-lg text-black dark:text-white"
			>
				{{ $t('kechowFoodDelivery') }}
			</h1>

			<p class="text-xl max-w-lg opacity-90 leading-relaxed mx-auto">
				{{ $t('yourLocalFoodDeliveryIsCooking') }}
			</p>

			<p
				class="text-lg max-w-md opacity-80 underline underline-offset- decoration-accent decoration-4 cursor-pointer hover:decoration-secondary transition mx-auto"
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
		<h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
			{{ $t('customerTestimonialsTitle') }}
		</h2>
		<ul class="space-y-6 text-lg">
			<li class="italic text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
				"{{ $t('testimonial1') }}"
				<br />
				<span class="font-semibold">- Jamie L.</span>
			</li>
			<li class="italic text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
				"{{ $t('testimonial2') }}"
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
