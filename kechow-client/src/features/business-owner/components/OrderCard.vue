<template>
	<div class="bg-card dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-lg">
		<!-- Order Header with Progress Indicator -->
		<div class="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-5 gap-3 sm:gap-4">
			<div class="flex items-start space-x-3 sm:space-x-4 flex-1">
				<!-- Order Icon with Status Badge -->
				<div class="relative flex-shrink-0">
					<div 
						:class="statusIconColor"
						class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm"
					>
						<i :class="statusIcon" class="text-white text-lg sm:text-xl"></i>
					</div>
					<div 
						v-if="isUrgentOrder"
						class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse"
					>
						<i class="ri-flashlight-line text-xs text-white"></i>
					</div>
				</div>
				
				<!-- Order Info -->
				<div class="flex-1 min-w-0">
					<div class="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 sm:gap-2 mb-2">
						<h3 class="font-bold text-gray-900 dark:text-white text-lg sm:text-xl truncate">
							#{{ order.id }}
						</h3>
						<div class="flex flex-wrap items-center gap-1 sm:gap-2">
							<span 
								:class="statusClasses"
								class="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap"
							>
								{{ $t(`${order.status}`) }}
							</span>
							<span v-if="order.isDelivery" class="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium whitespace-nowrap">
								<i class="ri-bike-line mr-1 text-xs"></i>{{ $t('delivery') }}
							</span>
							<span v-else class="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium whitespace-nowrap">
								<i class="ri-store-line mr-1 text-xs"></i>{{ $t('pickup') }}
							</span>
						</div>
					</div>
					
					<div class="space-y-1">
						<div class="flex items-center gap-1 sm:gap-2">
							<i class="ri-user-line text-gray-400 dark:text-gray-500 text-xs sm:text-sm"></i>
							<span class="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{{ order.customerName }}</span>
						</div>
						<div class="flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
							<div class="flex items-center gap-1">
								<i class="ri-time-line text-gray-400 dark:text-gray-500"></i>
								<span class="text-gray-600 dark:text-gray-400">{{ formatTimeAgo(order.createdAt) }}</span>
							</div>
							<span class="text-gray-300 dark:text-gray-600 hidden sm:inline">•</span>
							<div class="flex items-center gap-1">
								<i class="ri-phone-line text-gray-400 dark:text-gray-500"></i>
								<span class="text-gray-600 dark:text-gray-400">{{ formatPhone(order.phone) }}</span>
							</div>
						</div>
					</div>
					
					<!-- Special Instructions -->
					<div 
						v-if="order.specialInstructions" 
						class="mt-2 sm:mt-3 p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-r-lg"
					>
						<div class="flex items-start gap-1 sm:gap-2">
							<i class="ri-alert-line text-yellow-500 dark:text-yellow-400 mt-0.5 text-sm"></i>
							<p class="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">{{ order.specialInstructions }}</p>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Total Amount & Payment Status -->
			<div class="bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 min-w-0 w-full lg:w-auto lg:min-w-[140px]">
				<div class="text-center">
					<p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ $t('total') }}</p>
					<p class="font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white truncate">
						${{ order.totalAmount.toFixed(2) }} <span class="text-xs sm:text-sm">{{ $t('currency') }}</span>
					</p>
					<div class="mt-1 sm:mt-2">
						<span 
							:class="paymentStatusColor"
							class="px-2 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap"
						>
							<i :class="paymentIcon" class="mr-1 text-xs"></i>
							{{ $t(`payment.${order.paymentStatus}`) }}
						</span>
					</div>
					<p class="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 truncate">{{ order.paymentMethod }}</p>
				</div>
			</div>
		</div>

		<!-- Order Progress Bar -->
		<div class="mb-4 sm:mb-6">
			<div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
				<span :class="progressLabelClass(1)">{{ $t('orderStatus.placed') }}</span>
				<span :class="progressLabelClass(2)">{{ $t('orderStatus.preparing') }}</span>
				<span :class="progressLabelClass(3)">{{ $t('orderStatus.ready') }}</span>
				<span :class="progressLabelClass(4)" v-if="order.isDelivery">{{ $t('orderStatus.onRoute') }}</span>
				<span :class="progressLabelClass(order.isDelivery ? 5 : 4)">{{ $t('orderStatus.completed') }}</span>
			</div>
			<div class="h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div 
					:class="progressBarColor"
					class="h-full transition-all duration-500"
					:style="{ width: progressPercentage + '%' }"
				></div>
			</div>
		</div>

	<!-- Order Items -->
