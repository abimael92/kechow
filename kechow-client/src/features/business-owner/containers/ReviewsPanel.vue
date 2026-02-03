<template>
	<div class="space-y-4 sm:space-y-6">
		<!-- Header Section -->
		<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-3 sm:gap-4">
			<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
				<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
					<i class="ri-star-line text-white text-lg sm:text-xl md:text-2xl"></i>
				</div>
				<div class="flex-1 min-w-0">
					<h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
					Reseñas de Clientes
					</h1>
					<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none line-clamp-2">
						Gestiona y responde a los comentarios de los clientes
						<span v-if="reviews.length > 0" class="ml-1 sm:ml-2 text-tertiary-800 dark:text-tertiary-400 font-medium whitespace-nowrap">
							({{ reviews.length }} reseñas)
						</span>
					</p>
				</div>
			</div>
			
			<div class="flex flex-col xs:flex-row gap-2 sm:gap-3 mt-2 md:mt-0">
				<!-- Search Input -->
				<div class="relative flex-1 min-w-0">
					<i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm sm:text-base"></i>
					<input
						v-model="searchQuery"
						placeholder="Buscar reseñas..."
						class="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 bg-card dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
						@input="handleSearch"
					/>
					<button
						v-if="searchQuery"
						@click="clearSearch"
						class="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
					>
						<i class="ri-close-line text-sm sm:text-base"></i>
					</button>
				</div>
				
				<!-- Filter and Action Buttons -->
				<div class="flex gap-1.5 sm:gap-2">
					<!-- Filter Button with Dropdown -->
					<div class="relative flex-1 xs:flex-none">
						<button
							@click="toggleFilterDropdown"
							class="w-full xs:w-auto bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
						>
							<i class="ri-filter-line text-sm sm:text-base"></i>
							<span class="hidden xs:inline">Filtrar</span>
							<i class="ri-arrow-down-s-line text-xs sm:text-sm transition-transform duration-200" :class="{ 'rotate-180': showFilterDropdown }"></i>
						</button>
						
						<!-- Filter Dropdown -->
						<transition name="fade">
							<div 
								v-if="showFilterDropdown" 
								class="absolute top-full left-0 right-0 xs:right-auto xs:left-0 mt-2 w-full xs:w-64 bg-card dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-lg z-50 overflow-hidden"
							>
								<div class="p-3 sm:p-4 space-y-3 sm:space-y-4">
									<div>
										<h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">Filtrar por Calificación</h3>
										<div class="space-y-1.5 sm:space-y-2">
											<label v-for="rating in ratingOptions" :key="rating.value" class="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
												<input
													type="checkbox"
													:value="rating.value"
													v-model="selectedRatings"
													@change="applyFilters"
													class="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400 w-4 h-4"
												/>
												<div class="flex items-center gap-0.5 sm:gap-1">
													<span v-for="star in rating.value" :key="star" class="text-amber-500">
														<i class="ri-star-fill text-xs sm:text-sm"></i>
													</span>
												</div>
												<span class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm ml-1.5">({{ getRatingCount(rating.value) }})</span>
											</label>
										</div>
									</div>
									
									<div>
										<h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">Filtrar por Estado</h3>
										<div class="space-y-1.5 sm:space-y-2">
											<label class="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
												<input
													type="checkbox"
													v-model="showOnlyUnread"
													@change="applyFilters"
													class="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400 w-4 h-4"
												/>
												<span class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Solo no leídas</span>
											</label>
											<label class="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
												<input
													type="checkbox"
													v-model="showOnlyUnresponded"
													@change="applyFilters"
													class="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400 w-4 h-4"
												/>
												<span class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Solo sin responder</span>
											</label>
										</div>
									</div>
									
									<div>
										<h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">Ordenar por</h3>
										<select
											v-model="sortBy"
											@change="applyFilters"
											class="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs sm:text-sm"
										>
											<option value="newest">Más recientes primero</option>
											<option value="oldest">Más antiguos primero</option>
											<option value="highest">Calificación más alta</option>
											<option value="lowest">Calificación más baja</option>
											<option value="helpful">Más útiles</option>
										</select>
									</div>
									
									<button
										@click="resetFilters"
										class="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
									>
										Restablecer filtros
									</button>
								</div>
							</div>
						</transition>
					</div>
					
					<!-- Export Button -->
					<button
						@click="exportReviews"
						class="flex-1 xs:flex-none min-w-[80px] bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
					>
						<i class="ri-download-line text-sm sm:text-base"></i>
						<span class="hidden xs:inline">Exportar</span>
					</button>
					
					<!-- Refresh Button -->
					<button
						@click="loadReviews"
						:disabled="loading"
						class="flex-1 xs:flex-none min-w-[80px] bg-gradient-to-r from-primary-600 to-primary-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<i 
							class="ri-refresh-line text-sm sm:text-base transition-transform duration-500" 
							:class="{ 'animate-spin': loading }"
						></i>
						<span class="hidden xs:inline">{{ loading ? 'Actualizando...' : 'Actualizar' }}</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Stats Overview -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
			<ReviewStatsCard
				title="Calificación Promedio"
				:value="averageRating.toFixed(1)"
				:showStars="true"
				:stars="averageRating"
				:change="ratingChange"
				:changeType="ratingChangeType"
				icon="ri-star-line"
				bgColor="bg-amber-100 dark:bg-amber-900/30"
				iconColor="text-amber-600 dark:text-amber-400"
				:loading="loading"
			/>

			<ReviewStatsCard
				title="Total de Reseñas"
				:value="reviews.length.toString()"
				:change="reviewsChange"
				:changeType="reviewsChangeType"
				icon="ri-message-line"
				bgColor="bg-blue-100 dark:bg-blue-900/30"
				iconColor="text-blue-600 dark:text-blue-400"
				:loading="loading"
			/>

			<ReviewStatsCard
				title="Tasa de Respuesta"
				:value="responseRate"
				:change="responseRateChange"
				:changeType="responseRateChangeType"
				icon="ri-chat-check-line"
				bgColor="bg-emerald-100 dark:bg-emerald-900/30"
				iconColor="text-emerald-600 dark:text-emerald-400"
				:loading="loading"
			/>

			<ReviewStatsCard
				title="Reseñas Positivas"
				:value="positiveReviewsCount.toString()"
				:change="positiveReviewsChange"
				:changeType="positiveReviewsChangeType"
				icon="ri-thumb-up-line"
				bgColor="bg-green-100 dark:bg-green-900/30"
				iconColor="text-green-600 dark:text-green-400"
				:loading="loading"
			/>
		</div>

		<!-- Rating Distribution -->
		<div class="bg-card dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6">
			<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
				<h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
					Distribución de Calificaciones
				</h2>
				<div class="flex items-center gap-1.5 sm:gap-2">
					<span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total: {{ reviews.length }} reseñas</span>
					<span class="text-xs sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 whitespace-nowrap">
						Prom.: {{ averageRating.toFixed(1) }}
					</span>
				</div>
			</div>
			<RatingDistribution 
				:ratings="ratingDistribution"
				:loading="loading"
				@rating-click="filterByRating"
			/>
		</div>

		<!-- Filter Tabs -->
		<div class="bg-card dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
			<!-- Tabs with horizontal scroll on mobile -->
			<div class="relative">
				<div class="overflow-x-auto pb-2 -mx-1 sm:mx-0">
					<div class="flex gap-1 sm:gap-2 px-1 min-w-max">
						<button
							v-for="filter in filterTabs"
							:key="filter.id"
							@click="setActiveFilter(filter.id)"
							:class="[
								'px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-1 sm:gap-2',
								activeFilter === filter.id 
									? 'shadow-md transform scale-105'
									: 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
							]"
							:style="activeFilter === filter.id ? filterStyle(filter.color) : {}"
						>
							<i :class="filter.icon" class="text-xs sm:text-sm"></i>
							<span class="truncate max-w-[80px] sm:max-w-none">
								{{ filter.id === 'all' ? 'Todas las Reseñas' : `${parseInt(filter.id)} Estrellas` }}
							</span>
							<span 
								class="ml-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold flex-shrink-0"
								:class="activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-300'"
							>
								{{ filter.count }}
							</span>
						</button>
					</div>
				</div>
				<!-- Scroll indicator for mobile -->
				<div class="sm:hidden text-center mt-1">
					<p class="text-xs text-gray-500 dark:text-gray-400">
						← Desliza para ver más filtros →
					</p>
				</div>
			</div>
			
			<!-- Bulk Actions -->
			<div v-if="selectedReviews.length > 0" class="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-700">
				<div class="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
					<div class="flex items-center gap-1.5 sm:gap-2">
						<i class="ri-checkbox-multiple-fill text-primary-600 dark:text-primary-400 text-sm"></i>
						<span class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
							{{ selectedReviews.length }} reseñas seleccionadas
						</span>
					</div>
					<div class="flex flex-wrap gap-1.5 sm:gap-2">
						<button
							@click="markSelectedAsRead"
							class="px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-card dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap"
						>
							<i class="ri-check-line text-xs sm:text-sm"></i>
							Marcar como leída
						</button>
						<button
							@click="deleteSelectedReviews"
							class="px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap"
						>
							<i class="ri-delete-bin-line text-xs sm:text-sm"></i>
							Eliminar
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Reviews List -->
		<div v-if="loading" class="space-y-3 sm:space-y-4 md:space-y-6">
			<div v-for="n in 3" :key="n" class="bg-card dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
				<div class="flex items-start gap-2 sm:gap-3 md:gap-4">
					<div class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
					<div class="flex-1 space-y-2 sm:space-y-3">
						<div class="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
						<div class="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
						<div class="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
					</div>
				</div>
			</div>
		</div>
		
		<div v-else-if="filteredReviews.length === 0" class="text-center py-8 sm:py-10 md:py-12">
			<div class="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 md:mb-6 text-gray-300 dark:text-gray-600">
				<i class="ri-message-line text-4xl sm:text-5xl md:text-6xl"></i>
			</div>
			<h3 class="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
				{{ searchQuery ? 'No se encontraron reseñas' : 'No hay reseñas' }}
			</h3>
			<p class="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto px-4">
				{{ searchQuery ? 'Intenta con un término de búsqueda diferente' : 'Los clientes podrán dejar reseñas una vez que ordenen de tu restaurante.' }}
			</p>
		</div>

		<div v-else class="space-y-3 sm:space-y-4 md:space-y-6">
			<ReviewCard
				v-for="review in paginatedReviews"
				:key="review.id"
				:review="review"
				:selected="selectedReviews.includes(review.id)"
				@select="toggleReviewSelection"
				@reply="handleReply"
				@flag="handleFlag"
				@helpful="handleHelpful"
				@read="markAsRead"
			/>
			
			<!-- Pagination -->
			<div v-if="filteredReviews.length > itemsPerPage" class="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
				<p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
					Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredReviews.length) }} de {{ filteredReviews.length }} reseñas
				</p>
				<div class="flex gap-1.5 sm:gap-2 order-1 sm:order-2">
					<button
						@click="prevPage"
						:disabled="currentPage === 1"
						class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 text-xs sm:text-sm"
					>
						<i class="ri-arrow-left-s-line text-xs sm:text-sm"></i>
						Anterior
					</button>
					<button
						@click="nextPage"
						:disabled="currentPage * itemsPerPage >= filteredReviews.length"
						class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 text-xs sm:text-sm"
					>
						Siguiente
						<i class="ri-arrow-right-s-line text-xs sm:text-sm"></i>
					</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Click Outside Listener -->
	<div v-if="showFilterDropdown" class="fixed inset-0 z-40" @click="closeFilterDropdown"></div>

	<!-- Response Modal -->
	<div
		v-if="showResponseModal"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
		@click.self="cancelResponse"
	>
		<div
			class="bg-card dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
			@click.stop
		>
			<h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
				Responder a la reseña
			</h3>
			<textarea
				v-model="responseText"
				rows="4"
				placeholder="Tu respuesta"
				class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-card dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
			></textarea>
			<div class="flex gap-3">
				<button
					@click="cancelResponse"
					class="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					Cancelar
				</button>
				<button
					@click="submitResponse"
					:disabled="!responseText.trim() || loading"
					class="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{{ loading ? 'Procesando...' : 'Enviar respuesta' }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ReviewStatsCard from '../components/reviews/ReviewStatsCard.vue';
