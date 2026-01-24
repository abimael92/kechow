<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const toast = useToast();
const router = useRouter();

type CartItem = {
	id: number;
	name: string;
	price: number;
	image: string;
	quantity: number;
	description?: string;
	category?: string;
};

const cart = ref<CartItem[]>([
	{
		id: 1,
		name: 'Burrito de Machaca',
		price: 85.0,
		image: 'https://source.unsplash.com/200x200/?mexican-burrito',
		quantity: 1,
		description: 'Carne seca de res deshebrada con huevo, pico de gallo',
		category: 'Plato Principal',
	},
	{
		id: 2,
		name: 'Chile Colorado',
		price: 95.0,
		image: 'https://source.unsplash.com/200x200/?mexican-chile',
		quantity: 1,
		description: 'Carne de res en salsa de chile colorado',
		category: 'Plato Principal',
	},
	{
		id: 3,
		name: 'Sopa de Menudo',
		price: 75.0,
		image: 'https://source.unsplash.com/200x200/?menudo',
		quantity: 1,
		description: 'Tradicional sopa de panza de res con maíz',
		category: 'Sopas',
	},
	{
		id: 4,
		name: 'Refresco de Tamarindo',
		price: 25.0,
		image: 'https://source.unsplash.com/200x200/?tamarind-drink',
		quantity: 2,
		description: 'Refresco natural de tamarindo casero',
		category: 'Bebidas',
	},
	{
		id: 5,
		name: 'Coyotas',
		price: 40.0,
		image: 'https://source.unsplash.com/200x200/?mexican-cookies',
		quantity: 3,
		description: 'Galletas tradicionales rellenas de piloncillo',
		category: 'Postres',
	},
]);

// Animation states
const removingItemId = ref<number | null>(null);
const showSuccess = ref(false);

const total = computed(() =>
	cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const itemCount = computed(() =>
	cart.value.reduce((sum, item) => sum + item.quantity, 0)
);

const deliveryFee = computed(() => (total.value > 250 ? 0 : 50.0));
const tax = computed(() => total.value * 0.08);
const finalTotal = computed(() => total.value + deliveryFee.value + tax.value);

function increase(id: number) {
	const item = cart.value.find((i) => i.id === id);
	if (item) {
		item.quantity++;
		animateQuantityChange(id);
	}
}

function decrease(id: number) {
	const item = cart.value.find((i) => i.id === id);
	if (item && item.quantity > 1) {
		item.quantity--;
		animateQuantityChange(id);
	}
}

function updateQuantity(id: number, newQuantity: number) {
	const item = cart.value.find((i) => i.id === id);
	if (item) {
		if (newQuantity < 1) {
			removeItem(id);
		} else {
			item.quantity = newQuantity;
			animateQuantityChange(id);
		}
	}
}

function removeItem(id: number) {
	removingItemId.value = id;
	setTimeout(() => {
		cart.value = cart.value.filter((i) => i.id !== id);
		removingItemId.value = null;
	}, 300);
}

function animateQuantityChange(id: number) {
	const element = document.getElementById(`quantity-${id}`);
	if (element) {
		element.classList.add('quantity-change');
		setTimeout(() => element.classList.remove('quantity-change'), 300);
	}
}

async function checkout() {
	showSuccess.value = true;

	// Simulate API call
	await new Promise((resolve) => setTimeout(resolve, 1500));

	toast.success(
		t('orderPlacedSuccessfully', { total: finalTotal.value.toFixed(2) })
	);

	cart.value = [];
	showSuccess.value = false;
}

function continueShopping() {
	router.back();
}

// Keyboard shortcuts
onMounted(() => {
	const handleKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			continueShopping();
		}
	};
	window.addEventListener('keydown', handleKeyPress);
	return () => {
		window.removeEventListener('keydown', handleKeyPress);
	};
});
</script>