<div class="mb-4 sm:mb-5">
	<div class="flex flex-col xs:flex-row xs:items-center justify-between mb-2 sm:mb-3 gap-1 sm:gap-0">
		<h4 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base flex items-center gap-1 sm:gap-2">
			<i class="ri-shopping-basket-line text-sm sm:text-base"></i>
			{{ $t('orderItems', { count: order.items.length }) }}
		</h4>
		<button 
			@click="toggleItems"
			class="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 self-end xs:self-auto"
		>
			{{ showAllItems ? $t('showLess') : $t('showAll') }}
			<i :class="showAllItems ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'" class="text-sm"></i>
		</button>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
		<div 
			v-for="item in visibleItems"
			:key="item.id"
			class="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
		>
			<div class="flex items-center justify-between">
				<div class="flex-1 min-w-0">
					<p class="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{{ item.name }}</p>
					<div class="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
						<span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">x{{ item.quantity }}</span>
						<span class="text-gray-300 dark:text-gray-600 hidden sm:inline">•</span>
						<span class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">${{ (item.price * item.quantity).toFixed(2) }}</span>
					</div>
					<p v-if="item.specialRequest" class="text-xs text-gray-500 dark:text-gray-400 mt-1 italic truncate">
						{{ item.specialRequest }}
					</p>
				</div>
				<div v-if="item.ready" class="ml-2">
					<span class="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full block"></span>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Item Checklist Section -->
<div v-if="order.status === 'preparing' || order.status === 'ready'" class="mb-4 sm:mb-5">
	<div class="flex flex-col xs:flex-row xs:items-center justify-between mb-2 sm:mb-3 gap-1 sm:gap-0">
		<h4 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base flex items-center gap-1 sm:gap-2">
			<i class="ri-checkbox-circle-line text-sm sm:text-base"></i>
			{{ $t('preparationChecklist') }}
			<span class="text-xs font-normal text-gray-500 dark:text-gray-400">
				({{ preparedItemsCount }}/{{ order.items.length }})
			</span>
		</h4>
		<button 
			@click="toggleAllItems"
			class="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 self-end xs:self-auto"
		>
			{{ allItemsPrepared ? $t('uncheckAll') : $t('checkAll') }}
			<i :class="allItemsPrepared ? 'ri-checkbox-line' : 'ri-checkbox-blank-line'" class="text-sm"></i>
		</button>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
		<div 
			v-for="(item, index) in order.items"
			:key="item.id"
			class="flex items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
			@click="toggleItemPrepared(item.id)"
		>
			<div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
				<div 
					:class="item.prepared ? 'bg-primary-500 border-primary-500' : 'bg-card dark:bg-gray-600 border-gray-300 dark:border-gray-500'"
					class="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0"
				>
					<i v-if="item.prepared" class="ri-check-line text-white text-xs"></i>
				</div>
				<div class="flex-1 min-w-0">
					<p class="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{{ item.name }}</p>
					<div class="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5">
						<span class="text-xs text-gray-600 dark:text-gray-400">{{ $t('quantity') }}: {{ item.quantity }}</span>
						<span v-if="item.preparationTime" class="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">
							{{ item.preparationTime }} {{ $t('minutes') }}
						</span>
					</div>
				</div>
			</div>
			<div class="flex items-center gap-1 sm:gap-2 ml-2">
				<span class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
					${{ (item.price * item.quantity).toFixed(2) }}
				</span>
				<span class="text-xs text-gray-400 dark:text-gray-500">#{{ index + 1 }}</span>
			</div>
		</div>
	</div>
