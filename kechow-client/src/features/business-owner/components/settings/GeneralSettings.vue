<template>
    <div class="space-y-8">
        <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <div class="px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                <h3 class="text-xl font-bold text-black dark:text-white">
                    Información del Restaurante
                </h3>
                <div class="flex items-center gap-4">
                    <button v-if="editingInfoChanged" @click="saveRestaurantInfo"
                        class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm shadow transition-all cursor-pointer">
                        Guardar Cambios
                    </button>
                    <button @click="toggleEditingInfo"
                        class="px-6 py-2 border border-black dark:border-white text-black dark:text-white rounded-lg font-medium text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer">
                        {{ editingInfo ? 'Cancelar' : 'Editar' }}
                    </button>
                </div>
            </div>

            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Nombre</label>
                    <p class="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-black dark:text-white font-medium">
                        {{ restaurantInfo.name }}
                    </p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Teléfono</label>
                    <input v-if="editingInfo" v-model="restaurantInfo.phone" type="tel" 
                        class="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white focus:border-orange-500 outline-none transition-all cursor-text" />
                    <p v-else class="px-4 py-3 text-black dark:text-white font-medium">{{ restaurantInfo.phone }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Correo</label>
                    <input v-if="editingInfo" v-model="restaurantInfo.email" type="email" 
                        class="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white focus:border-orange-500 outline-none transition-all cursor-text" />
                    <p v-else class="px-4 py-3 text-black dark:text-white font-medium">{{ restaurantInfo.email }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Sitio Web</label>
                    <input v-if="editingInfo" v-model="restaurantInfo.website" type="url" 
                        class="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white focus:border-orange-500 outline-none transition-all cursor-text" />
                    <p v-else class="px-4 py-3 text-black dark:text-white font-medium">{{ restaurantInfo.website }}</p>
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Dirección</label>
                    <input v-if="editingInfo" v-model="restaurantInfo.address" type="text" 
                        class="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white focus:border-orange-500 outline-none transition-all cursor-text" />
                    <p v-else class="px-4 py-3 text-black dark:text-white font-medium">{{ restaurantInfo.address }}</p>
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Descripción</label>
                    <textarea v-if="editingInfo" v-model="restaurantInfo.description" rows="4" 
                        class="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white focus:border-orange-500 outline-none transition-all resize-none cursor-text"></textarea>
                    <p v-else class="px-4 py-3 text-black dark:text-white font-medium">{{ restaurantInfo.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

const editingInfo = ref(false);

const restaurantInfo = reactive({
    name: "Mario's Kitchen",
    phone: '+52 123 456 7890',
    email: 'contacto@marioskitchen.com',
    website: 'https://marioskitchen.com',
    address: 'Av. Principal 123, Ciudad Gourmet, MX 54321',
    description: 'Cocina italiana auténtica con ingredientes frescos y recetas tradicionales.',
});

const originalInfo = reactive({ ...restaurantInfo });

const editingInfoChanged = computed(() => {
    return editingInfo.value && (
        restaurantInfo.phone !== originalInfo.phone ||
        restaurantInfo.email !== originalInfo.email ||
        restaurantInfo.website !== originalInfo.website ||
        restaurantInfo.address !== originalInfo.address ||
        restaurantInfo.description !== originalInfo.description
    );
});

function toggleEditingInfo() {
    if (editingInfo.value) Object.assign(restaurantInfo, originalInfo);
    editingInfo.value = !editingInfo.value;
}

function saveRestaurantInfo() {
    Object.assign(originalInfo, restaurantInfo);
    editingInfo.value = false;
}
</script>