import RatingDistribution from '../components/reviews/RatingDistribution.vue';
import ReviewCard from '../components/reviews/ReviewCard.vue';
import { fetchReviews, addReviewResponse, markReviewHelpful, flagReview } from '../services/businessOwner.service';
import type { Review } from '../types/';

const reviews = ref<Review[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const showFilterDropdown = ref(false);
const activeFilter = ref('all');
const selectedRatings = ref<number[]>([]);
const showOnlyUnread = ref(false);
const showOnlyUnresponded = ref(false);
const sortBy = ref('newest');
const selectedReviews = ref<string[]>([]);
const currentPage = ref(1);
const itemsPerPage = 10;

const ratingOptions = [
  { value: 5, label: '5 estrellas' },
  { value: 4, label: '4 estrellas' },
  { value: 3, label: '3 estrellas' },
  { value: 2, label: '2 estrellas' },
  { value: 1, label: '1 estrella' }
];

// Computed properties
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((total, review) => total + review.rating, 0);
  return sum / reviews.value.length;
});

const positiveReviewsCount = computed(() => {
  return reviews.value.filter(review => review.rating >= 4).length;
});

const responseRate = computed(() => {
  if (reviews.value.length === 0) return '0%';
  const responded = reviews.value.filter(review => review.response).length;
  return `${Math.round((responded / reviews.value.length) * 100)}%`;
});