</div>

<!-- Delivery Driver Information Section -->
<div v-if="order.status === 'out_for_delivery' || order.status === 'ready'" class="mb-4 sm:mb-5">
	<div class="flex flex-col lg:flex-row gap-3 sm:gap-4">
		<!-- Driver Info Card -->
		<div class="flex-1 bg-gradient-to-r from-tertiary-50 to-tertiary-100 dark:from-tertiary-900/20 dark:to-tertiary-800/20 rounded-lg sm:rounded-xl border border-tertiary-200 dark:border-tertiary-700 p-3 sm:p-4">
			<div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
				<div class="flex items-start gap-2 sm:gap-3 flex-1">
					<div class="w-10 h-10 sm:w-12 sm:h-12 bg-tertiary-500 dark:bg-tertiary-600 rounded-lg flex items-center justify-center flex-shrink-0">
						<i class="ri-user-line text-white text-base sm:text-lg"></i>
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
							<h5 class="font-semibold text-tertiary-900 dark:text-tertiary-300 text-sm sm:text-base">{{ $t('deliveryDriver') }}</h5>
							<span v-if="order.driver?.status === 'active'" class="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full whitespace-nowrap">
								<i class="ri-circle-fill text-[6px] mr-1"></i>
								{{ $t('active') }}
							</span>
						</div>
						<p v-if="order.driver" class="text-tertiary-700 dark:text-tertiary-400 text-sm sm:text-base">
							{{ order.driver.name }}
						</p>
						<p v-else class="text-tertiary-600 dark:text-tertiary-500 text-xs sm:text-sm italic">
							{{ $t('noDriverAssigned') }}
						</p>
						<div v-if="order.driver" class="flex flex-wrap items-center gap-2 mt-2">
							<button 
								@click="callDriver"
								class="flex items-center gap-1 text-xs sm:text-sm text-tertiary-600 dark:text-tertiary-400 hover:text-tertiary-700 dark:hover:text-tertiary-300"
							>
								<i class="ri-phone-line text-sm"></i>
								{{ formatPhone(order.driver.phone) }}
							</button>
							<button 
								@click="messageDriver"
								class="flex items-center gap-1 text-xs sm:text-sm text-tertiary-600 dark:text-tertiary-400 hover:text-tertiary-700 dark:hover:text-tertiary-300"
							>
								<i class="ri-message-line text-sm"></i>
								{{ $t('message') }}
							</button>
						</div>
					</div>
				</div>
				<!-- QR Code for Order Pickup -->
				<div class="flex flex-col items-center self-center">
					<div class="w-16 h-16 sm:w-20 sm:h-20 bg-card dark:bg-gray-700 p-1.5 sm:p-2 rounded-lg border border-tertiary-300 dark:border-tertiary-600 mb-1 sm:mb-2">
						<div class="w-full h-full bg-gradient-to-br from-tertiary-400 to-tertiary-600 dark:from-tertiary-500 dark:to-tertiary-700 rounded flex items-center justify-center">
							<span class="text-white font-bold text-xs">QR</span>
						</div>
					</div>
					<span class="text-xs text-tertiary-700 dark:text-tertiary-400 font-medium">#{{ order.id }}</span>
					<span class="text-xs text-tertiary-500 dark:text-tertiary-500">{{ $t('scanToVerify') }}</span>
				</div>
			</div>
			
			<!-- Delivery Code Display -->
			<div v-if="order.deliveryCode" class="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-tertiary-300 dark:border-tertiary-600">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					<div class="flex-1 min-w-0">
						<p class="text-xs sm:text-sm text-tertiary-600 dark:text-tertiary-400">{{ $t('pickupCode') }}</p>
						<p class="font-bold text-xl sm:text-2xl text-tertiary-900 dark:text-tertiary-300 tracking-wider truncate">
							{{ order.deliveryCode }}
						</p>
					</div>
					<button 
						@click="copyDeliveryCode"
						class="px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-tertiary-500 hover:bg-tertiary-600 dark:bg-tertiary-600 dark:hover:bg-tertiary-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
					>
						<i class="ri-file-copy-line text-sm"></i>
						{{ $t('copy') }}
					</button>
				</div>
				<p class="text-xs text-tertiary-500 dark:text-tertiary-500 mt-1 sm:mt-2">
					{{ $t('pickupCodeDescription') }}
				</p>
			</div>
		</div>
		
		<!-- Estimated Delivery Time -->
		<div v-if="order.status === 'out_for_delivery'" class="bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 rounded-lg sm:rounded-xl border border-secondary-200 dark:border-secondary-700 p-3 sm:p-4 min-w-0 w-full lg:min-w-[180px]">
			<div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
				<div class="w-8 h-8 sm:w-10 sm:h-10 bg-secondary-500 dark:bg-secondary-600 rounded-lg flex items-center justify-center flex-shrink-0">
					<i class="ri-bike-line text-white text-sm sm:text-base"></i>
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">{{ $t('estimatedDelivery') }}</p>
					<p class="font-bold text-base sm:text-lg text-secondary-900 dark:text-secondary-300 truncate">
						{{ order.estimatedDelivery ? formatDeliveryTime(order.estimatedDelivery) : $t('notAvailable') }}
					</p>
				</div>
			</div>
			<div class="space-y-1 sm:space-y-2">
				<div class="flex items-center justify-between text-xs">
					<span class="text-secondary-600 dark:text-secondary-400">{{ $t('driverRating') }}</span>
					<span class="text-secondary-900 dark:text-secondary-300 font-medium">
						{{ order.driver?.rating || $t('notAvailable') }} ⭐
					</span>
				</div>
				<div class="flex items-center justify-between text-xs">
					<span class="text-secondary-600 dark:text-secondary-400">{{ $t('vehicle') }}</span>
					<span class="text-secondary-900 dark:text-secondary-300 font-medium truncate">
						{{ order.driver?.vehicle || $t('motorcycle') }}
					</span>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Action Buttons -->
