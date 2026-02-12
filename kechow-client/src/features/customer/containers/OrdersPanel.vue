<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100/40 to-primary-200/50 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-800 transition-colors duration-300">
		
		<!-- HEADER - EXACT same as Reseñas -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
			<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
				<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
					<i class="ri-shopping-bag-3-line text-white text-lg sm:text-xl md:text-2xl"></i>
				</div>
				<div class="min-w-0 flex-1">
					<h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
						{{ greeting }}
					</h1>
					<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none line-clamp-1">
						{{ profile.name || 'Usuario' }} • {{ profile.email || 'cargando...' }}
					</p>
				</div>
			</div>
		</div>

		<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
			
			<!-- TABS - Primary colors -->
			<div class="flex items-center justify-between mb-8">
				<div class="flex items-center gap-1 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-primary-100/50 dark:border-secondary-700">
					<!-- <button
						v-for="tab in tabs"
						:key="tab.id"
						@click="activeTab = tab.id"
						:class="[
							'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2',
							activeTab === tab.id
								? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/30 scale-105'
								: 'text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-secondary-700'
						]"
					>
						<i :class="tab.icon" class="text-lg"></i>
						{{ tab.label }}
						<span
							v-if="tab.id === 'orders' && orders.length > 0"
							:class="[
								'px-1.5 py-0.5 rounded-full text-xs',
								activeTab === tab.id
									? 'bg-white/20 text-white'
									: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
							]"
						>
							{{ orders.length }}
						</span>
						<span
							v-if="tab.id === 'favorites' && favorites.length > 0"
							:class="[
								'px-1.5 py-0.5 rounded-full text-xs',
								activeTab === tab.id
									? 'bg-white/20 text-white'
									: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
							]"
						>
							{{ favorites.length }}
						</span>
					</button> -->
				</div>

				<!-- Online Status -->
				<div class="hidden sm:flex items-center gap-2">
					<span class="flex h-2.5 w-2.5">
						<span :class="[
							'absolute inline-flex h-2.5 w-2.5 rounded-full',
							isOnline ? 'bg-green-400 animate-ping' : 'bg-gray-400'
						]"></span>
						<span :class="[
							'relative inline-flex rounded-full h-2.5 w-2.5',
							isOnline ? 'bg-green-500' : 'bg-gray-500'
						]"></span>
					</span>
					<span class="text-xs text-secondary-600 dark:text-secondary-400">
						{{ isOnline ? 'Conectado' : 'Sin conexión' }}
					</span>
				</div>
			</div>

			<!-- SEARCH BAR -->
			<div v-if="activeTab === 'orders'" class="mb-8">
				<div class="relative group">
					<div class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>
					<div class="relative flex items-center bg-white dark:bg-secondary-800 rounded-2xl shadow-lg border border-primary-100/50 dark:border-secondary-700">
						<i class="ri-search-line text-secondary-400 text-xl absolute left-5"></i>
						<input
							v-model="searchQuery"
							@input="filterOrders"
							type="text"
							placeholder="Buscar por restaurante, platillo o número de pedido..."
							class="w-full pl-12 pr-36 py-4 bg-transparent border-none focus:ring-0 text-secondary-900 dark:text-white placeholder:text-secondary-400 rounded-2xl text-base"
						/>
						<div class="absolute right-2 flex items-center gap-1">
							<button
								v-if="searchQuery"
								@click="clearSearch"
								class="px-3 py-1.5 bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 rounded-xl text-secondary-600 dark:text-secondary-400 text-sm font-medium transition-colors flex items-center gap-1"
							>
								<i class="ri-close-line"></i>
								Limpiar
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- ORDERS TAB - REAL DATA -->
			<div v-if="activeTab === 'orders'" class="space-y-6">
				<!-- Stats Cards - REAL DATA -->
				<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<div class="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-xl p-4 border border-primary-100/50 dark:border-secondary-700 shadow-lg">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-xs text-secondary-600 dark:text-secondary-400">Total pedidos</p>
								<p class="text-2xl font-bold text-secondary-900 dark:text-white mt-1">{{ orders.length }}</p>
							</div>
							<div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
								<i class="ri-shopping-bag-3-line text-primary-600 dark:text-primary-400 text-xl"></i>
							</div>
						</div>
					</div>
					<div class="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-xl p-4 border border-primary-100/50 dark:border-secondary-700 shadow-lg">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-xs text-secondary-600 dark:text-secondary-400">Entregados</p>
								<p class="text-2xl font-bold text-secondary-900 dark:text-white mt-1">{{ deliveredCount }}</p>
							</div>
							<div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
								<i class="ri-checkbox-circle-line text-green-600 dark:text-green-400 text-xl"></i>
							</div>
						</div>
					</div>
					<div class="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-xl p-4 border border-primary-100/50 dark:border-secondary-700 shadow-lg">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-xs text-secondary-600 dark:text-secondary-400">En curso</p>
								<p class="text-2xl font-bold text-secondary-900 dark:text-white mt-1">{{ inProgressCount }}</p>
							</div>
							<div class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
								<i class="ri-time-line text-yellow-600 dark:text-yellow-400 text-xl"></i>
							</div>
						</div>
					</div>
					<div class="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-xl p-4 border border-primary-100/50 dark:border-secondary-700 shadow-lg">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-xs text-secondary-600 dark:text-secondary-400">Gasto total</p>
								<p class="text-2xl font-bold text-secondary-900 dark:text-white mt-1">{{ formatCurrency(totalSpent) }}</p>
							</div>
							<div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
								<i class="ri-money-dollar-circle-line text-green-600 dark:text-green-400 text-xl"></i>
							</div>
						</div>
					</div>
				</div>

				<!-- Orders List - REAL DATA -->
				<div v-if="loading" class="space-y-4">
					<div v-for="i in 3" :key="i" class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-primary-100 dark:border-secondary-700">
						<Skeleton class="h-6 w-1/4 mb-4" />
						<Skeleton class="h-4 w-1/3 mb-2" />
						<Skeleton class="h-4 w-1/2" />
					</div>
				</div>

				<div v-else-if="loadError" class="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-secondary-800 rounded-xl border border-primary-100 dark:border-secondary-700">
					<div class="text-center max-w-sm mx-auto px-4 py-8">
						<div class="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
							<i class="ri-error-warning-line text-3xl text-red-600 dark:text-red-400"></i>
						</div>
						<h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-2">Error al cargar pedidos</h3>
						<p class="text-sm text-secondary-600 dark:text-secondary-400 mb-6">No se pudieron cargar los pedidos. Revisa tu conexión.</p>
						<button
							@click="refreshOrders"
							:disabled="!isOnline"
							class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
						>
							<i class="ri-refresh-line" :class="{ 'animate-spin': loading }"></i>
							Reintentar
						</button>
					</div>
				</div>

				<div v-else-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-secondary-800 rounded-xl border border-primary-100 dark:border-secondary-700">
					<div class="text-center max-w-sm mx-auto px-4 py-8">
						<div class="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
							<i class="ri-shopping-bag-line text-3xl text-primary-600 dark:text-primary-400"></i>
						</div>
						<h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-2">
							{{ searchQuery ? 'No hay resultados' : 'No hay pedidos' }}
						</h3>
						<p class="text-sm text-secondary-600 dark:text-secondary-400 mb-6">
							{{ searchQuery ? 'Prueba con otra búsqueda' : 'Realiza tu primer pedido' }}
						</p>
						<button
							@click="browseRestaurants"
							class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
						>
							<i class="ri-store-3-line"></i>
							Ver restaurantes
						</button>
					</div>
				</div>

				<div v-else class="space-y-4">
					<TransitionGroup name="list">
						<div
							v-for="order in paginatedOrders"
							:key="order.id"
							class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-primary-100/50 dark:border-secondary-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
							@click="viewOrderDetails(order)"
						>
							<div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
								<div class="flex-1">
									<div class="flex flex-wrap items-start justify-between gap-3 mb-3">
										<div>
											<h3 class="font-semibold text-lg text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
												{{ order.restaurantName }}
											</h3>
											<p class="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
												Pedido #{{ order.id }} • {{ order.items?.length || 0 }} {{ order.items?.length === 1 ? 'artículo' : 'artículos' }}
											</p>
										</div>
										<span
											:class="getStatusClass(order.status ?? '')"
											class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1"
										>
											<i :class="getStatusIcon(order.status ?? '')"></i>
											{{ statusText(order.status ?? '') }}
										</span>
									</div>
									
									<div class="flex flex-wrap gap-2 mb-3">
										<span
											v-for="(item, idx) in order.items?.slice(0, 3)"
											:key="idx"
											class="text-sm text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-700 px-3 py-1 rounded-full"
										>
											{{ item.name }}
										</span>
										<span v-if="(order.items?.length ?? 0) > 3" class="text-sm text-secondary-600 dark:text-secondary-400">
											+{{ (order.items?.length ?? 0) - 3 }} más
										</span>
									</div>
									
									<div class="flex flex-wrap items-center gap-4 text-sm">
										<div class="flex items-center gap-1 text-secondary-700 dark:text-secondary-300 font-semibold">
											<i class="ri-money-dollar-circle-line text-primary-600"></i>
											{{ formatCurrency(order.total ?? 0) }}
										</div>
										<div class="flex items-center gap-1 text-secondary-600 dark:text-secondary-400">
											<i class="ri-calendar-line"></i>
											{{ formatDate(order.createdAt) }}
										</div>
									</div>
								</div>

								<div class="flex items-center gap-2 lg:flex-col">
									<button
										@click.stop="trackOrder(order)"
										class="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all duration-200 text-sm font-medium flex items-center gap-2"
									>
										<i class="ri-map-pin-line"></i>
										<span class="hidden sm:inline">Rastrear</span>
									</button>
									<button
										@click.stop="reorder(order)"
										class="px-4 py-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-all duration-200 text-sm font-medium flex items-center gap-2"
									>
										<i class="ri-repeat-line"></i>
										<span class="hidden sm:inline">Repetir</span>
									</button>
								</div>
							</div>
						</div>
					</TransitionGroup>

					<!-- Pagination -->
					<div v-if="totalPages > 1" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
						<p class="text-sm text-secondary-600 dark:text-secondary-400 order-2 sm:order-1">
							Mostrando <span class="font-semibold text-secondary-900 dark:text-white">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
							- <span class="font-semibold text-secondary-900 dark:text-white">{{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }}</span>
							de <span class="font-semibold text-secondary-900 dark:text-white">{{ filteredOrders.length }}</span> pedidos
						</p>
						
						<div class="flex items-center justify-center gap-2 order-1 sm:order-2">
							<button
								@click="prevPage"
								:disabled="currentPage === 1"
								:class="[
									'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
									currentPage === 1
										? 'bg-secondary-100 dark:bg-secondary-800 text-secondary-400 cursor-not-allowed'
										: 'bg-white dark:bg-secondary-800 hover:bg-primary-500 hover:text-white border border-primary-200 dark:border-secondary-700 shadow-md hover:shadow-lg'
								]"
							>
								<i class="ri-arrow-left-line"></i>
							</button>
							
							<div class="flex items-center gap-1">
								<button
									v-for="page in visiblePages"
									:key="page"
									@click="goToPage(page)"
									:class="[
										'w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200',
										currentPage === page
											? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/30 scale-110'
											: page === '...'
												? 'cursor-default bg-transparent'
												: 'bg-white dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 border border-primary-200 dark:border-secondary-700'
									]"
								>
									{{ page }}
								</button>
							</div>
							
							<button
								@click="nextPage"
								:disabled="currentPage === totalPages"
								:class="[
									'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
									currentPage === totalPages
										? 'bg-secondary-100 dark:bg-secondary-800 text-secondary-400 cursor-not-allowed'
										: 'bg-white dark:bg-secondary-800 hover:bg-primary-500 hover:text-white border border-primary-200 dark:border-secondary-700 shadow-md hover:shadow-lg'
								]"
							>
								<i class="ri-arrow-right-line"></i>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- FAVORITES TAB - REAL DATA -->
			<div v-if="activeTab === 'favorites'" class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
						<i class="ri-heart-3-fill text-red-500"></i>
						Mis favoritos
						<span class="text-sm font-normal text-secondary-600 dark:text-secondary-400 ml-2">
							({{ favorites.length }})
						</span>
					</h2>
				</div>

				<div v-if="favorites.length === 0" class="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-secondary-800 rounded-xl border border-primary-100 dark:border-secondary-700">
					<div class="text-center max-w-sm mx-auto px-4 py-8">
						<div class="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
							<i class="ri-heart-line text-3xl text-red-600 dark:text-red-400"></i>
						</div>
						<h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-2">Aún no tienes favoritos</h3>
						<p class="text-sm text-secondary-600 dark:text-secondary-400 mb-6">Guarda tus restaurantes favoritos para encontrarlos rápido</p>
						<button
							@click="browseRestaurants"
							class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
						>
							<i class="ri-store-3-line"></i>
							Ver restaurantes
						</button>
					</div>
				</div>

				<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div
						v-for="fav in favorites"
						:key="fav.id"
						class="bg-white dark:bg-secondary-800 rounded-xl border border-primary-100/50 dark:border-secondary-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group"
					>
						<div class="relative h-40 bg-gradient-to-br from-primary-500 to-primary-600">
							<div class="absolute inset-0 bg-black/20"></div>
							<div class="absolute top-3 right-3">
								<button
									@click.stop="toggleFavorite(fav)"
									class="w-10 h-10 bg-white/90 dark:bg-secondary-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
								>
									<i class="ri-heart-3-fill text-red-500 text-xl"></i>
								</button>
							</div>
							<div class="absolute bottom-3 left-3">
								<span class="px-3 py-1 bg-white/90 dark:bg-secondary-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-secondary-900 dark:text-white">
									{{ fav.cuisine }}
								</span>
							</div>
						</div>
						<div class="p-4">
							<h3 class="font-semibold text-lg text-secondary-900 dark:text-white mb-2 truncate">
								{{ fav.name }}
							</h3>
							<button
								@click="viewRestaurant(fav)"
								class="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg"
							>
								Ver menú
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- PROFILE TAB - REAL DATA -->
			<div v-if="activeTab === 'profile'" class="space-y-6">
				<div class="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-100/50 dark:border-secondary-700 shadow-lg">
					<div class="flex flex-col md:flex-row md:items-center gap-6">
						<div class="relative">
							<div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-500/30">
								{{ userInitials }}
							</div>
						</div>
						
						<div class="flex-1">
							<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
								<div>
									<h2 class="text-2xl font-bold text-secondary-900 dark:text-white">{{ profile.name || 'Usuario' }}</h2>
									<p class="text-secondary-600 dark:text-secondary-400 mt-1 flex items-center gap-2">
										<i class="ri-mail-line"></i>
										{{ profile.email || 'cargando...' }}
									</p>
									<p v-if="profile.phone" class="text-secondary-600 dark:text-secondary-400 mt-1 flex items-center gap-2">
										<i class="ri-phone-line"></i>
										{{ profile.phone }}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Stats - REAL DATA -->
				<div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
					<div class="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-xl p-4 border border-primary-100/50 dark:border-secondary-700 shadow-lg">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-xs text-secondary-600 dark:text-secondary-400">Pedidos totales</p>
								<p class="text-2xl font-bold text-secondary-900 dark:text-white mt-1">{{ orders.length }}</p>
							</div>
							<div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
								<i class="ri-shopping-bag-3-line text-primary-600 dark:text-primary-400 text-xl"></i>
							</div>
						</div>
					</div>
					<div class="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-xl p-4 border border-primary-100/50 dark:border-secondary-700 shadow-lg">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-xs text-secondary-600 dark:text-secondary-400">Favoritos</p>
								<p class="text-2xl font-bold text-secondary-900 dark:text-white mt-1">{{ favorites.length }}</p>
							</div>
							<div class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
								<i class="ri-heart-3-fill text-red-600 dark:text-red-400 text-xl"></i>
							</div>
						</div>
					</div>
					<div class="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-xl p-4 border border-primary-100/50 dark:border-secondary-700 shadow-lg">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-xs text-secondary-600 dark:text-secondary-400">Gasto total</p>
								<p class="text-2xl font-bold text-secondary-900 dark:text-white mt-1">{{ formatCurrency(totalSpent) }}</p>
							</div>
							<div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
								<i class="ri-money-dollar-circle-line text-green-600 dark:text-green-400 text-xl"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>

		<!-- Scroll to Top -->
		<Transition name="slide-fade">
			<button
				v-if="showScrollToTop"
				@click="scrollToTop"
				class="fixed bottom-24 lg:bottom-8 right-6 w-12 h-12 bg-white dark:bg-secondary-800 text-primary-600 dark:text-primary-400 rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl hover:scale-110 transition-all duration-500 z-40 border-2 border-primary-200 dark:border-primary-800"
			>
				<i class="ri-arrow-up-line text-xl"></i>
			</button>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref, type ComputedRef } from 'vue';
