<!-- @/components/RestaurantCard.vue -->
<template>
    <div 
        class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
        @click="$emit('click', restaurant)"
    >
        <!-- Restaurant Image -->
        <div class="relative h-48 overflow-hidden">
            <img 
                :src="restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'" 
                :alt="restaurant.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <button 
                @click.stop="$emit('favorite', restaurant)"
                class="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
                <i 
                    :class="restaurant.isFavorite ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-gray-600 dark:text-gray-300'"
                    class="text-xl"
                ></i>
            </button>
            <div v-if="!restaurant.isOpen" class="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span class="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Cerrado
                </span>
            </div>
        </div>
        
        <!-- Restaurant Info -->
        <div class="p-4">
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                    {{ restaurant.name }}
                </h3>
                <span 
                    :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        restaurant.priceRange === '$' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        restaurant.priceRange === '$$' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    ]"
                >
                    {{ restaurant.priceRange }}
                </span>
            </div>
            
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {{ restaurant.description }}
            </p>
            
            <div class="flex items-center justify-between">
                <!-- Rating -->
                <div class="flex items-center gap-1" v-if="restaurant.rating !== undefined">
                    <div class="flex text-yellow-400">
                        <i v-for="star in 5" :key="star" class="ri-star-fill"></i>
                    </div>
                    <span class="text-sm text-gray-700 dark:text-gray-300 ml-1">
                        {{ restaurant.rating?.toFixed(1) || 'N/A' }}
                    </span>
                </div>
                <div v-else class="text-sm text-gray-500">Sin calificación</div>
                
                <!-- Delivery Time -->
                <span class="text-sm text-gray-600 dark:text-gray-400" v-if="restaurant.deliveryTime">
                    {{ restaurant.deliveryTime }} min
                </span>
            </div>
            
            <!-- Cuisine Badge -->
            <div class="mt-3">
                <span class="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                    {{ restaurant.cuisine }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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