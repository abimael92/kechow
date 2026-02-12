<template>
	<div class="min-w-0 bg-gradient-to-br from-primary-50 via-primary-100/40 to-primary-200/50 text-secondary-900 dark:bg-secondary-900 dark:text-secondary-100 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-800 font-sans transition-colors duration-300">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
<div class="max-w-4xl mx-auto px-4 mb-16 sm:px-6 lg:px-8 pt-8 lg:pt-12">
	<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
		<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
			<i class="ri-chat-3-line text-white text-lg sm:text-xl md:text-2xl"></i>
		</div>
		<div class="min-w-0 flex-1">
			<h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
				Reseñas
			</h1>
			<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none line-clamp-1">
				Comparte tu experiencia con otros clientes
			</p>
		</div>
	</div>
</div>

			<!-- Create Review Form -->
			<div
				v-if="showCreateForm"
				class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
			>
				<h2 class="text-xl font-semibold mb-5 text-gray-900 dark:text-white flex items-center gap-2">
					<i class="ri-edit-box-line text-orange-500"></i>
					Escribir Reseña
				</h2>
				<div class="space-y-5">
					<div>
						<label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
							Restaurante
						</label>
						<select
							v-model="newReview.restaurantId"
							class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
						>
							<option value="">Seleccionar restaurante</option>
							<option
								v-for="restaurant in restaurants"
								:key="restaurant.id"
								:value="restaurant.id"
							>
								{{ restaurant.name }}
							</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
							Calificación
						</label>
						<div class="flex gap-1">
							<button
								v-for="rating in 5"
								:key="rating"
								@click="newReview.rating = rating"
								class="text-3xl transition-all hover:scale-110 focus:outline-none"
								:class="
									rating <= newReview.rating
										? 'text-yellow-400'
										: 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'
								"
							>
								★
							</button>
							<span v-if="newReview.rating > 0" class="ml-2 text-sm text-gray-600 dark:text-gray-400 self-center">
								{{ newReview.rating }} de 5
							</span>
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
							Comentario
						</label>
						<textarea
							v-model="newReview.comment"
							rows="4"
							placeholder="Comparte tu experiencia... ¿Qué te gustó? ¿Qué mejorarías?"
							class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-shadow"
						></textarea>
					</div>
					<div class="flex gap-3 pt-2">
						<button
							@click="showCreateForm = false"
							class="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
						>
							Cancelar
						</button>
						<button
							@click="submitReview"
							:disabled="!canSubmitReview || submitting"
							class="flex-1 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
						>
							<i v-if="submitting" class="ri-loader-4-line animate-spin"></i>
							<i v-else class="ri-send-plane-line"></i>
							{{ submitting ? 'Enviando...' : 'Publicar Reseña' }}
						</button>
					</div>
				</div>
			</div>

			<!-- Reviews Header -->
			<div v-if="!loading" class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
						<i class="ri-chat-3-line text-orange-600 dark:text-orange-400 text-xl"></i>
					</div>
					<div>
						<h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
							Todas las reseñas
						</h2>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							{{ reviews.length }} {{ reviews.length === 1 ? 'opinión' : 'opiniones' }}
						</p>
					</div>
				</div>
			<button
	@click="showCreateForm = !showCreateForm"
	class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
>
	<i class="ri-add-line text-lg"></i>
	{{ showCreateForm ? 'Cerrar' : 'Nueva Reseña' }}