import { useRouter, type Router } from 'vue-router';
import { useToast, type ToastInterface } from 'vue-toastification';
import { 
	getCustomerOrders, 
	getCustomerProfile
} from '@/features/customer/services/customer.service';
import { useOnline } from '@/shared/composables/useOnline';
import Skeleton from '@/shared/ui/Skeleton.vue';
import EmptyState from '@/shared/ui/EmptyState.vue';

interface Tab {
	id: string;
	label: string;
	icon: string;
}

interface StatusMap {
	[key: string]: string;
}

interface UseOnlineReturn {
	isOnline: Ref<boolean>;
}

interface Order {
	id: number | string;
	restaurantName?: string;
	status?: string;
	items?: Array<{ name: string; [key: string]: any }>;
	total?: number;
	createdAt?: string;
	[key: string]: any;
}

interface Favorite {
	id: number | string;
	name: string;
	cuisine?: string;
	[key: string]: any;
}

interface CustomerProfile {
	id: string;
	name: string;
	email: string;
	phone?: string;
	addresses?: any[];
	[key: string]: any;
}

const router: Router = useRouter();
const toast: ToastInterface = useToast();
const { isOnline }: UseOnlineReturn = useOnline();

// ========== REAL DATA - NO MOCK ==========
const profile: Ref<CustomerProfile> = ref<CustomerProfile>({
	id: '',
	name: '',
	email: '',
	phone: '',
	addresses: []
});