<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-gray-200 dark:border-gray-700">
	<!-- Quick Actions -->
	<div class="flex flex-wrap gap-1 sm:gap-2">
		<button
			@click="callCustomer"
			class="flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-lg font-medium transition-colors whitespace-nowrap flex-1 xs:flex-none"
			:title="$t('callCustomer')"
		>
			<i class="ri-phone-line text-sm sm:text-base"></i>
			<span class="text-xs sm:text-sm">{{ $t('call') }}</span>
		</button>
		<button
			@click="messageCustomer"
			class="flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-secondary-100 dark:bg-secondary-900/30 hover:bg-secondary-200 dark:hover:bg-secondary-900/50 text-secondary-700 dark:text-secondary-300 rounded-lg font-medium transition-colors whitespace-nowrap flex-1 xs:flex-none"
			:title="$t('messageCustomer')"
		>
			<i class="ri-message-line text-sm sm:text-base"></i>
			<span class="text-xs sm:text-sm">{{ $t('message') }}</span>
		</button>
		<button
			@click="printOrder"
			class="flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-tertiary-100 dark:bg-tertiary-900/30 hover:bg-tertiary-200 dark:hover:bg-tertiary-900/50 text-tertiary-700 dark:text-tertiary-300 rounded-lg font-medium transition-colors whitespace-nowrap flex-1 xs:flex-none"
			:title="$t('printOrder')"
		>
			<i class="ri-printer-line text-sm sm:text-base"></i>
			<span class="text-xs sm:text-sm">{{ $t('print') }}</span>
		</button>
		<button
			v-if="order.isDelivery"
			@click="assignDriver"
			class="flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors whitespace-nowrap flex-1 xs:flex-none"
			:title="$t('assignDriver')"
		>
			<i class="ri-user-line text-sm sm:text-base"></i>
			<span class="text-xs sm:text-sm">{{ $t('assign') }}</span>
		</button>
	</div>
	
	<!-- Status Control Buttons -->
	<div class="flex flex-wrap gap-1 sm:gap-2 justify-end">
		<button
			v-if="order.status === 'new'"
			@click="updateStatus('declined')"
			class="px-3 py-2 sm:px-5 sm:py-2.5 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap flex-1 xs:flex-none"
		>
			<i class="ri-close-line text-sm sm:text-base"></i>
			<span class="text-xs sm:text-sm">{{ $t('btnDecline') }}</span>
		</button>
		<button
			v-if="order.status === 'new'"
			@click="updateStatus('preparing')"
			class="px-3 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap flex-1 xs:flex-none"
		>
			<i class="ri-check-line text-sm sm:text-base"></i>
			<span class="text-xs sm:text-sm">{{ $t('btnAccept') }}</span>
			<span class="hidden sm:inline">{{ $t('andStart') }}</span>
		</button>
		<button
			v-if="order.status === 'preparing'"
			@click="updateStatus('ready')"
			class="px-3 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap flex-1 xs:flex-none"
		>
			<i class="ri-check-double-line text-sm sm:text-base"></i>
			<span class="text-xs sm:text-sm">{{ $t('btnMarkReady') }}</span>
		</button>
		<button
			v-if="order.status === 'ready' && order.isDelivery"
			@click="updateStatus('out_for_delivery')"
			class="px-3 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap flex-1 xs:flex-none"
		>
			<i class="ri-bike-line text-sm sm:text-base"></i>
			<span class="text-xs sm:text-sm">{{ $t('btnOutForDelivery') }}</span>
		</button>
		<button
			v-if="order.status === 'ready' && !order.isDelivery"
			@click="updateStatus('delivered')"
			class="px-3 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap flex-1 xs:flex-none"
		>
			<i class="ri-checkbox-circle-line text-sm sm:text-base"></i>
			<span class="text-xs sm:text-sm">{{ $t('pickupComplete') }}</span>
		</button>
		<button
			v-if="order.status === 'out_for_delivery'"
			@click="updateStatus('delivered')"
			class="px-3 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap flex-1 xs:flex-none"
		>
			<i class="ri-checkbox-circle-line text-sm sm:text-base"></i>
			<span class="text-xs sm:text-sm">{{ $t('btnMarkDelivered') }}</span>
		</button>
	</div>