const ratingDistribution = computed(() => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.value.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++;
  });
  return distribution;
});

// Mock changes
const ratingChange = computed(() => '+0.2 desde el mes pasado');
const ratingChangeType = computed(() => 'positive' as const);
const reviewsChange = computed(() => '+12 desde el mes pasado');
const reviewsChangeType = computed(() => 'positive' as const);
const responseRateChange = computed(() => '+5% desde el mes pasado');
const responseRateChangeType = computed(() => 'positive' as const);
const positiveReviewsChange = computed(() => '+80% del total');
const positiveReviewsChangeType = computed(() => 'positive' as const);

const filterTabs = computed(() => [
  { id: 'all', label: 'Todas las Reseñas', count: reviews.value.length, icon: 'ri-list-check', color: '#8b34e0' },
  { id: '5', label: '5 Estrellas', count: ratingDistribution.value[5], icon: 'ri-star-fill', color: '#10b981' },
  { id: '4', label: '4 Estrellas', count: ratingDistribution.value[4], icon: 'ri-star-fill', color: '#3b82f6' },
  { id: '3', label: '3 Estrellas', count: ratingDistribution.value[3], icon: 'ri-star-half-fill', color: '#f59e0b' },
  { id: '2', label: '2 Estrellas', count: ratingDistribution.value[2], icon: 'ri-star-line', color: '#ef4444' },
  { id: '1', label: '1 Estrella', count: ratingDistribution.value[1], icon: 'ri-star-line', color: '#dc2626' }
]);