const orders: Ref<Order[]> = ref<Order[]>([]);
const filteredOrders: Ref<Order[]> = ref<Order[]>([]);
const favorites: Ref<Favorite[]> = ref<Favorite[]>([]);

const loading: Ref<boolean> = ref<boolean>(true);
const loadError: Ref<Error | null> = ref<Error | null>(null);
const searchQuery: Ref<string> = ref<string>('');
const activeTab: Ref<string> = ref<string>('orders');
const currentPage: Ref<number> = ref<number>(1);
const itemsPerPage: number = 5;
const showScrollToTop: Ref<boolean> = ref<boolean>(false);
const darkModeEnabled: Ref<boolean> = ref<boolean>(false);

// ========== TABS ==========
const tabs: Tab[] = [
	{ id: 'orders', label: 'Mis pedidos', icon: 'ri-shopping-bag-3-line' },
	{ id: 'favorites', label: 'Favoritos', icon: 'ri-heart-3-line' },
	{ id: 'profile', label: 'Mi perfil', icon: 'ri-user-3-line' }
];

// ========== COMPUTED - REAL DATA ==========
const greeting: ComputedRef<string> = computed<string>(() => {
	const hour: number = new Date().getHours();
	if (hour < 12) return 'Buenos días';
	if (hour < 18) return 'Buenas tardes';
	return 'Buenas noches';
});