</div>

<!-- Estimated Time Display -->
<div v-if="order.estimatedTime" class="mt-3 sm:mt-4 p-2 sm:p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
	<div class="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
		<div class="flex items-center gap-2 sm:gap-3">
			<div class="w-8 h-8 sm:w-10 sm:h-10 bg-card dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
				<i class="ri-time-line text-gray-600 dark:text-gray-400 text-sm sm:text-base"></i>
			</div>
			<div>
				<p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ $t('estimatedCompletion') }}</p>
				<p class="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{{ formatTime(order.estimatedTime) }}</p>
			</div>
		</div>
		<button 
			@click="updateTime"
			class="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 font-medium whitespace-nowrap"
		>
			{{ $t('updateTime') }}
		</button>
	</div>
</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Order, OrderItem } from '../types';

const { t } = useI18n();

// Extend OrderItem to include prepared property
interface ExtendedOrderItem extends OrderItem {
	prepared?: boolean;
	ready?: boolean;
	preparationTime?: number;
	specialRequest?: string;
}

interface ExtendedOrder extends Order {
	items: ExtendedOrderItem[];
	isDelivery?: boolean;
	estimatedTime?: string;
	driver?: {
		name: string;
		phone: string;
		status?: string;
		rating?: number;
		vehicle?: string;
	};
	deliveryCode?: string;
	estimatedDelivery?: string;
}

