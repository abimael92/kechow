<!-- @/components/RestaurantCard.vue -->
<template>
    <div 
        class="bg-card dark:bg-secondary-800 rounded-card overflow-hidden border border-primary-500 dark:border-secondary-700 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group min-w-0"
        @click="$emit('click', restaurant)"
    >
        <!-- Restaurant Image -->
        <div class="relative h-36 sm:h-40 md:h-48 overflow-hidden">
            <img 
                :src="restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'" 
                :alt="restaurant.name"
                class="w-full h-full max-w-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
            />
            <button 
                @click.stop="$emit('favorite', restaurant)"
                class="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 bg-card/90 dark:bg-secondary-800/90 rounded-full hover:bg-card dark:hover:bg-secondary-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Añadir o quitar de favoritos"
            >
                <i 
                    :class="restaurant.isFavorite ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-gray-600 dark:text-gray-300'"
                    class="text-lg sm:text-xl flex-shrink-0"
                ></i>
            </button>
            <div v-if="!restaurant.isOpen" class="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span class="bg-error text-white px-3 py-1.5 sm:px-4 rounded-full text-xs sm:text-sm font-medium">
                    Cerrado
                </span>
            </div>
        </div>
        
        <!-- Restaurant Info -->
        <div class="p-3 sm:p-4 min-w-0">
            <div class="flex justify-between items-start gap-2 mb-2">
                <h3 class="font-bold text-base sm:text-lg text-secondary-900 dark:text-white line-clamp-1 min-w-0 break-words font-chewy">
                    {{ restaurant.name }}
                </h3>
                <span 
                    :class="[
                        'px-2 py-1 rounded text-xs font-medium flex-shrink-0',
                        restaurant.priceRange === '$' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        restaurant.priceRange === '$$' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    ]"
                >
                    {{ restaurant.priceRange }}
                </span>
            </div>
            
            <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2 break-words min-w-0">
                {{ restaurant.description }}
            </p>
            
            <div class="flex items-center justify-between gap-2 min-w-0">
                <!-- Rating -->
                <div class="flex items-center gap-1 min-w-0" v-if="restaurant.rating !== undefined">
                    <div class="flex text-yellow-400 flex-shrink-0">
                        <i v-for="star in 5" :key="star" class="ri-star-fill text-sm sm:text-base"></i>
                    </div>
                    <span class="text-xs sm:text-sm text-secondary-700 dark:text-secondary-300 truncate">
                        {{ restaurant.rating?.toFixed(1) || 'N/A' }}
                    </span>
                </div>
                <div v-else class="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400">Sin calificación</div>
                
                <!-- Delivery Time -->
                <span class="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 flex-shrink-0" v-if="restaurant.deliveryTime">
                    {{ restaurant.deliveryTime }} min
                </span>
            </div>
            
            <!-- Cuisine Badge -->
            <div class="mt-3">
                <span class="inline-block px-2.5 py-1 sm:px-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs break-words max-w-full">
                    {{ restaurant.cuisine }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

interface MenuItem {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    stock?: number;
}

interface Restaurant {
    id: number;
    name: string;
    description: string;
    image?: string;
    menu: MenuItem[];
    rating?: number; // Made optional
    deliveryTime?: number; // Made optional
    priceRange?: '$' | '$$' | '$$$'; // Made optional
    cuisine?: string; // Made optional
    isOpen?: boolean; // Made optional
    isFavorite?: boolean; // Made optional
}

const props = defineProps<{
    restaurant: Restaurant;
    viewMode?: 'grid' | 'list';
}>();

defineEmits<{
    (e: 'favorite', restaurant: Restaurant): void;
    (e: 'click', restaurant: Restaurant): void;
}>();
</script>

<style scoped>
.line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

/* List view styles */
:deep(.restaurant-card-list) {
    @apply flex;
}

:deep(.restaurant-card-list .image-container) {
    @apply w-32 h-32 flex-shrink-0;
}

:deep(.restaurant-card-list .info-container) {
    @apply flex-1;
}
</style>