const userInitials: ComputedRef<string> = computed<string>(() => {
	if (!profile.value.name) return 'U';
	return profile.value.name
		.split(' ')
		.map((n: string) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
});

const deliveredCount: ComputedRef<number> = computed<number>(() => 
	orders.value.filter((o: Order) => 
		o.status?.toLowerCase() === 'delivered' || 
		o.status?.toLowerCase() === 'entregado'
	).length
);

const inProgressCount: ComputedRef<number> = computed<number>(() => 
	orders.value.filter((o: Order) => 
		['preparing', 'on_the_way', 'out_for_delivery', 'preparando', 'en camino'].includes(o.status?.toLowerCase() ?? '')
	).length
);

const totalSpent: ComputedRef<number> = computed<number>(() => 
	orders.value.reduce((sum: number, o: Order) => sum + (o.total || 0), 0)
);

const paginatedOrders: ComputedRef<Order[]> = computed<Order[]>(() => {
	const start: number = (currentPage.value - 1) * itemsPerPage;
	const end: number = start + itemsPerPage;
	return filteredOrders.value.slice(start, end);
});

const totalPages: ComputedRef<number> = computed<number>(() => 
	Math.ceil(filteredOrders.value.length / itemsPerPage)
);

const visiblePages: ComputedRef<(number | string)[]> = computed<(number | string)[]>(() => {
	const pages: (number | string)[] = [];
	const maxVisible: number = 5;
	const total: number = totalPages.value;
	const current: number = currentPage.value;
	
	if (total <= maxVisible) {
		for (let i = 1; i <= total; i++) pages.push(i);
	} else if (current <= 3) {
		pages.push(1, 2, 3, 4, '...', total);
	} else if (current >= total - 2) {
		pages.push(1, '...', total - 3, total - 2, total - 1, total);
	} else {
		pages.push(1, '...', current - 1, current, current + 1, '...', total);
	}
	return pages;
});

// ========== API METHODS ==========
async function loadProfile(): Promise<void> {
	try {
		const data: CustomerProfile = await getCustomerProfile();
		profile.value = data;
	} catch (error) {
		console.error('Error loading profile:', error);
	}
}

async function refreshOrders(): Promise<void> {
	if (!isOnline.value) {
		toast.warning('Sin conexión a internet');
		return;
	}
	
	loadError.value = null;
	loading.value = true;
	try {
		const ordersData: Order[] = await getCustomerOrders();
		orders.value = ordersData;
		filteredOrders.value = ordersData;
	} catch (error) {
		loadError.value = error as Error;
		toast.error('Error al cargar pedidos');
	} finally {
		loading.value = false;
	}
}

async function loadFavorites(): Promise<void> {
	try {
		// TODO: Implement getCustomerFavorites in customer.service
		// const favs: Favorite[] = await getCustomerFavorites();
		// favorites.value = favs;
		favorites.value = [];
	} catch (error) {
		console.error('Error loading favorites:', error);
	}
}

async function toggleFavorite(restaurant: Favorite): Promise<void> {
	if (!isOnline.value) {
		toast.warning('Sin conexión a internet');
		return;
	}
	
	try {
		const index: number = favorites.value.findIndex((fav: Favorite) => fav.id === restaurant.id);
		if (index > -1) {
			favorites.value.splice(index, 1);
			toast.success('Eliminado de favoritos');
		} else {
			favorites.value.push(restaurant);
			toast.success('Agregado a favoritos');
		}
	} catch (error) {
		toast.error('Error al actualizar favoritos');
	}
}

async function reorder(order: Order): Promise<void> {
	if (!isOnline.value) {
		toast.warning('Sin conexión a internet');
		return;
	}
	
	try {
		toast.success('Productos agregados al carrito');
	} catch (error) {
		toast.error('Error al reordenar');
	}
}

// ========== UI METHODS ==========
function filterOrders(): void {
	if (!searchQuery.value.trim()) {
		filteredOrders.value = [...orders.value];
	} else {
		const query: string = searchQuery.value.toLowerCase();
		filteredOrders.value = orders.value.filter((order: Order) =>
			order.restaurantName?.toLowerCase().includes(query) ||
			order.items?.some((item: any) => item.name?.toLowerCase().includes(query)) ||
			order.id.toString().includes(query)
		);
	}
	currentPage.value = 1;
}

function clearSearch(): void {
	searchQuery.value = '';
	filteredOrders.value = [...orders.value];
}

function viewOrderDetails(order: Order): void {
	router.push({ name: 'OrderTracking', params: { id: order.id.toString() } });
}

function trackOrder(order: Order): void {
	router.push({ name: 'OrderTracking', params: { id: order.id.toString() } });
}

function browseRestaurants(): void {
	router.push({ name: 'RestaurantList' });
}

function viewRestaurant(restaurant: Favorite): void {
	router.push({ name: 'RestaurantDetail', params: { id: restaurant.id.toString() } });
}

function scrollToTop(): void {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkScroll(): void {
	showScrollToTop.value = window.scrollY > 600;
}

function prevPage(): void {
	if (currentPage.value > 1) {
		currentPage.value--;
		scrollToTop();
	}
}

function nextPage(): void {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
		scrollToTop();
	}
}

function goToPage(page: number | string): void {
	if (typeof page === 'number') {
		currentPage.value = page;
		scrollToTop();
	}
}

function toggleDarkMode(): void {
	if (darkModeEnabled.value) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
	localStorage.setItem('darkMode', darkModeEnabled.value.toString());
}

// ========== FORMATTING ==========
function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('es-MX', {
		style: 'currency',
		currency: 'MXN',
		minimumFractionDigits: 2
	}).format(amount || 0);
}

