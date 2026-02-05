<template>
	<div
		class="min-h-screen sm:min-h-0 py-4 md:py-6 min-w-0 overflow-x-hidden"
		:class="{ 'flex flex-col': !standalone }"
	>
		<div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 w-full min-w-0 flex-1">
			<!-- Header -->
			<header class="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 gap-4 sm:gap-0">
				<button
					v-if="!standalone"
					@click="$emit('close')"
					class="flex items-center gap-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 self-start sm:self-auto w-full sm:w-auto min-h-[44px] min-w-[44px]"
					aria-label="Cerrar"
				>
					<span class="text-lg">×</span>
					<span class="font-medium ml-1">Cerrar</span>
				</button>
				<button
					v-else
					@click="continueShopping"
					class="flex items-center gap-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 self-start sm:self-auto w-full sm:w-auto min-h-[44px] min-w-[44px]"
					aria-label="Seguir comprando"
				>
					<span class="text-lg">←</span>
					<span class="font-medium ml-1">Seguir comprando</span>
				</button>

				<div class="flex-1 px-2 sm:px-4 text-center order-first sm:order-none">
					<h1 class="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
						Mi carrito
					</h1>
					<p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-1">
						{{ itemCount === 1 ? '1 artículo' : `${itemCount} artículos` }}
					</p>
				</div>

				<div class="w-16 sm:w-20 hidden sm:block"></div>
			</header>

			<!-- Main -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
				<!-- Items -->
				<div class="lg:col-span-2 space-y-3 md:space-y-4">
					<TransitionGroup name="list">
						<div
							v-for="item in cartStore.items"
							:key="String(item.id)"
							:class="[
								'bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border p-4 md:p-6 transition-all duration-300',
								removingId === item.id ? 'opacity-0 scale-95' : 'opacity-100',
								'border-gray-100 dark:border-gray-700 hover:shadow-md',
							]"
						>
							<div class="flex flex-col sm:flex-row gap-4">
								<div class="flex-shrink-0 mx-auto sm:mx-0">
									<img
										:src="item.image_url || '/images/placeholder-image.png'"
										:alt="item.name"
										class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-sm"
									/>
								</div>
								<div class="flex-1 min-w-0">
									<div class="flex justify-between items-start gap-2">
										<div class="flex-1">
											<h3 class="font-semibold text-gray-900 dark:text-white truncate">
												{{ item.name }}
											</h3>
											<p class="text-primary-500 dark:text-primary-400 font-bold mt-1">
												${{ formatPrice(item.price) }} MXN
											</p>
										</div>
										<button
											@click="remove(item.id)"
											class="text-red-400 hover:text-red-600 dark:hover:text-red-500 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors"
											aria-label="Quitar del carrito"
										>
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									</div>
									<div class="flex items-center justify-between mt-4">
										<div class="flex items-center gap-2">
											<button
												@click="decrease(item)"
												:disabled="item.quantity <= 1"
												class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px]"
												aria-label="Disminuir cantidad"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
												</svg>
											</button>
											<span class="w-10 text-center font-semibold text-gray-900 dark:text-white">
												{{ item.quantity }}
											</span>
											<button
												@click="increase(item)"
												:disabled="isAtMax(item)"
												class="w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px]"
												aria-label="Aumentar cantidad"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
												</svg>
											</button>
										</div>
										<p class="text-lg font-bold text-gray-900 dark:text-white">
											${{ formatPrice(item.price * item.quantity) }} MXN
										</p>
									</div>
									<p v-if="!item.is_available" class="text-sm text-amber-600 dark:text-amber-400 mt-2">
										Ya no disponible
									</p>
								</div>
							</div>
						</div>
					</TransitionGroup>

					<!-- Empty -->
					<div
						v-if="!cartStore.items.length"
						class="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
					>
						<div class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
							Tu carrito está vacío
						</h3>
						<p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
							Agrega platillos desde un restaurante para continuar
						</p>
						<button
							@click="continueShopping"
							class="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors min-h-[44px]"
						>
							Ver restaurantes
						</button>
					</div>
				</div>

				<!-- Summary -->
				<div v-if="cartStore.items.length" class="lg:col-span-1">
					<div class="sticky top-4 md:top-6">
						<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
							<h2 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
								Resumen del pedido
							</h2>
							<div class="space-y-3 mb-4 md:mb-6">
								<div class="flex justify-between text-gray-600 dark:text-gray-300 text-sm md:text-base">
									<span>Subtotal ({{ itemCount }} {{ itemCount === 1 ? 'artículo' : 'artículos' }})</span>
									<span>${{ formatPrice(cartStore.subtotal) }} MXN</span>
								</div>
								<div class="flex justify-between text-gray-600 dark:text-gray-300 text-sm md:text-base">
									<span>Envío</span>
									<span :class="cartStore.deliveryFee === 0 ? 'text-green-600 dark:text-green-400' : ''">
										{{ cartStore.deliveryFee === 0 ? 'Gratis' : `$${formatPrice(cartStore.deliveryFee)} MXN` }}
									</span>
								</div>
								<div class="flex justify-between text-gray-600 dark:text-gray-300 text-sm md:text-base">
									<span>IVA (8%)</span>
									<span>${{ formatPrice(cartStore.tax) }} MXN</span>
								</div>
								<div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
									<div class="flex justify-between text-base md:text-lg font-bold text-gray-900 dark:text-white">
										<span>Total</span>
										<span class="text-primary-500">${{ formatPrice(cartStore.total) }} MXN</span>
									</div>
								</div>

								<!-- Delivery progress -->
								<div v-if="cartStore.subtotal < 250" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mt-4">
									<div class="flex justify-between text-xs md:text-sm mb-2">
										<span class="text-gray-600 dark:text-gray-300">
											Agrega ${{ formatPrice(cartStore.amountToFreeDelivery) }} MXN más para envío gratis
										</span>
										<span class="font-semibold text-accent-500">
											{{ Math.round(cartStore.deliveryProgress) }}%
										</span>
									</div>
									<div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
										<div
											class="bg-primary-500 h-2 rounded-full transition-all duration-500"
											:style="{ width: `${cartStore.deliveryProgress}%` }"
										></div>
									</div>
								</div>
							</div>

							<button
								@click="goCheckout"
								:disabled="!cartStore.isOnline"
								class="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
							>
								<span v-if="!cartStore.isOnline">Sin conexión</span>
								<span v-else>Pagar ${{ formatPrice(cartStore.total) }} MXN</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCartStore, type CartItemLocal } from '@/features/customer/cart/cart.store';