const props = defineProps<{ 
	order: ExtendedOrder;
}>();
const emit = defineEmits<{
	(event: 'update-status', orderId: string, newStatus: string): void;
	(event: 'update-time', orderId: string): void;
	(event: 'print-order', orderId: string): void;
	(event: 'assign-driver', orderId: string): void;
	(event: 'toggle-item-prepared', orderId: string, itemId: string): void;
	(event: 'toggle-all-items', orderId: string, prepared: boolean): void;
}>();

const showAllItems = ref(false);

// Computed properties
const visibleItems = computed(() => {
	return showAllItems.value 
		? props.order.items 
		: props.order.items.slice(0, 4);
});

const statusClasses = computed(() => {
	const statusMap: Record<string, string> = {
		new: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700',
		preparing: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700',
		ready: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700',
		out_for_delivery: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700',
		delivered: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600',
		declined: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700',
		cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700',
	};
	return statusMap[props.order.status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
});

const statusIcon = computed(() => {
	const iconMap: Record<string, string> = {
		new: 'ri-timer-line',
		preparing: 'ri-restaurant-line',
		ready: 'ri-checkbox-circle-line',
		out_for_delivery: 'ri-bike-line',
		delivered: 'ri-check-double-line',
		declined: 'ri-close-circle-line',
		cancelled: 'ri-close-circle-line',
	};
	return iconMap[props.order.status] || 'ri-question-line';
});

const statusIconColor = computed(() => {
	const colorMap: Record<string, string> = {
		new: 'bg-gradient-to-br from-blue-500 to-blue-600',
		preparing: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
		ready: 'bg-gradient-to-br from-green-500 to-green-600',
		out_for_delivery: 'bg-gradient-to-br from-purple-500 to-purple-600',
		delivered: 'bg-gradient-to-br from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700',
		declined: 'bg-gradient-to-br from-red-500 to-red-600',
		cancelled: 'bg-gradient-to-br from-red-500 to-red-600',
	};
	return colorMap[props.order.status] || 'bg-gradient-to-br from-gray-500 to-gray-600';
});

const paymentStatusColor = computed(() => {
	const colorMap: Record<string, string> = {
		paid: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
		pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
		failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
		refunded: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
	};
	return colorMap[props.order.paymentStatus] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
});

const paymentIcon = computed(() => {
	const iconMap: Record<string, string> = {
		paid: 'ri-checkbox-circle-line',
		pending: 'ri-time-line',
		failed: 'ri-close-circle-line',
		refunded: 'ri-refresh-line',
	};
	return iconMap[props.order.paymentStatus] || 'ri-question-line';
});

const isUrgentOrder = computed(() => {
	const created = new Date(props.order.createdAt);
	const now = new Date();
	const diffMinutes = (now.getTime() - created.getTime()) / (1000 * 60);
	return diffMinutes > 15 && props.order.status === 'new';
});

const progressPercentage = computed(() => {
	const progressMap: Record<string, number> = {
		new: 20,
		preparing: 40,
		ready: props.order.isDelivery ? 60 : 80,
		out_for_delivery: 80,
		delivered: 100,
		declined: 0,
		cancelled: 0,
	};
	return progressMap[props.order.status] || 0;
});

const progressBarColor = computed(() => {
	const colorMap: Record<string, string> = {
		new: 'bg-blue-500',
		preparing: 'bg-yellow-500',
		ready: 'bg-green-500',
		out_for_delivery: 'bg-purple-500',
		delivered: 'bg-gray-500 dark:bg-gray-600',
	};
	return colorMap[props.order.status] || 'bg-gray-500';
});

// Add these computed properties
const preparedItemsCount = computed(() => {
	return props.order.items.filter(item => item.prepared).length;
});

const allItemsPrepared = computed(() => {
	return props.order.items.length > 0 && 
		   props.order.items.every(item => item.prepared);
});

// Methods
const progressLabelClass = (step: number) => {
	const currentStep = progressPercentage.value / (props.order.isDelivery ? 20 : 25);
	return step <= currentStep ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-400 dark:text-gray-500';
};

const formatTimeAgo = (date: string) => {
	const now = new Date();
	const orderDate = new Date(date);
	const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));

	if (diffInMinutes < 1) return t('justNow');
	if (diffInMinutes < 60) return t('minutesAgo', { minutes: diffInMinutes });
	if (diffInMinutes < 1440) return t('hoursAgo', { hours: Math.floor(diffInMinutes / 60) });
	return t('daysAgo', { days: Math.floor(diffInMinutes / 1440) });
};