<template>
	<div class="min-h-screen py-4 md:py-6">
		<div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
			<!-- Header -->
			<header class="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 gap-4 sm:gap-0">
				<!-- Back Button -->
				<button
					@click="continueShopping"
					class="flex items-center gap-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 self-start sm:self-auto w-full sm:w-auto"
				>
					<div
						class="w-8 h-8 flex items-center justify-center rounded-full shadow-sm group-hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
					>
						<span class="text-lg">←</span>
					</div>
					<span class="font-medium ml-1">{{ t('continueShopping') }}</span>
				</button>

				<!-- Title Section -->
				<div class="flex-1 px-2 sm:px-4 text-center order-first sm:order-none">
					<h1
						class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight sm:leading-snug"
					>
						{{ t('myCart') }}
					</h1>
					<p
						class="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 max-w-2xl mx-auto"
					>
						{{ t('itemsInCart', { count: itemCount }) }}
					</p>
				</div>

				<!-- Spacer for balance -->
				<div class="w-16 sm:w-20 hidden sm:block"></div>
			</header>

			<!-- Main Content -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
				<!-- Cart Items -->
				<div class="lg:col-span-2 space-y-3 md:space-y-4">
					<TransitionGroup name="list">
						<div
							v-for="item in cart"
							:key="item.id"
							:class="[
								'bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 transition-all duration-300',
								removingItemId === item.id
									? 'opacity-0 scale-95'
									: 'opacity-100 scale-100',
								'hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600',
							]"
						>
							<div class="flex flex-col sm:flex-row gap-4">
								<!-- Product Image -->
								<div class="flex-shrink-0 mx-auto sm:mx-0">
									<img
										:src="item.image || '/images/placeholder-image.png'"
										:alt="item.name"
										class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-sm"
									/>
								</div>

								<!-- Product Info -->
								<div class="flex-1 min-w-0">
									<div class="flex justify-between items-start gap-2 sm:gap-4">
										<div class="flex-1 min-w-0">
											<h3 class="font-semibold text-gray-900 dark:text-white text-base sm:text-lg truncate">
												{{ item.name }}
											</h3>
											<p class="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
												{{ t(item.category?.toLowerCase() || 'uncategorized') }}
											</p>
											<p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-2 line-clamp-2">
												{{ item.description }}
											</p>
										</div>
										<button
											@click="removeItem(item.id)"
											class="text-red-400 hover:text-red-600 dark:hover:text-red-500 cursor-pointer transition-colors duration-200 flex-shrink-0 ml-2"
											:aria-label="t('removeItem')"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 16 16"
												stroke="currentColor"
												class="w-5 h-5"
											>
												<path
													d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
												/>
												<path
													d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
												/>
											</svg>
										</button>
									</div>

									<!-- Quantity Controls & Price -->
									<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3 sm:gap-0">
										<!-- Quantity Controls -->
										<div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
											<button
												@click="decrease(item.id)"
												:disabled="item.quantity <= 1"
												class="w-[50px] sm:w-[60px] h-8 flex items-center justify-center rounded-full text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
												:aria-label="t('decreaseQuantity')"
											>
												<svg
													class="w-4 h-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M20 12H4"
													/>
												</svg>
											</button>

											<div class="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none justify-center">
												<input
													:id="`quantity-${item.id}`"
													type="number"
													:value="item.quantity"
													@input="
														updateQuantity(
															item.id,
															parseInt(
																($event.target as HTMLInputElement).value
															) || 0
														)
													"
													@blur="
														($event.target as HTMLInputElement).value =
															item.quantity.toString()
													"
													min="1"
													max="99"
													class="w-16 sm:w-18 text-center border border-gray-300 dark:border-gray-600 bg-transparent rounded-md text-base sm:text-lg font-medium text-primary-600 dark:text-primary-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors duration-200"
												/>
											</div>

											<button
												@click="increase(item.id)"
												class="w-[50px] sm:w-[60px] h-8 flex items-center justify-center rounded-full bg-primary-600 dark:bg-primary-500 text-white text-lg font-bold hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
												:aria-label="t('increaseQuantity')"
											>
												<svg
													class="w-4 h-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M12 4v16m8-8H4"
													/>
												</svg>
											</button>
										</div>

										<!-- Price -->
										<div class="text-right w-full sm:w-auto mt-2 sm:mt-0">
											<p class="text-lg font-bold text-gray-900 dark:text-white">
												${{ (item.price * item.quantity).toFixed(2) }}
											</p>
											<p class="text-sm text-gray-500 dark:text-gray-400">
												{{ t('each', { price: item.price.toFixed(2) }) }}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</TransitionGroup>

					<!-- Empty State -->
					<div
						v-if="!cart.length"
						class="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
					>
						<div
							class="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<svg
								class="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21"
								/>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
							{{ t('cartEmpty') }}
						</h3>
						<p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto px-4">
							{{ t('addItemsPrompt') }}
						</p>
						<button
							@click="continueShopping"
							class="bg-primary-600 dark:bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-sm hover:shadow-md"
						>
							{{ t('browseMenu') }}
						</button>
					</div>
				</div>

				<!-- Order Summary -->
				<div v-if="cart.length" class="lg:col-span-1">
					<div class="sticky top-4 md:top-6">
						<div
							class="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6"
						>
							<h2 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
								{{ t('orderSummary') }}
							</h2>

							<!-- Pricing Breakdown -->
							<div class="space-y-3 mb-4 md:mb-6">
								<div class="flex justify-between text-gray-600 dark:text-gray-300 text-sm md:text-base">
									<span>{{ t('subtotal', { count: itemCount }) }}</span>
									<span>${{ total.toFixed(2) }}</span>
								</div>
								<div class="flex justify-between text-gray-600 dark:text-gray-300 text-sm md:text-base">
									<span>{{ t('deliveryFee') }}</span>
									<span :class="deliveryFee === 0 ? 'text-green-600 dark:text-green-400' : ''">
										{{
											deliveryFee === 0 ? t('free') : `$${deliveryFee.toFixed(2)}`
										}}
									</span>
								</div>
								<div class="flex justify-between text-gray-600 dark:text-gray-300 text-sm md:text-base">
									<span>{{ t('tax', { rate: 8 }) }}</span>
									<span>${{ tax.toFixed(2) }}</span>
								</div>
								<div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
									<div
										class="flex justify-between text-base md:text-lg font-bold text-gray-900 dark:text-white"
									>
										<span>{{ t('total') }}</span>
										<span>${{ finalTotal.toFixed(2) }}</span>
									</div>
								</div>

								<!-- Free delivery progress -->
								<div v-if="total < 250" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mt-4">
									<div class="flex justify-between text-xs md:text-sm mb-2">
										<span class="text-gray-600 dark:text-gray-300">
											{{ t('freeDeliveryProgress', { amount: (250 - total).toFixed(2) }) }}
										</span>
										<span class="font-semibold text-primary-600 dark:text-primary-400">
											{{ Math.min((total / 250) * 100, 100).toFixed(0) }}%
										</span>
									</div>
									<div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
										<div
											class="bg-primary-500 dark:bg-primary-400 h-2 rounded-full transition-all duration-500"
											:style="{
												width: `${Math.min((total / 250) * 100, 100)}%`,
											}"
										></div>
									</div>
								</div>
							</div>

							<!-- Checkout Button -->
							<button
								@click="checkout"
								:disabled="showSuccess"
								:class="[
									'relative w-full gap-1 px-3 py-3 md:py-4 rounded-xl font-semibold flex items-center justify-center transition-colors duration-200',
									showSuccess
										? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
										: 'bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600',
								]"
							>
								<div class="flex items-center justify-center gap-2">
									<svg
										v-if="showSuccess"
										class="w-5 h-5 animate-spin"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/>
									</svg>
									<span v-if="showSuccess">{{ t('processing') }}</span>
									<span v-else>{{ t('checkout', { total: finalTotal.toFixed(2) }) }}</span>
								</div>
							</button>

							<!-- Security Badge -->
							<div
								class="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
							>
								<svg
									class="w-4 h-4 text-green-500"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								<span class="text-xs text-gray-500 dark:text-gray-400">
									{{ t('secureCheckout') }}
								</span>
							</div>
						</div>

						<!-- Support Info -->
						<div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mt-4 border border-blue-100 dark:border-blue-800">
							<div class="flex items-start gap-3">
								<svg
									class="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<div>
									<p class="text-sm font-medium text-blue-900 dark:text-blue-300">{{ t('needHelp') }}</p>
									<p class="text-xs text-blue-700 dark:text-blue-400 mt-1">
										{{ t('contactSupport', { phone: '(636) 462-1234' }) }}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
	transition: all 0.3s ease;
}

.list-enter-from {
	opacity: 0;
	transform: translateX(-30px);
}

.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

.quantity-change {
	animation: pulse 0.3s ease-in-out;
}

@keyframes pulse {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
	100% {
		transform: scale(1);
	}
}

/* Improve number input styling */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

input[type='number'] {
	-moz-appearance: textfield;
}

/* Responsive adjustments */
@media (max-width: 640px) {
	.grid-cols-1 > * {
		width: 100%;
	}
}

/* Dark mode transitions */
* {
	transition-property: color, background-color, border-color, transform,
		box-shadow;
	transition-duration: 200ms;
}

/* Improve touch targets on mobile */
@media (max-width: 768px) {
	button, 
	input[type="number"],
	[role="button"] {
		min-height: 44px;
		min-width: 44px;
	}
	
	/* Adjust spacing for mobile */
	.space-y-3 > * + * {
		margin-top: 0.75rem;
	}
}
</style>