const filteredReviews = computed(() => {
  let filtered = [...reviews.value];

  if (selectedRatings.value.length > 0) {
    filtered = filtered.filter(review => selectedRatings.value.includes(review.rating));
  }

  if (activeFilter.value !== 'all') {
    const rating = parseInt(activeFilter.value);
    filtered = filtered.filter(review => review.rating === rating);
  }

  if (showOnlyUnread.value) {
    filtered = filtered.filter(review => !(review as any).read);
  }

  if (showOnlyUnresponded.value) {
    filtered = filtered.filter(review => !review.response);
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(review => 
      review.customerName.toLowerCase().includes(query) ||
      review.comment.toLowerCase().includes(query) ||
      (review.response && review.response.toLowerCase().includes(query))
    );
  }

  switch (sortBy.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case 'oldest':
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      break;
    case 'highest':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'lowest':
      filtered.sort((a, b) => a.rating - b.rating);
      break;
    case 'helpful':
      filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
      break;
  }

  return filtered;
});

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredReviews.value.slice(start, end);
});

// Functions
const getRatingCount = (rating: number) => {
  return reviews.value.filter(review => review.rating === rating).length;
};

const filterStyle = (color: string) => ({
  background: `linear-gradient(135deg, ${color}, ${color}80)`,
  color: 'white'
});

const setActiveFilter = (filterId: string) => {
  activeFilter.value = filterId;
  currentPage.value = 1;
};

const filterByRating = (rating: number) => {
  if (selectedRatings.value.includes(rating)) {
    selectedRatings.value = selectedRatings.value.filter(r => r !== rating);
  } else {
    selectedRatings.value.push(rating);
  }
  currentPage.value = 1;
};

const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value;
};

const closeFilterDropdown = () => {
  showFilterDropdown.value = false;
};

const applyFilters = () => {
  currentPage.value = 1;
  closeFilterDropdown();
};