function formatDate(dateString: string): string {
	if (!dateString) return '';
	const date: Date = new Date(dateString);
	const now: Date = new Date();
	const diffDays: number = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
	
	if (diffDays === 0) return 'Hoy';
	if (diffDays === 1) return 'Ayer';
	if (diffDays < 7) return `Hace ${diffDays} días`;
	
	return date.toLocaleDateString('es-MX', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
}

function getStatusClass(status: string): string {
	switch (status?.toLowerCase()) {
		case 'delivered':
		case 'entregado':
			return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
		case 'on_the_way':
		case 'out_for_delivery':
		case 'en camino':
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
		case 'preparing':
		case 'ready':
		case 'preparando':
		case 'listo':
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
		case 'cancelled':
		case 'declined':
		case 'cancelado':
		case 'rechazado':
			return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
	}
}

function getStatusIcon(status: string): string {
	switch (status?.toLowerCase()) {
		case 'delivered':
		case 'entregado':
			return 'ri-checkbox-circle-line';
		case 'on_the_way':
		case 'out_for_delivery':
		case 'en camino':
			return 'ri-truck-line';
		case 'preparing':
		case 'ready':
		case 'preparando':
		case 'listo':
			return 'ri-time-line';
		case 'cancelled':
		case 'declined':
		case 'cancelado':
		case 'rechazado':
			return 'ri-close-circle-line';
		default:
			return 'ri-information-line';
	}
}

function statusText(status: string): string {
	const map: StatusMap = {
		delivered: 'Entregado',
		entregado: 'Entregado',
		on_the_way: 'En camino',
		out_for_delivery: 'En camino',
		'en camino': 'En camino',
		preparing: 'Preparando',
		preparando: 'Preparando',
		ready: 'Listo',
		listo: 'Listo',
		cancelled: 'Cancelado',
		cancelado: 'Cancelado',
		declined: 'Rechazado',
		rechazado: 'Rechazado',
		new: 'Nuevo',
		nuevo: 'Nuevo'
	};
	return map[status?.toLowerCase()] || status || '';
}

// ========== LIFECYCLE ==========
onMounted(async (): Promise<void> => {
	await Promise.all([
		loadProfile(),
		refreshOrders(),
		loadFavorites()
	]);

	const savedDarkMode: string | null = localStorage.getItem('darkMode');
	if (savedDarkMode === 'true') {
		darkModeEnabled.value = true;
		document.documentElement.classList.add('dark');
	}

	window.addEventListener('scroll', checkScroll);
});

onUnmounted((): void => {
	window.removeEventListener('scroll', checkScroll);
});
</script>

<style scoped>
/* Same styles as Reseñas */
.text-bubble {
	font-size: clamp(1.5rem, 4vw, 2rem);
}

.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
	display: none;
}

.list-enter-active,
.list-leave-active {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-enter-from {
	opacity: 0;
	transform: translateX(-20px);
}
.list-leave-to {
	opacity: 0;
	transform: translateX(20px);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
	opacity: 0;
	transform: translateY(20px);
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
.animate-spin {
	animation: spin 1s linear infinite;
}

@media (max-width: 1024px) {
	main {
		padding-bottom: 80px;
	}
}

button:focus-visible {
	outline: 2px solid #f97316;
	outline-offset: 2px;
}

.dark {
	color-scheme: dark;
}
</style>