const props = withDefaults(
	defineProps<{ standalone?: boolean }>(),
	{ standalone: true }
);

const emit = defineEmits<{ close: [] }>();

const router = useRouter();
const cartStore = useCartStore();
const { itemCount } = storeToRefs(cartStore);
const removingId = ref<number | string | null>(null);

onMounted(() => {
	cartStore.syncFromBackend();
});

function formatPrice(n: number) {
	return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function isAtMax(item: CartItemLocal) {
	const max = item.stock == null ? 20 : Math.min(20, item.stock);
	return item.quantity >= max;
}

async function increase(item: CartItemLocal) {
	await cartStore.updateQuantity(item.id, item.quantity + 1);
}

async function decrease(item: CartItemLocal) {
	if (item.quantity <= 1) return;
	await cartStore.updateQuantity(item.id, item.quantity - 1);
}

function remove(itemId: number | string) {
	removingId.value = itemId;
	setTimeout(() => {
		cartStore.removeItem(itemId);
		removingId.value = null;
	}, 300);
}

function continueShopping() {
	if (!props.standalone) {
		(defineEmits as () => { close: () => void })()?.close?.();
	}
	router.push({ name: 'RestaurantList' });
}

function goCheckout() {
	if (!cartStore.isOnline) return;
	if (!props.standalone) emit('close');
	router.push({ name: 'CheckoutPage' });
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
	transition: all 0.3s ease;
}
.list-enter-from {
	opacity: 0;
	transform: translateX(-20px);
}
.list-leave-to {
	opacity: 0;
	transform: translateX(20px);
}
</style>