const resetFilters = () => {
  selectedRatings.value = [];
  showOnlyUnread.value = false;
  showOnlyUnresponded.value = false;
  sortBy.value = 'newest';
  activeFilter.value = 'all';
  currentPage.value = 1;
  closeFilterDropdown();
};

const handleSearch = () => {
  currentPage.value = 1;
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
};

const toggleReviewSelection = (reviewId: string) => {
  const index = selectedReviews.value.indexOf(reviewId);
  if (index > -1) {
    selectedReviews.value.splice(index, 1);
  } else {
    selectedReviews.value.push(reviewId);
  }
};

const markSelectedAsRead = async () => {
  console.log('Marking reviews as read:', selectedReviews.value);
  selectedReviews.value = [];
};

const deleteSelectedReviews = async () => {
  const count = selectedReviews.value.length;
  const msg = count === 1
    ? '¿Estás seguro de que quieres eliminar 1 reseña?'
    : `¿Estás seguro de que quieres eliminar ${count} reseñas?`;
  if (confirm(msg)) {
    console.log('Deleting reviews:', selectedReviews.value);
    selectedReviews.value = [];
    await loadReviews();
  }
};

const markAsRead = async (reviewId: string) => {
  console.log('Marking review as read:', reviewId);
};

const nextPage = () => {
  if (currentPage.value * itemsPerPage < filteredReviews.value.length) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const exportReviews = () => {
  console.log('Exporting reviews...');
};

const loadReviews = async () => {
  try {
    loading.value = true;
    reviews.value = await fetchReviews();
  } catch (error) {
    console.error('Failed to load reviews:', error);
  } finally {
    loading.value = false;
  }
};

const showResponseModal = ref(false);
const selectedReviewId = ref<string>('');
const responseText = ref('');

const handleReply = (reviewId: string) => {
  selectedReviewId.value = reviewId;
  responseText.value = '';
  showResponseModal.value = true;
};

const submitResponse = async () => {
  if (!responseText.value.trim() || !selectedReviewId.value) return;
  
  try {
    loading.value = true;
    await addReviewResponse(selectedReviewId.value, responseText.value);
    await loadReviews();
    showResponseModal.value = false;
    responseText.value = '';
    selectedReviewId.value = '';
  } catch (error) {
    console.error('Failed to add response:', error);
  } finally {
    loading.value = false;
  }
};

const cancelResponse = () => {
  showResponseModal.value = false;
  responseText.value = '';
  selectedReviewId.value = '';
};

const handleFlag = async (reviewId: string) => {
  try {
    const reason = 'inappropriate';
    await flagReview(reviewId, reason);
    await loadReviews();
  } catch (error) {
    console.error('Failed to flag review:', error);
  }
};

const handleHelpful = async (reviewId: string) => {
  try {
    await markReviewHelpful(reviewId);
    await loadReviews();
  } catch (error) {
    console.error('Failed to mark as helpful:', error);
  }
};

onMounted(() => {
  loadReviews();
});
</script>

<style scoped>
/* Responsive text bubble */
.text-bubble {
	font-size: clamp(2rem, 5vw, 3.5rem);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

/* Custom scrollbar for tabs */
.overflow-x-auto::-webkit-scrollbar {
	height: 3px;
}

.overflow-x-auto::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.05);
	border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
	background: rgba(139, 52, 224, 0.3);
	border-radius: 4px;
}

.dark .overflow-x-auto::-webkit-scrollbar-track {
	background: rgba(255, 255, 255, 0.05);
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
	background: rgba(168, 85, 247, 0.4);
}

/* Smooth transitions */
button, div {
	transition: all 0.2s ease;
}

/* Hover effects */
button:hover {
	transform: translateY(-1px);
}

/* Touch-friendly targets on mobile */
@media (max-width: 640px) {
	button {
		min-height: 44px;
		min-width: 44px;
	}
}

/* Loading animation */
@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.animate-spin {
	animation: spin 1s linear infinite;
}

@keyframes pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

.animate-pulse {
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Responsive spacing */
@media (max-width: 640px) {
	.space-y-4 > * + * {
		margin-top: 1rem;
	}
}

@media (min-width: 641px) and (max-width: 1024px) {
	.space-y-6 > * + * {
		margin-top: 1.5rem;
	}
}

/* Hide scrollbar but allow scrolling */
.overflow-x-auto {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.overflow-x-auto::-webkit-scrollbar {
	display: none;
}

/* Accessibility focus styles */
button:focus-visible {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
}
</style>