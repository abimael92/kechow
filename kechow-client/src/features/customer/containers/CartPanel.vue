<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

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
		name: 'Margherita Pizza',
		price: 12.99,
		image: 'https://source.unsplash.com/200x200/?pizza',
		quantity: 1,
		description: 'Fresh tomatoes, mozzarella, basil',
		category: 'Main Course',
	},
	{
		id: 2,
		name: 'Caesar Salad',
		price: 7.5,
		image: 'https://source.unsplash.com/200x200/?salad',
		quantity: 2,
		description: 'Crisp romaine, parmesan, croutons',
		category: 'Appetizer',
	},
	{
		id: 3,
		name: 'Chocolate Shake',
		price: 4.99,
		image: 'https://source.unsplash.com/200x200/?milkshake',
		quantity: 1,
		description: 'Rich chocolate, whipped cream',
		category: 'Beverage',
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

const deliveryFee = computed(() => (total.value > 25 ? 0 : 3.99));
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
		`Order placed successfully! Total: $${finalTotal.value.toFixed(2)}`
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
});
</script>

<template>
	<div class="min-h-screen py-6">
		<div class="max-w-4xl mx-auto px-4 sm:px-6">
			<!-- Header -->
			<header class="flex items-center justify-between mb-8">
				<button
					@click="continueShopping"
					class="flex items-center gap-1 px-3 py-2 text-white-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
				>
					<div
						class="w-8 h-8 flex items-center justify-center rounded-full shadow-sm group-hover:shadow-md transition-shadow"
					>
						<span class="text-lg">←</span>
					</div>
					<span class="font-medium">Continue Shopping</span>
				</button>

				<div class="flex-1 px-4 text-center">
					<h1
						class="text-3xl sm:text-6xl font-extrabold text-gray-900 leading-snug"
					>
						My Cart
					</h1>
					<p
						class="text-lg sm:text-2xl text-white mt-2 max-w-2xl mx-auto text-white"
					>
						{{ itemCount }} item{{ itemCount !== 1 ? 's' : '' }} in your cart
					</p>
				</div>

				<div class="w-20"></div>
				<!-- Spacer for balance -->
			</header>

			<!-- Main Content -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Cart Items -->
				<div class="lg:col-span-2 space-y-4">
					<TransitionGroup name="list">
						<div
							v-for="item in cart"
							:key="item.id"
							:class="[
								'bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300',
								removingItemId === item.id
									? 'opacity-0 scale-95'
									: 'opacity-100 scale-100',
								'hover:shadow-md hover:border-gray-200',
							]"
						>
							<div class="flex gap-4">
								<!-- Product Image -->
								<div class="flex-shrink-0">
									<img
										:src="'/images/placeholder-image.png'"
										:alt="item.name"
										class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-sm"
									/>
								</div>

								<!-- Product Info -->
								<div class="flex-1 min-w-0">
									<div class="flex justify-between items-start gap-4">
										<div class="flex-1 min-w-0">
											<h3 class="font-semibold text-gray-900 text-lg truncate">
												{{ item.name }}
											</h3>
											<p class="text-gray-500 text-sm mt-1">
												{{ item.category }}
											</p>
											<p class="text-white text-sm mt-2 line-clamp-2">
												{{ item.description }}
											</p>
										</div>
										<svg
											@click="removeItem(item.id)"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 16 16"
											stroke="currentColor"
											class="w-5 h-5 text-red-400 hover:text-red-600 cursor-pointer transition-colors duration-200"
											aria-label="Remove item"
										>
											<path
												d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
											/>
											<path
												d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
											/>
										</svg>
									</div>

									<!-- Quantity Controls & Price -->
									<div class="flex items-center justify-between mt-4">
										<!-- Quantity Controls -->
										<div class="flex items-center gap-3">
											<button
												@click="decrease(item.id)"
												:disabled="item.quantity <= 1"
												class="w-[60px] h-8 flex items-center justify-center rounded-full text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
												aria-label="Decrease quantity"
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

											<div class="flex items-center gap-2">
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
													class="w-18 text-center border border-gray-300 rounded-md text-lg font-medium text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200"
												/>
											</div>

											<button
												@click="increase(item.id)"
												class="w-[60px] h-8 flex items-center justify-center rounded-full bg-primary text-white text-lg font-bold hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
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
										<div class="text-right">
											<p class="text-lg font-bold text-gray-900">
												${{ (item.price * item.quantity).toFixed(2) }}
											</p>
											<p class="text-sm text-gray-500">
												${{ item.price.toFixed(2) }} each
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
						class="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
					>
						<div
							class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<svg
								class="w-12 h-12 text-gray-400"
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
						<h3 class="text-xl font-semibold text-gray-900 mb-2">
							Your cart is empty
						</h3>
						<p class="text-gray-500 mb-6">
							Add some delicious items to get started!
						</p>
						<button
							@click="continueShopping"
							class="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-sm"
						>
							Browse Menu
						</button>
					</div>
				</div>

				<!-- Order Summary -->
				<div v-if="cart.length" class="lg:col-span-1">
					<div class="sticky top-6">
						<div
							class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
						>
							<h2 class="text-xl font-bold text-gray-900 mb-6">
								Order Summary
							</h2>

							<!-- Pricing Breakdown -->
							<div class="space-y-3 mb-6">
								<div class="flex justify-between text-white">
									<span>Subtotal ({{ itemCount }} items)</span>
									<span>${{ total.toFixed(2) }}</span>
								</div>
								<div class="flex justify-between text-white">
									<span>Delivery Fee</span>
									<span :class="deliveryFee === 0 ? 'text-green-600' : ''">
										{{
											deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`
										}}
									</span>
								</div>
								<div class="flex justify-between text-white">
									<span>Tax (8%)</span>
									<span>${{ tax.toFixed(2) }}</span>
								</div>
								<div class="border-t border-gray-200 pt-3">
									<div
										class="flex justify-between text-lg font-bold text-gray-900"
									>
										<span>Total</span>
										<span>${{ finalTotal.toFixed(2) }}</span>
									</div>
								</div>

								<!-- Free delivery progress -->
								<div v-if="total < 25" class="bg-gray-50 rounded-lg p-3 mt-4">
									<div class="flex justify-between text-sm mb-2">
										<span class="text-white"
											>Add ${{ (25 - total).toFixed(2) }} for free
											delivery!</span
										>
										<span class="font-semibold text-orange-600"
											>{{ Math.min((total / 25) * 100, 100).toFixed(0) }}%</span
										>
									</div>
									<div class="w-full bg-gray-200 rounded-full h-2">
										<div
											class="bg-orange-500 h-2 rounded-full transition-all duration-500"
											:style="{
												width: `${Math.min((total / 25) * 100, 100)}%`,
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
									'relative w-full gap-1 px-3 py-4 rounded-xl font-semibold flex items-center justify-center transition-colors duration-200',
									showSuccess
										? 'bg-gray-400 text-white cursor-not-allowed'
										: 'bg-primary text-white hover:bg-primary/90 hover:text-white',
								]"
							>
								<div class="flex items-center justify-center gap-2">
									<span v-if="showSuccess">Order Placed! </span>
									<span v-else>Checkout - ${{ finalTotal.toFixed(2) }}</span>
								</div>
							</button>

							<!-- Security Badge -->
							<div
								class="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200"
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
								<span class="text-xs text-gray-500"
									>Secure checkout · 256-bit SSL encrypted</span
								>
							</div>
						</div>

						<!-- Support Info -->
						<div class="bg-blue-50 rounded-2xl p-4 mt-4 border border-blue-100">
							<div class="flex items-start gap-3">
								<svg
									class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
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
									<p class="text-sm font-medium text-blue-900">Need help?</p>
									<p class="text-xs text-blue-700 mt-1">
										Contact support: (555) 123-4567
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

/* Smooth transitions for all interactive elements */
* {
	transition-property: color, background-color, border-color, transform,
		box-shadow;
	transition-duration: 200ms;
}
</style>