</button>
			</div>

			<!-- Loading State -->
			<div v-if="loading" class="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
				<div class="text-center max-w-sm mx-auto px-4 py-8">
					<div class="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
						<i class="ri-loader-4-line text-3xl text-orange-600 dark:text-orange-400 animate-spin"></i>
					</div>
					<p class="text-gray-600 dark:text-gray-400">Cargando reseñas...</p>
				</div>
			</div>

			<!-- Reviews List -->
			<div v-else class="space-y-4">
				<div
					v-for="review in reviews"
					:key="review.id"
					class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md"
				>
					<div class="flex items-start justify-between mb-3">
						<div class="flex items-start gap-3">
							<div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
								<span class="text-lg font-medium text-gray-700 dark:text-gray-300">
									{{ review.customerName?.charAt(0) || 'U' }}
								</span>
							</div>
							<div>
								<div class="flex items-center gap-2 mb-1">
									<span class="font-semibold text-gray-900 dark:text-white">
										{{ review.customerName || 'Usuario' }}
									</span>
									<span
										v-if="review.verified"
										class="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full"
									>
										<i class="ri-check-line"></i>
										Verificado
									</span>
								</div>
								<div class="flex items-center gap-2">
									<div class="flex text-yellow-400">
										<span
											v-for="i in 5"
											:key="i"
											:class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
										>
											★
										</span>
									</div>
									<span class="text-xs text-gray-500 dark:text-gray-500">
										{{ formatDate(review.date) }}
									</span>
								</div>
							</div>
						</div>
					</div>
					
					<p class="text-gray-700 dark:text-gray-300 ml-13 pl-0 sm:pl-13">{{ review.comment }}</p>
					
					<div
						v-if="review.orderItems?.length"
						class="mt-3 ml-13 pl-0 sm:pl-13"
					>
						<div class="flex flex-wrap gap-2">
							<span class="text-xs text-gray-500 dark:text-gray-500 mr-1 self-center">Pedido:</span>
							<span
								v-for="item in review.orderItems"
								:key="item"
								class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
							>
								{{ item }}
							</span>
						</div>
					</div>
					
					<div
						v-if="review.response"
						class="mt-4 ml-13 pl-0 sm:pl-13 pt-4 border-t border-gray-100 dark:border-gray-700"
					>
						<div class="flex gap-3">
							<div class="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
								<i class="ri-store-3-line text-sm text-orange-600 dark:text-orange-400"></i>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-900 dark:text-white mb-1">
									Respuesta del restaurante
								</p>
								<p class="text-sm text-gray-600 dark:text-gray-400">
									{{ review.response }}
								</p>
							</div>
						</div>
					</div>
					
					<div class="flex items-center gap-4 mt-4 ml-13 pl-0 sm:pl-13">
						<button
							@click="toggleHelpful(review.id)"
							class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
						>
							<i class="ri-thumb-up-line group-hover:scale-110 transition-transform"></i>
							Útil ({{ review.helpfulCount || 0 }})
						</button>
					</div>
				</div>

				<!-- Empty State - Perfectly centered -->
				<div
					v-if="reviews.length === 0"
					class="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
				>
					<div class="text-center max-w-sm mx-auto px-4 py-8">
						<div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
							<i class="ri-chat-3-line text-3xl text-gray-500 dark:text-gray-400"></i>
						</div>
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
							No hay reseñas aún
						</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
							¡Sé el primero en compartir tu experiencia!
						</p>
						<button
	@click="showCreateForm = true"
	class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
>
	<i class="ri-add-line text-lg"></i>
	Crear primera reseña
</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import {
	getRestaurantReviews,
	createReview,
	getRestaurants,
	type Restaurant,
} from '@/features/customer/services/customer.service';
import type { Review } from '@/features/customer/types';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const reviews = ref<Review[]>([]);
const restaurants = ref<Restaurant[]>([]);
const loading = ref(true);
const showCreateForm = ref(false);
const submitting = ref(false);
const newReview = ref({
	restaurantId: 0,
	orderId: '',
	rating: 0,
	comment: '',
});

const canSubmitReview = computed(() => {
	return (
		newReview.value.restaurantId > 0 &&
		newReview.value.rating > 0 &&
		newReview.value.comment.trim().length > 0
	);
});

const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString('es-MX', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

const loadReviews = async () => {
	try {
		loading.value = true;
		const restaurantList = await getRestaurants();
		restaurants.value = restaurantList;
		if (restaurantList.length > 0) {
			const restaurantReviews = await getRestaurantReviews(restaurantList[0].id);
			reviews.value = restaurantReviews;
		}
	} catch (error) {
		toast.error('Error al cargar reseñas');
	} finally {
		loading.value = false;
	}
};

const submitReview = async () => {
	if (!canSubmitReview.value) return;

	submitting.value = true;
	try {
		const review = await createReview({
			restaurantId: newReview.value.restaurantId,
			orderId: newReview.value.orderId || `ORD-${Date.now()}`,
			rating: newReview.value.rating,
			comment: newReview.value.comment,
		});

		reviews.value.unshift(review);
		showCreateForm.value = false;
		newReview.value = {
			restaurantId: 0,
			orderId: '',
			rating: 0,
			comment: '',
		};
		toast.success('¡Reseña publicada exitosamente!');
	} catch (error) {
		toast.error('Error al publicar reseña');
	} finally {
		submitting.value = false;
	}
};

const toggleHelpful = (reviewId: string) => {
	const review = reviews.value.find((r: Review) => r.id === reviewId);
	if (review) {
		review.helpfulCount = (review.helpfulCount || 0) + 1;
		toast.info('Gracias por tu feedback');
	}
};

onMounted(async () => {
	const orderId = route.query.orderId as string;
	if (orderId) {
		newReview.value.orderId = orderId;
		showCreateForm.value = true;
	}
	await loadReviews();
});
</script>

<style scoped>
/* Smooth transitions */
* {
	transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: 150ms;
}

/* Custom spacing utility */
.ml-13 {
	margin-left: 3.25rem;
}

@media (min-width: 640px) {
	.sm\:pl-13 {
		padding-left: 3.25rem;
	}
}

/* Loading spinner */
@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.animate-spin {
	animation: spin 1s linear infinite;
}
</style>