const formatPhone = (phone: string) => {
	// Format phone number for display
	return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};

const formatDistance = (distance?: number) => {
	if (!distance) return t('nearby');
	return t('distanceKm', { distance: distance.toFixed(1) });
};

const formatTime = (time: string) => {
	const date = new Date(time);
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const toggleItems = () => {
	showAllItems.value = !showAllItems.value;
};

const updateStatus = (newStatus: string) => {
	emit('update-status', props.order.id, newStatus);
};

const updateTime = () => {
	emit('update-time', props.order.id);
};

const printOrder = () => {
	emit('print-order', props.order.id);
};

const assignDriver = () => {
	emit('assign-driver', props.order.id);
};

// Add these methods
const toggleItemPrepared = (itemId: string) => {
	emit('toggle-item-prepared', props.order.id, itemId);
};

const toggleAllItems = () => {
	emit('toggle-all-items', props.order.id, !allItemsPrepared.value);
};

const formatDeliveryTime = (time: string) => {
	const date = new Date(time);
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const callDriver = () => {
	if (props.order.driver?.phone) {
		window.open(`tel:${props.order.driver.phone}`, '_blank');
	}
};

const messageDriver = () => {
	if (props.order.driver?.phone) {
		window.open(`sms:${props.order.driver.phone}`, '_blank');
	}
};

const copyDeliveryCode = async () => {
	if (props.order.deliveryCode) {
		try {
			await navigator.clipboard.writeText(props.order.deliveryCode);
			// You could add a toast notification here
			console.log('Delivery code copied to clipboard');
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	}
};

const callCustomer = () => window.open(`tel:${props.order.phone}`, '_blank');
const messageCustomer = () => window.open(`sms:${props.order.phone}`, '_blank');
const openMap = () => {
	// Open in Google Maps
	const address = encodeURIComponent(props.order.address);
	window.open(`https://maps.google.com/?q=${address}`, '_blank');
};
</script>

<style scoped>
/* Smooth transitions */
button, div {
	transition: all 0.2s ease;
}

/* Better hover effects */
button:hover {
	transform: translateY(-1px);
}

/* Improve touch targets on mobile */
@media (max-width: 640px) {
	button {
		min-height: 44px;
		min-width: 44px;
	}
}

/* Responsive text sizing */
@media (max-width: 768px) {
	.text-xl {
		font-size: 1.25rem;
	}
	.text-2xl {
		font-size: 1.5rem;
	}
	.text-3xl {
		font-size: 1.75rem;
	}
}

/* Improve readability on small screens */
@media (max-width: 640px) {
	.whitespace-nowrap {
		white-space: normal;
	}
}

/* Loading animation for progress bar */
@keyframes progress-pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.7; }
}

.bg-gradient-to-br {
	background-size: 200% 200%;
	animation: gradient-shift 2s ease infinite;
}

@keyframes gradient-shift {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}

/* Hide scrollbar but allow scrolling */
.overflow-x-auto::-webkit-scrollbar {
	display: none;
}

.overflow-x-auto {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>