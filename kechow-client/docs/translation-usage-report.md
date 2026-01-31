# Text to replace with correct Spanish content (no translation)

Found 1327 translation usages in 35 files.

Replace each t(...) / $t(...) with the suggested Spanish (or your own).
Then remove useI18n() where no longer needed.

---

## src/components/RestaurantCard.vue

- **L84** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/auth/components/RegisterView.vue

- **L108** `t(key)` key: `email`
  → Suggested Spanish: **Correo electrónico**
  Snippet: t('email')

- **L153** `t(key)` key: `confirmPassword`
  → Suggested Spanish: **[ES: confirmPassword]**
  Snippet: t('confirmPassword')

- **L190** `t(key)` key: `owner`
  → Suggested Spanish: **Propietario**
  Snippet: <option value="owner">{{ t('owner') }}</option>

- **L191** `t(key)` key: `delivery`
  → Suggested Spanish: **Repartidor**
  Snippet: <option value="delivery">{{ t('delivery') }}</option>


## src/features/business-owner/components/charts/OrdersByHourChart.vue

- **L8** `t(key)` key: `ordersDistribution`
  → Suggested Spanish: **[ES: ordersDistribution]**
  Snippet: {{ t('ordersDistribution') }}

- **L20** `t(key)` key: `orders`
  → Suggested Spanish: **Pedidos**
  Snippet: <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('orders') }}</span>

- **L24** `t(key)` key: `revenue`
  → Suggested Spanish: **[ES: revenue]**
  Snippet: <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('revenue') }}</span>

- **L29** `t(key)` key: `peakHour`
  → Suggested Spanish: **[ES: peakHour]**
  Snippet: {{ t('peakHour') }}: {{ peakHour }}

- **L141** `t(key)` key: `orders`
  → Suggested Spanish: **Pedidos**
  Snippet: label: t('orders'),

- **L150** `t(key)` key: `revenue`
  → Suggested Spanish: **[ES: revenue]**
  Snippet: label: t('revenue'),

- **L185** `t(key)` key: `revenue`
  → Suggested Spanish: **[ES: revenue]**
  Snippet: if (label === t('revenue')) {

- **L65** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/charts/RevenueChart.vue

- **L21** `t(key)` key: `downloadChart`
  → Suggested Spanish: **[ES: downloadChart]**
  Snippet: :title="t('downloadChart')"

- **L47** `t(key)` key: `refreshData`
  → Suggested Spanish: **[ES: refreshData]**
  Snippet: {{ t('refreshData') }}

- **L66** `t(key)` key: `revenue`
  → Suggested Spanish: **[ES: revenue]**
  Snippet: <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('revenue') }}</span>

- **L70** `t(key)` key: `orders`
  → Suggested Spanish: **Pedidos**
  Snippet: <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('orders') }}</span>

- **L74** `t(key)` key: `avgOrderValue`
  → Suggested Spanish: **[ES: avgOrderValue]**
  Snippet: <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('avgOrderValue') }}</span>

- **L78** `t(key)` key: `change`
  → Suggested Spanish: **[ES: change]**
  Snippet: <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('change') }}</span>

- **L135** `t(key)` key: `hoverForDetails`
  → Suggested Spanish: **[ES: hoverForDetails]**
  Snippet: <span>{{ t('hoverForDetails') }}</span>

- **L139** `t(key)` key: `totalRevenue`
  → Suggested Spanish: **[ES: totalRevenue]**
  Snippet: <span>{{ t('totalRevenue') }}: <strong class="text-gray-900 dark:text-white">${{ formatCurrency(tota

- **L152** `t(key)` key: `changePeriod`
  → Suggested Spanish: **[ES: changePeriod]**
  Snippet: {{ t('changePeriod') }}

- **L305** `t(key)` key: `revenue`
  → Suggested Spanish: **[ES: revenue]**
  Snippet: label: t('revenue'),

- **L316** `t(key)` key: `average`
  → Suggested Spanish: **[ES: average]**
  Snippet: label: t('average'),

- **L388** `t(key)` key: `revenue`
  → Suggested Spanish: **[ES: revenue]**
  Snippet: label: t('revenue'),

- **L472** `t(key)` key: `average`
  → Suggested Spanish: **[ES: average]**
  Snippet: label: t('average'),

- **L280** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/charts/SalesByCategoryChart.vue

- **L8** `t(key)` key: `salesDistribution`
  → Suggested Spanish: **[ES: salesDistribution]**
  Snippet: {{ t('salesDistribution') }}

- **L44** `t(key)` key: `orders`
  → Suggested Spanish: **Pedidos**
  Snippet: {{ item.orders }} {{ t('orders') }}

- **L55** `t(key)` key: `totalSales`
  → Suggested Spanish: **[ES: totalSales]**
  Snippet: <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('totalSales') }}</p>

- **L59** `t(key)` key: `topCategory`
  → Suggested Spanish: **[ES: topCategory]**
  Snippet: <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('topCategory') }}</p>

- **L99** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/DashboardOverview.vue

- **L11** `t(key)` key: `dashboard`
  → Suggested Spanish: **Panel**
  Snippet: {{ t('dashboard') }}

- **L14** `t(key)` key: `subtitle`
  → Suggested Spanish: **Gestiona tu negocio**
  Snippet: {{ t('subtitle') }}

- **L22** `t(key)` key: `welcomeBack`
  → Suggested Spanish: **[ES: welcomeBack]**
  Snippet: {{ t('welcomeBack') }}, {{ authStore.user?.name || 'User' }}

- **L25** `t(key)` key: `lastLogin`
  → Suggested Spanish: **[ES: lastLogin]**
  Snippet: {{ t('lastLogin') }}: {{ formatLastLogin() }}

- **L94** `t(key)` key: `activeTab`
  → Suggested Spanish: **[ES: activeTab]**
  Snippet: {{ t('activeTab') }}: {{ tabs.find(t => t.active)?.label }}

- **L106** `t(key)` key: `recentOrders`
  → Suggested Spanish: **[ES: recentOrders]**
  Snippet: {{ t('recentOrders') }}

- **L109** `t(key)` key: `viewAll`
  → Suggested Spanish: **[ES: viewAll]**
  Snippet: {{ t('viewAll') }}

- **L126** `t(key)` key: `items`
  → Suggested Spanish: **artículos**
  Snippet: {{ order.time }} • {{ order.items }} {{ t('items') }}

- **L145** `t(key)` key: `swipeForMore`
  → Suggested Spanish: **[ES: swipeForMore]**
  Snippet: {{ t('swipeForMore') }}

- **L156** `t(key)` key: `weeklyRevenue`
  → Suggested Spanish: **[ES: weeklyRevenue]**
  Snippet: {{ t('weeklyRevenue') }}

- **L162** `t(key)` key: `week`
  → Suggested Spanish: **[ES: week]**
  Snippet: {{ t('week') }}

- **L167** `t(key)` key: `month`
  → Suggested Spanish: **[ES: month]**
  Snippet: {{ t('month') }}

- **L179** `t(key)` key: `revenueChartPlaceholder`
  → Suggested Spanish: **[ES: revenueChartPlaceholder]**
  Snippet: {{ t('revenueChartPlaceholder') }}

- **L207** `t(key)` key: `quickActions`
  → Suggested Spanish: **[ES: quickActions]**
  Snippet: {{ t('quickActions') }}

- **L210** `t(key)` key: `tapToAction`
  → Suggested Spanish: **[ES: tapToAction]**
  Snippet: {{ t('tapToAction') }}

- **L282** `t(key)` key: `todaysOrders`
  → Suggested Spanish: **[ES: todaysOrders]**
  Snippet: case t('todaysOrders'):

- **L285** `t(key)` key: `revenue`
  → Suggested Spanish: **[ES: revenue]**
  Snippet: case t('revenue'):

- **L314** `t(key)` key: `todaysOrders`
  → Suggested Spanish: **[ES: todaysOrders]**
  Snippet: label: t('todaysOrders'),

- **L316** `t(key)` key: `fromYesterday`
  → Suggested Spanish: **[ES: fromYesterday]**
  Snippet: change: `+12% ${t('fromYesterday')}`,

- **L322** `t(key)` key: `revenue`
  → Suggested Spanish: **[ES: revenue]**
  Snippet: label: t('revenue'),

- **L324** `t(key)` key: `fromYesterday`
  → Suggested Spanish: **[ES: fromYesterday]**
  Snippet: change: `+8% ${t('fromYesterday')}`,

- **L330** `t(key)` key: `avgOrder`
  → Suggested Spanish: **[ES: avgOrder]**
  Snippet: label: t('avgOrder'),

- **L332** `t(key)` key: `fromYesterday`
  → Suggested Spanish: **[ES: fromYesterday]**
  Snippet: change: `+3% ${t('fromYesterday')}`,

- **L338** `t(key)` key: `rating`
  → Suggested Spanish: **[ES: rating]**
  Snippet: label: t('rating'),

- **L340** `t(key)` key: `fromYesterday`
  → Suggested Spanish: **[ES: fromYesterday]**
  Snippet: change: `+0.2 ${t('fromYesterday')}`,

- **L350** `t(key)` key: `tabs.overview`
  → Suggested Spanish: **[ES: tabs.overview]**
  Snippet: label: t('tabs.overview'),

- **L354** `t(key)` key: `tabs.activeOrders`
  → Suggested Spanish: **[ES: tabs.activeOrders]**
  Snippet: label: t('tabs.activeOrders'),

- **L358** `t(key)` key: `tabs.menuManagement`
  → Suggested Spanish: **[ES: tabs.menuManagement]**
  Snippet: label: t('tabs.menuManagement'),

- **L362** `t(key)` key: `tabs.analytics`
  → Suggested Spanish: **[ES: tabs.analytics]**
  Snippet: label: t('tabs.analytics'),

- **L369** `t(key)` key: `tabs.overview`
  → Suggested Spanish: **[ES: tabs.overview]**
  Snippet: { id: 0, label: t('tabs.overview'), icon: 'ri-dashboard-line' },

- **L370** `t(key)` key: `tabs.activeOrders`
  → Suggested Spanish: **[ES: tabs.activeOrders]**
  Snippet: { id: 1, label: t('tabs.activeOrders'), icon: 'ri-shopping-cart-line' },

- **L371** `t(key)` key: `tabs.menuManagement`
  → Suggested Spanish: **[ES: tabs.menuManagement]**
  Snippet: { id: 2, label: t('tabs.menuManagement'), icon: 'ri-restaurant-line' },

- **L372** `t(key)` key: `tabs.analytics`
  → Suggested Spanish: **[ES: tabs.analytics]**
  Snippet: { id: 3, label: t('tabs.analytics'), icon: 'ri-bar-chart-line' },

- **L419** `t(key)` key: `days.mon`
  → Suggested Spanish: **[ES: days.mon]**
  Snippet: { label: t('days.mon'), value: 60 },

- **L420** `t(key)` key: `days.tue`
  → Suggested Spanish: **[ES: days.tue]**
  Snippet: { label: t('days.tue'), value: 85 },

- **L421** `t(key)` key: `days.wed`
  → Suggested Spanish: **[ES: days.wed]**
  Snippet: { label: t('days.wed'), value: 45 },

- **L422** `t(key)` key: `days.thu`
  → Suggested Spanish: **[ES: days.thu]**
  Snippet: { label: t('days.thu'), value: 90 },

- **L423** `t(key)` key: `days.fri`
  → Suggested Spanish: **[ES: days.fri]**
  Snippet: { label: t('days.fri'), value: 65 },

- **L424** `t(key)` key: `days.sat`
  → Suggested Spanish: **[ES: days.sat]**
  Snippet: { label: t('days.sat'), value: 100 },

- **L425** `t(key)` key: `days.sun`
  → Suggested Spanish: **[ES: days.sun]**
  Snippet: { label: t('days.sun'), value: 75 }

- **L427** `t(key)` key: `weeks.week1`
  → Suggested Spanish: **[ES: weeks.week1]**
  Snippet: { label: t('weeks.week1'), value: 70 },

- **L428** `t(key)` key: `weeks.week2`
  → Suggested Spanish: **[ES: weeks.week2]**
  Snippet: { label: t('weeks.week2'), value: 85 },

- **L429** `t(key)` key: `weeks.week3`
  → Suggested Spanish: **[ES: weeks.week3]**
  Snippet: { label: t('weeks.week3'), value: 60 },

- **L430** `t(key)` key: `weeks.week4`
  → Suggested Spanish: **[ES: weeks.week4]**
  Snippet: { label: t('weeks.week4'), value: 95 }

- **L438** `t(key)` key: `addItem`
  → Suggested Spanish: **[ES: addItem]**
  Snippet: label: t('addItem'),

- **L444** `t(key)` key: `manageMenu`
  → Suggested Spanish: **[ES: manageMenu]**
  Snippet: label: t('manageMenu'),

- **L450** `t(key)` key: `viewReports`
  → Suggested Spanish: **[ES: viewReports]**
  Snippet: label: t('viewReports'),

- **L456** `t(key)` key: `staffManagement`
  → Suggested Spanish: **[ES: staffManagement]**
  Snippet: label: t('staffManagement'),

- **L123** `t(key, params)` key: `orderNumber`
  → Suggested Spanish: **[ES: orderNumber]**
  Snippet: {{ t('orderNumber', { id: order.id }) }}

- **L136** `t(dynamic)` key: ``${order.status.toLowerCase().replace(' ', '')}``
  → Suggested Spanish: **[ES: `${order.status.toLowerCase().replace(' ', '')}`]**
  Snippet: {{ t(`${order.status.toLowerCase().replace(' ', '')}`) }}

- **L251** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/MenuItemCard.vue

- **L32** `t(key)` key: `setUnavailable`
  → Suggested Spanish: **[ES: setUnavailable]**
  Snippet: :aria-label="item.available ? $t('setUnavailable') : $t('setAvailable')"

- **L32** `t(key)` key: `setAvailable`
  → Suggested Spanish: **[ES: setAvailable]**
  Snippet: :aria-label="item.available ? $t('setUnavailable') : $t('setAvailable')"

- **L47** `t(key)` key: `popular`
  → Suggested Spanish: **[ES: popular]**
  Snippet: <i class="ri-fire-line mr-1"></i> {{ $t('popular') }}

- **L81** `t(key)` key: `minutes`
  → Suggested Spanish: **[ES: minutes]**
  Snippet: {{ item.preparationTime }} {{ $t('minutes') }}

- **L88** `t(key)` key: `calories`
  → Suggested Spanish: **[ES: calories]**
  Snippet: {{ item.calories }} {{ $t('calories') }}

- **L121** `t(key)` key: `menuItemAvailable`
  → Suggested Spanish: **[ES: menuItemAvailable]**
  Snippet: ? $t('menuItemAvailable')

- **L122** `t(key)` key: `menuItemOutOfStock`
  → Suggested Spanish: **[ES: menuItemOutOfStock]**
  Snippet: : $t('menuItemOutOfStock')

- **L132** `t(key)` key: `editItem`
  → Suggested Spanish: **[ES: editItem]**
  Snippet: :title="$t('editItem')"

- **L133** `t(key)` key: `editItem`
  → Suggested Spanish: **[ES: editItem]**
  Snippet: :aria-label="$t('editItem')"

- **L137** `t(key)` key: `edit`
  → Suggested Spanish: **[ES: edit]**
  Snippet: {{ $t('edit') }}

- **L143** `t(key)` key: `deleteItem`
  → Suggested Spanish: **[ES: deleteItem]**
  Snippet: :title="$t('deleteItem')"

- **L144** `t(key)` key: `deleteItem`
  → Suggested Spanish: **[ES: deleteItem]**
  Snippet: :aria-label="$t('deleteItem')"

- **L148** `t(key)` key: `delete`
  → Suggested Spanish: **[ES: delete]**
  Snippet: {{ $t('delete') }}

- **L156** `t(key)` key: `moreActions`
  → Suggested Spanish: **[ES: moreActions]**
  Snippet: :title="$t('moreActions')"

- **L157** `t(key)` key: `moreActions`
  → Suggested Spanish: **[ES: moreActions]**
  Snippet: :aria-label="$t('moreActions')"

- **L170** `t(key)` key: `duplicate`
  → Suggested Spanish: **[ES: duplicate]**
  Snippet: <i class="ri-file-copy-line"></i> {{ $t('duplicate') }}

- **L176** `t(key)` key: `viewDetails`
  → Suggested Spanish: **[ES: viewDetails]**
  Snippet: <i class="ri-eye-line"></i> {{ $t('viewDetails') }}

- **L182** `t(key)` key: `share`
  → Suggested Spanish: **[ES: share]**
  Snippet: <i class="ri-share-line"></i> {{ $t('share') }}

- **L195** `t(key)` key: `orders`
  → Suggested Spanish: **Pedidos**
  Snippet: <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('orders') }}</p>

- **L199** `t(key)` key: `rating`
  → Suggested Spanish: **[ES: rating]**
  Snippet: <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('rating') }}</p>

- **L205** `t(key)` key: `stock`
  → Suggested Spanish: **[ES: stock]**
  Snippet: <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('stock') }}</p>

- **L206** `t(key)` key: `unlimited`
  → Suggested Spanish: **[ES: unlimited]**
  Snippet: <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ item.stock || $t('unlimited') }}</

- **L259** `t(key, params)` key: `confirmDelete`
  → Suggested Spanish: **[ES: confirmDelete]**
  Snippet: if (confirm(t('confirmDelete', { item: props.item.name }))) {

- **L32** `$t(key)` key: `setUnavailable`
  → Suggested Spanish: **[ES: setUnavailable]**
  Snippet: :aria-label="item.available ? $t('setUnavailable') : $t('setAvailable')"

- **L32** `$t(key)` key: `setAvailable`
  → Suggested Spanish: **[ES: setAvailable]**
  Snippet: :aria-label="item.available ? $t('setUnavailable') : $t('setAvailable')"

- **L47** `$t(key)` key: `popular`
  → Suggested Spanish: **[ES: popular]**
  Snippet: <i class="ri-fire-line mr-1"></i> {{ $t('popular') }}

- **L81** `$t(key)` key: `minutes`
  → Suggested Spanish: **[ES: minutes]**
  Snippet: {{ item.preparationTime }} {{ $t('minutes') }}

- **L88** `$t(key)` key: `calories`
  → Suggested Spanish: **[ES: calories]**
  Snippet: {{ item.calories }} {{ $t('calories') }}

- **L121** `$t(key)` key: `menuItemAvailable`
  → Suggested Spanish: **[ES: menuItemAvailable]**
  Snippet: ? $t('menuItemAvailable')

- **L122** `$t(key)` key: `menuItemOutOfStock`
  → Suggested Spanish: **[ES: menuItemOutOfStock]**
  Snippet: : $t('menuItemOutOfStock')

- **L132** `$t(key)` key: `editItem`
  → Suggested Spanish: **[ES: editItem]**
  Snippet: :title="$t('editItem')"

- **L133** `$t(key)` key: `editItem`
  → Suggested Spanish: **[ES: editItem]**
  Snippet: :aria-label="$t('editItem')"

- **L137** `$t(key)` key: `edit`
  → Suggested Spanish: **[ES: edit]**
  Snippet: {{ $t('edit') }}

- **L143** `$t(key)` key: `deleteItem`
  → Suggested Spanish: **[ES: deleteItem]**
  Snippet: :title="$t('deleteItem')"

- **L144** `$t(key)` key: `deleteItem`
  → Suggested Spanish: **[ES: deleteItem]**
  Snippet: :aria-label="$t('deleteItem')"

- **L148** `$t(key)` key: `delete`
  → Suggested Spanish: **[ES: delete]**
  Snippet: {{ $t('delete') }}

- **L156** `$t(key)` key: `moreActions`
  → Suggested Spanish: **[ES: moreActions]**
  Snippet: :title="$t('moreActions')"

- **L157** `$t(key)` key: `moreActions`
  → Suggested Spanish: **[ES: moreActions]**
  Snippet: :aria-label="$t('moreActions')"

- **L170** `$t(key)` key: `duplicate`
  → Suggested Spanish: **[ES: duplicate]**
  Snippet: <i class="ri-file-copy-line"></i> {{ $t('duplicate') }}

- **L176** `$t(key)` key: `viewDetails`
  → Suggested Spanish: **[ES: viewDetails]**
  Snippet: <i class="ri-eye-line"></i> {{ $t('viewDetails') }}

- **L182** `$t(key)` key: `share`
  → Suggested Spanish: **[ES: share]**
  Snippet: <i class="ri-share-line"></i> {{ $t('share') }}

- **L195** `$t(key)` key: `orders`
  → Suggested Spanish: **Pedidos**
  Snippet: <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('orders') }}</p>

- **L199** `$t(key)` key: `rating`
  → Suggested Spanish: **[ES: rating]**
  Snippet: <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('rating') }}</p>

- **L205** `$t(key)` key: `stock`
  → Suggested Spanish: **[ES: stock]**
  Snippet: <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('stock') }}</p>

- **L206** `$t(key)` key: `unlimited`
  → Suggested Spanish: **[ES: unlimited]**
  Snippet: <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ item.stock || $t('unlimited') }}</

- **L18** `t(dynamic)` key: ``categories.${item.category.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '')}``
  → Suggested Spanish: **[ES: `categories.${item.category.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '')}`]**
  Snippet: {{ $t(`categories.${item.category.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '')}`) || item

- **L219** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/MenuModal.vue

- **L18** `t(key)` key: `addMenuItem`
  → Suggested Spanish: **[ES: addMenuItem]**
  Snippet: {{ mode === 'add' ? $t('addMenuItem') : $t('editMenuItem') }}

- **L18** `t(key)` key: `editMenuItem`
  → Suggested Spanish: **[ES: editMenuItem]**
  Snippet: {{ mode === 'add' ? $t('addMenuItem') : $t('editMenuItem') }}

- **L21** `t(key)` key: `addNewMenuItemDescription`
  → Suggested Spanish: **[ES: addNewMenuItemDescription]**
  Snippet: {{ mode === 'add' ? $t('addNewMenuItemDescription') : $t('editMenuItemDescription') }}

- **L21** `t(key)` key: `editMenuItemDescription`
  → Suggested Spanish: **[ES: editMenuItemDescription]**
  Snippet: {{ mode === 'add' ? $t('addNewMenuItemDescription') : $t('editMenuItemDescription') }}

- **L28** `t(key)` key: `close`
  → Suggested Spanish: **[ES: close]**
  Snippet: :aria-label="$t('close')"

- **L41** `t(key)` key: `name`
  → Suggested Spanish: **Nombre**
  Snippet: {{ $t('name') }} <span class="required-indicator">*</span>

- **L47** `t(key)` key: `namePlaceholder`
  → Suggested Spanish: **[ES: namePlaceholder]**
  Snippet: :placeholder="$t('namePlaceholder')"

- **L49** `t(key)` key: `name`
  → Suggested Spanish: **Nombre**
  Snippet: :aria-label="$t('name')"

- **L56** `t(key)` key: `category`
  → Suggested Spanish: **[ES: category]**
  Snippet: {{ $t('category') }} <span class="required-indicator">*</span>

- **L63** `t(key)` key: `category`
  → Suggested Spanish: **[ES: category]**
  Snippet: :aria-label="$t('category')"

- **L65** `t(key)` key: `selectCategory`
  → Suggested Spanish: **[ES: selectCategory]**
  Snippet: <option value="" disabled>{{ $t('selectCategory') }}</option>

- **L66** `t(key)` key: `appetizers`
  → Suggested Spanish: **[ES: appetizers]**
  Snippet: <option value="appetizers">{{ $t('appetizers') }}</option>

- **L67** `t(key)` key: `mainCourses`
  → Suggested Spanish: **[ES: mainCourses]**
  Snippet: <option value="main_courses">{{ $t('mainCourses') }}</option>

- **L68** `t(key)` key: `desserts`
  → Suggested Spanish: **[ES: desserts]**
  Snippet: <option value="desserts">{{ $t('desserts') }}</option>

- **L69** `t(key)` key: `drinks`
  → Suggested Spanish: **[ES: drinks]**
  Snippet: <option value="drinks">{{ $t('drinks') }}</option>

- **L70** `t(key)` key: `specials`
  → Suggested Spanish: **[ES: specials]**
  Snippet: <option value="specials">{{ $t('specials') }}</option>

- **L80** `t(key)` key: `description`
  → Suggested Spanish: **[ES: description]**
  Snippet: {{ $t('description') }}

- **L85** `t(key)` key: `descriptionPlaceholder`
  → Suggested Spanish: **[ES: descriptionPlaceholder]**
  Snippet: :placeholder="$t('descriptionPlaceholder')"

- **L87** `t(key)` key: `description`
  → Suggested Spanish: **[ES: description]**
  Snippet: :aria-label="$t('description')"

- **L96** `t(key)` key: `price`
  → Suggested Spanish: **[ES: price]**
  Snippet: {{ $t('price') }} <span class="required-indicator">*</span>

- **L108** `t(key)` key: `price`
  → Suggested Spanish: **[ES: price]**
  Snippet: :aria-label="$t('price')"

- **L116** `t(key)` key: `preparationTime`
  → Suggested Spanish: **[ES: preparationTime]**
  Snippet: {{ $t('preparationTime') }}

- **L125** `t(key)` key: `preparationTime`
  → Suggested Spanish: **[ES: preparationTime]**
  Snippet: :aria-label="$t('preparationTime')"

- **L127** `t(key)` key: `minutes`
  → Suggested Spanish: **[ES: minutes]**
  Snippet: <span class="input-suffix">{{ $t('minutes') }}</span>

- **L135** `t(key)` key: `tags`
  → Suggested Spanish: **[ES: tags]**
  Snippet: {{ $t('tags') }}

- **L159** `t(key)` key: `addTagPlaceholder`
  → Suggested Spanish: **[ES: addTagPlaceholder]**
  Snippet: :placeholder="$t('addTagPlaceholder')"

- **L162** `t(key)` key: `addTag`
  → Suggested Spanish: **[ES: addTag]**
  Snippet: :aria-label="$t('addTag')"

- **L168** `t(key)` key: `addTag`
  → Suggested Spanish: **[ES: addTag]**
  Snippet: :aria-label="$t('addTag')"

- **L170** `t(key)` key: `add`
  → Suggested Spanish: **[ES: add]**
  Snippet: {{ $t('add') }}

- **L179** `t(key)` key: `image`
  → Suggested Spanish: **[ES: image]**
  Snippet: {{ $t('image') }}

- **L188** `t(key)` key: `uploadImage`
  → Suggested Spanish: **[ES: uploadImage]**
  Snippet: :aria-label="$t('uploadImage')"

- **L195** `t(key)` key: `dragDropImage`
  → Suggested Spanish: **[ES: dragDropImage]**
  Snippet: <p class="upload-title">{{ $t('dragDropImage') }}</p>

- **L196** `t(key)` key: `orClickToUpload`
  → Suggested Spanish: **[ES: orClickToUpload]**
  Snippet: <p class="upload-subtitle">{{ $t('orClickToUpload') }}</p>

- **L199** `t(key)` key: `supportedFormats`
  → Suggested Spanish: **[ES: supportedFormats]**
  Snippet: {{ $t('supportedFormats') }}: PNG, JPG {{ $t('upTo') }} 5MB

- **L199** `t(key)` key: `upTo`
  → Suggested Spanish: **[ES: upTo]**
  Snippet: {{ $t('supportedFormats') }}: PNG, JPG {{ $t('upTo') }} 5MB

- **L203** `t(key)` key: `imagePreview`
  → Suggested Spanish: **[ES: imagePreview]**
  Snippet: <img :src="formData.image" :alt="$t('imagePreview')" class="preview-image">

- **L208** `t(key)` key: `removeImage`
  → Suggested Spanish: **[ES: removeImage]**
  Snippet: :aria-label="$t('removeImage')"

- **L210** `t(key)` key: `removeImage`
  → Suggested Spanish: **[ES: removeImage]**
  Snippet: {{ $t('removeImage') }}

- **L232** `t(key)` key: `availability`
  → Suggested Spanish: **[ES: availability]**
  Snippet: :aria-label="$t('availability')"

- **L235** `t(key)` key: `available`
  → Suggested Spanish: **[ES: available]**
  Snippet: <span class="toggle-text">{{ $t('available') }}</span>

- **L238** `t(key)` key: `availabilityDescription`
  → Suggested Spanish: **[ES: availabilityDescription]**
  Snippet: {{ $t('availabilityDescription') }}

- **L249** `t(key)` key: `specialItem`
  → Suggested Spanish: **[ES: specialItem]**
  Snippet: :aria-label="$t('specialItem')"

- **L252** `t(key)` key: `specialItem`
  → Suggested Spanish: **[ES: specialItem]**
  Snippet: <span class="toggle-text">{{ $t('specialItem') }}</span>

- **L255** `t(key)` key: `specialItemDescription`
  → Suggested Spanish: **[ES: specialItemDescription]**
  Snippet: {{ $t('specialItemDescription') }}

- **L265** `t(key)` key: `calories`
  → Suggested Spanish: **[ES: calories]**
  Snippet: {{ $t('calories') }}

- **L274** `t(key)` key: `calories`
  → Suggested Spanish: **[ES: calories]**
  Snippet: :aria-label="$t('calories')"

- **L276** `t(key)` key: `caloriesShort`
  → Suggested Spanish: **[ES: caloriesShort]**
  Snippet: <span class="input-suffix">{{ $t('caloriesShort') }}</span>

- **L283** `t(key)` key: `allergens`
  → Suggested Spanish: **[ES: allergens]**
  Snippet: {{ $t('allergens') }}

- **L289** `t(key)` key: `allergens`
  → Suggested Spanish: **[ES: allergens]**
  Snippet: :aria-label="$t('allergens')"

- **L291** `t(key)` key: `gluten`
  → Suggested Spanish: **[ES: gluten]**
  Snippet: <option value="gluten">{{ $t('gluten') }}</option>

- **L292** `t(key)` key: `dairy`
  → Suggested Spanish: **[ES: dairy]**
  Snippet: <option value="dairy">{{ $t('dairy') }}</option>

- **L293** `t(key)` key: `nuts`
  → Suggested Spanish: **[ES: nuts]**
  Snippet: <option value="nuts">{{ $t('nuts') }}</option>

- **L294** `t(key)` key: `soy`
  → Suggested Spanish: **[ES: soy]**
  Snippet: <option value="soy">{{ $t('soy') }}</option>

- **L295** `t(key)` key: `eggs`
  → Suggested Spanish: **[ES: eggs]**
  Snippet: <option value="eggs">{{ $t('eggs') }}</option>

- **L296** `t(key)` key: `fish`
  → Suggested Spanish: **[ES: fish]**
  Snippet: <option value="fish">{{ $t('fish') }}</option>

- **L297** `t(key)` key: `shellfish`
  → Suggested Spanish: **[ES: shellfish]**
  Snippet: <option value="shellfish">{{ $t('shellfish') }}</option>

- **L311** `t(key)` key: `cancel`
  → Suggested Spanish: **Cancelar**
  Snippet: :aria-label="$t('cancel')"

- **L313** `t(key)` key: `cancel`
  → Suggested Spanish: **Cancelar**
  Snippet: {{ $t('cancel') }}

- **L320** `t(key)` key: `addMenuItem`
  → Suggested Spanish: **[ES: addMenuItem]**
  Snippet: :aria-label="mode === 'add' ? $t('addMenuItem') : $t('saveChanges')"

- **L320** `t(key)` key: `saveChanges`
  → Suggested Spanish: **[ES: saveChanges]**
  Snippet: :aria-label="mode === 'add' ? $t('addMenuItem') : $t('saveChanges')"

- **L325** `t(key)` key: `saving`
  → Suggested Spanish: **[ES: saving]**
  Snippet: {{ $t('saving') }}

- **L329** `t(key)` key: `addMenuItem`
  → Suggested Spanish: **[ES: addMenuItem]**
  Snippet: {{ mode === 'add' ? $t('addMenuItem') : $t('saveChanges') }}

- **L329** `t(key)` key: `saveChanges`
  → Suggested Spanish: **[ES: saveChanges]**
  Snippet: {{ mode === 'add' ? $t('addMenuItem') : $t('saveChanges') }}

- **L448** `t(key)` key: `fileTooLarge`
  → Suggested Spanish: **[ES: fileTooLarge]**
  Snippet: alert(t('fileTooLarge'));

- **L468** `t(key)` key: `fileTooLarge`
  → Suggested Spanish: **[ES: fileTooLarge]**
  Snippet: alert(t('fileTooLarge'));

- **L149** `t(key, params)` key: `removeTag`
  → Suggested Spanish: **[ES: removeTag]**
  Snippet: :aria-label="$t('removeTag', { tag })"

- **L18** `$t(key)` key: `addMenuItem`
  → Suggested Spanish: **[ES: addMenuItem]**
  Snippet: {{ mode === 'add' ? $t('addMenuItem') : $t('editMenuItem') }}

- **L18** `$t(key)` key: `editMenuItem`
  → Suggested Spanish: **[ES: editMenuItem]**
  Snippet: {{ mode === 'add' ? $t('addMenuItem') : $t('editMenuItem') }}

- **L21** `$t(key)` key: `addNewMenuItemDescription`
  → Suggested Spanish: **[ES: addNewMenuItemDescription]**
  Snippet: {{ mode === 'add' ? $t('addNewMenuItemDescription') : $t('editMenuItemDescription') }}

- **L21** `$t(key)` key: `editMenuItemDescription`
  → Suggested Spanish: **[ES: editMenuItemDescription]**
  Snippet: {{ mode === 'add' ? $t('addNewMenuItemDescription') : $t('editMenuItemDescription') }}

- **L28** `$t(key)` key: `close`
  → Suggested Spanish: **[ES: close]**
  Snippet: :aria-label="$t('close')"

- **L41** `$t(key)` key: `name`
  → Suggested Spanish: **Nombre**
  Snippet: {{ $t('name') }} <span class="required-indicator">*</span>

- **L47** `$t(key)` key: `namePlaceholder`
  → Suggested Spanish: **[ES: namePlaceholder]**
  Snippet: :placeholder="$t('namePlaceholder')"

- **L49** `$t(key)` key: `name`
  → Suggested Spanish: **Nombre**
  Snippet: :aria-label="$t('name')"

- **L56** `$t(key)` key: `category`
  → Suggested Spanish: **[ES: category]**
  Snippet: {{ $t('category') }} <span class="required-indicator">*</span>

- **L63** `$t(key)` key: `category`
  → Suggested Spanish: **[ES: category]**
  Snippet: :aria-label="$t('category')"

- **L65** `$t(key)` key: `selectCategory`
  → Suggested Spanish: **[ES: selectCategory]**
  Snippet: <option value="" disabled>{{ $t('selectCategory') }}</option>

- **L66** `$t(key)` key: `appetizers`
  → Suggested Spanish: **[ES: appetizers]**
  Snippet: <option value="appetizers">{{ $t('appetizers') }}</option>

- **L67** `$t(key)` key: `mainCourses`
  → Suggested Spanish: **[ES: mainCourses]**
  Snippet: <option value="main_courses">{{ $t('mainCourses') }}</option>

- **L68** `$t(key)` key: `desserts`
  → Suggested Spanish: **[ES: desserts]**
  Snippet: <option value="desserts">{{ $t('desserts') }}</option>

- **L69** `$t(key)` key: `drinks`
  → Suggested Spanish: **[ES: drinks]**
  Snippet: <option value="drinks">{{ $t('drinks') }}</option>

- **L70** `$t(key)` key: `specials`
  → Suggested Spanish: **[ES: specials]**
  Snippet: <option value="specials">{{ $t('specials') }}</option>

- **L80** `$t(key)` key: `description`
  → Suggested Spanish: **[ES: description]**
  Snippet: {{ $t('description') }}

- **L85** `$t(key)` key: `descriptionPlaceholder`
  → Suggested Spanish: **[ES: descriptionPlaceholder]**
  Snippet: :placeholder="$t('descriptionPlaceholder')"

- **L87** `$t(key)` key: `description`
  → Suggested Spanish: **[ES: description]**
  Snippet: :aria-label="$t('description')"

- **L96** `$t(key)` key: `price`
  → Suggested Spanish: **[ES: price]**
  Snippet: {{ $t('price') }} <span class="required-indicator">*</span>

- **L108** `$t(key)` key: `price`
  → Suggested Spanish: **[ES: price]**
  Snippet: :aria-label="$t('price')"

- **L116** `$t(key)` key: `preparationTime`
  → Suggested Spanish: **[ES: preparationTime]**
  Snippet: {{ $t('preparationTime') }}

- **L125** `$t(key)` key: `preparationTime`
  → Suggested Spanish: **[ES: preparationTime]**
  Snippet: :aria-label="$t('preparationTime')"

- **L127** `$t(key)` key: `minutes`
  → Suggested Spanish: **[ES: minutes]**
  Snippet: <span class="input-suffix">{{ $t('minutes') }}</span>

- **L135** `$t(key)` key: `tags`
  → Suggested Spanish: **[ES: tags]**
  Snippet: {{ $t('tags') }}

- **L159** `$t(key)` key: `addTagPlaceholder`
  → Suggested Spanish: **[ES: addTagPlaceholder]**
  Snippet: :placeholder="$t('addTagPlaceholder')"

- **L162** `$t(key)` key: `addTag`
  → Suggested Spanish: **[ES: addTag]**
  Snippet: :aria-label="$t('addTag')"

- **L168** `$t(key)` key: `addTag`
  → Suggested Spanish: **[ES: addTag]**
  Snippet: :aria-label="$t('addTag')"

- **L170** `$t(key)` key: `add`
  → Suggested Spanish: **[ES: add]**
  Snippet: {{ $t('add') }}

- **L179** `$t(key)` key: `image`
  → Suggested Spanish: **[ES: image]**
  Snippet: {{ $t('image') }}

- **L188** `$t(key)` key: `uploadImage`
  → Suggested Spanish: **[ES: uploadImage]**
  Snippet: :aria-label="$t('uploadImage')"

- **L195** `$t(key)` key: `dragDropImage`
  → Suggested Spanish: **[ES: dragDropImage]**
  Snippet: <p class="upload-title">{{ $t('dragDropImage') }}</p>

- **L196** `$t(key)` key: `orClickToUpload`
  → Suggested Spanish: **[ES: orClickToUpload]**
  Snippet: <p class="upload-subtitle">{{ $t('orClickToUpload') }}</p>

- **L199** `$t(key)` key: `supportedFormats`
  → Suggested Spanish: **[ES: supportedFormats]**
  Snippet: {{ $t('supportedFormats') }}: PNG, JPG {{ $t('upTo') }} 5MB

- **L199** `$t(key)` key: `upTo`
  → Suggested Spanish: **[ES: upTo]**
  Snippet: {{ $t('supportedFormats') }}: PNG, JPG {{ $t('upTo') }} 5MB

- **L203** `$t(key)` key: `imagePreview`
  → Suggested Spanish: **[ES: imagePreview]**
  Snippet: <img :src="formData.image" :alt="$t('imagePreview')" class="preview-image">

- **L208** `$t(key)` key: `removeImage`
  → Suggested Spanish: **[ES: removeImage]**
  Snippet: :aria-label="$t('removeImage')"

- **L210** `$t(key)` key: `removeImage`
  → Suggested Spanish: **[ES: removeImage]**
  Snippet: {{ $t('removeImage') }}

- **L232** `$t(key)` key: `availability`
  → Suggested Spanish: **[ES: availability]**
  Snippet: :aria-label="$t('availability')"

- **L235** `$t(key)` key: `available`
  → Suggested Spanish: **[ES: available]**
  Snippet: <span class="toggle-text">{{ $t('available') }}</span>

- **L238** `$t(key)` key: `availabilityDescription`
  → Suggested Spanish: **[ES: availabilityDescription]**
  Snippet: {{ $t('availabilityDescription') }}

- **L249** `$t(key)` key: `specialItem`
  → Suggested Spanish: **[ES: specialItem]**
  Snippet: :aria-label="$t('specialItem')"

- **L252** `$t(key)` key: `specialItem`
  → Suggested Spanish: **[ES: specialItem]**
  Snippet: <span class="toggle-text">{{ $t('specialItem') }}</span>

- **L255** `$t(key)` key: `specialItemDescription`
  → Suggested Spanish: **[ES: specialItemDescription]**
  Snippet: {{ $t('specialItemDescription') }}

- **L265** `$t(key)` key: `calories`
  → Suggested Spanish: **[ES: calories]**
  Snippet: {{ $t('calories') }}

- **L274** `$t(key)` key: `calories`
  → Suggested Spanish: **[ES: calories]**
  Snippet: :aria-label="$t('calories')"

- **L276** `$t(key)` key: `caloriesShort`
  → Suggested Spanish: **[ES: caloriesShort]**
  Snippet: <span class="input-suffix">{{ $t('caloriesShort') }}</span>

- **L283** `$t(key)` key: `allergens`
  → Suggested Spanish: **[ES: allergens]**
  Snippet: {{ $t('allergens') }}

- **L289** `$t(key)` key: `allergens`
  → Suggested Spanish: **[ES: allergens]**
  Snippet: :aria-label="$t('allergens')"

- **L291** `$t(key)` key: `gluten`
  → Suggested Spanish: **[ES: gluten]**
  Snippet: <option value="gluten">{{ $t('gluten') }}</option>

- **L292** `$t(key)` key: `dairy`
  → Suggested Spanish: **[ES: dairy]**
  Snippet: <option value="dairy">{{ $t('dairy') }}</option>

- **L293** `$t(key)` key: `nuts`
  → Suggested Spanish: **[ES: nuts]**
  Snippet: <option value="nuts">{{ $t('nuts') }}</option>

- **L294** `$t(key)` key: `soy`
  → Suggested Spanish: **[ES: soy]**
  Snippet: <option value="soy">{{ $t('soy') }}</option>

- **L295** `$t(key)` key: `eggs`
  → Suggested Spanish: **[ES: eggs]**
  Snippet: <option value="eggs">{{ $t('eggs') }}</option>

- **L296** `$t(key)` key: `fish`
  → Suggested Spanish: **[ES: fish]**
  Snippet: <option value="fish">{{ $t('fish') }}</option>

- **L297** `$t(key)` key: `shellfish`
  → Suggested Spanish: **[ES: shellfish]**
  Snippet: <option value="shellfish">{{ $t('shellfish') }}</option>

- **L311** `$t(key)` key: `cancel`
  → Suggested Spanish: **Cancelar**
  Snippet: :aria-label="$t('cancel')"

- **L313** `$t(key)` key: `cancel`
  → Suggested Spanish: **Cancelar**
  Snippet: {{ $t('cancel') }}

- **L320** `$t(key)` key: `addMenuItem`
  → Suggested Spanish: **[ES: addMenuItem]**
  Snippet: :aria-label="mode === 'add' ? $t('addMenuItem') : $t('saveChanges')"

- **L320** `$t(key)` key: `saveChanges`
  → Suggested Spanish: **[ES: saveChanges]**
  Snippet: :aria-label="mode === 'add' ? $t('addMenuItem') : $t('saveChanges')"

- **L325** `$t(key)` key: `saving`
  → Suggested Spanish: **[ES: saving]**
  Snippet: {{ $t('saving') }}

- **L329** `$t(key)` key: `addMenuItem`
  → Suggested Spanish: **[ES: addMenuItem]**
  Snippet: {{ mode === 'add' ? $t('addMenuItem') : $t('saveChanges') }}

- **L329** `$t(key)` key: `saveChanges`
  → Suggested Spanish: **[ES: saveChanges]**
  Snippet: {{ mode === 'add' ? $t('addMenuItem') : $t('saveChanges') }}

- **L149** `$t(key, params)` key: `removeTag`
  → Suggested Spanish: **[ES: removeTag]**
  Snippet: :aria-label="$t('removeTag', { tag })"

- **L345** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/OrderCard.vue

- **L33** `t(key)` key: `${order.status}`
  → Suggested Spanish: **[ES: ${order.status}]**
  Snippet: {{ $t(`${order.status}`) }}

- **L36** `t(key)` key: `delivery`
  → Suggested Spanish: **Repartidor**
  Snippet: <i class="ri-bike-line mr-1 text-xs"></i>{{ $t('delivery') }}

- **L39** `t(key)` key: `pickup`
  → Suggested Spanish: **[ES: pickup]**
  Snippet: <i class="ri-store-line mr-1 text-xs"></i>{{ $t('pickup') }}

- **L78** `t(key)` key: `total`
  → Suggested Spanish: **Total**
  Snippet: <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ $t('total') }}</p>

- **L80** `t(key)` key: `currency`
  → Suggested Spanish: **[ES: currency]**
  Snippet: ${{ order.totalAmount.toFixed(2) }} <span class="text-xs sm:text-sm">{{ $t('currency') }}</span>

- **L88** `t(key)` key: `payment.${order.paymentStatus}`
  → Suggested Spanish: **[ES: payment.${order.paymentStatus}]**
  Snippet: {{ $t(`payment.${order.paymentStatus}`) }}

- **L99** `t(key)` key: `orderStatus.placed`
  → Suggested Spanish: **[ES: orderStatus.placed]**
  Snippet: <span :class="progressLabelClass(1)">{{ $t('orderStatus.placed') }}</span>

- **L100** `t(key)` key: `orderStatus.preparing`
  → Suggested Spanish: **[ES: orderStatus.preparing]**
  Snippet: <span :class="progressLabelClass(2)">{{ $t('orderStatus.preparing') }}</span>

- **L101** `t(key)` key: `orderStatus.ready`
  → Suggested Spanish: **[ES: orderStatus.ready]**
  Snippet: <span :class="progressLabelClass(3)">{{ $t('orderStatus.ready') }}</span>

- **L102** `t(key)` key: `orderStatus.onRoute`
  → Suggested Spanish: **[ES: orderStatus.onRoute]**
  Snippet: <span :class="progressLabelClass(4)" v-if="order.isDelivery">{{ $t('orderStatus.onRoute') }}</span>

- **L103** `t(key)` key: `orderStatus.completed`
  → Suggested Spanish: **[ES: orderStatus.completed]**
  Snippet: <span :class="progressLabelClass(order.isDelivery ? 5 : 4)">{{ $t('orderStatus.completed') }}</span>

- **L125** `t(key)` key: `showLess`
  → Suggested Spanish: **[ES: showLess]**
  Snippet: {{ showAllItems ? $t('showLess') : $t('showAll') }}

- **L125** `t(key)` key: `showAll`
  → Suggested Spanish: **[ES: showAll]**
  Snippet: {{ showAllItems ? $t('showLess') : $t('showAll') }}

- **L160** `t(key)` key: `preparationChecklist`
  → Suggested Spanish: **[ES: preparationChecklist]**
  Snippet: {{ $t('preparationChecklist') }}

- **L169** `t(key)` key: `uncheckAll`
  → Suggested Spanish: **[ES: uncheckAll]**
  Snippet: {{ allItemsPrepared ? $t('uncheckAll') : $t('checkAll') }}

- **L169** `t(key)` key: `checkAll`
  → Suggested Spanish: **[ES: checkAll]**
  Snippet: {{ allItemsPrepared ? $t('uncheckAll') : $t('checkAll') }}

- **L190** `t(key)` key: `quantity`
  → Suggested Spanish: **[ES: quantity]**
  Snippet: <span class="text-xs text-gray-600 dark:text-gray-400">{{ $t('quantity') }}: {{ item.quantity }}</sp

- **L192** `t(key)` key: `minutes`
  → Suggested Spanish: **[ES: minutes]**
  Snippet: {{ item.preparationTime }} {{ $t('minutes') }}

- **L219** `t(key)` key: `deliveryDriver`
  → Suggested Spanish: **[ES: deliveryDriver]**
  Snippet: <h5 class="font-semibold text-tertiary-900 dark:text-tertiary-300 text-sm sm:text-base">{{ $t('deliv

- **L222** `t(key)` key: `active`
  → Suggested Spanish: **[ES: active]**
  Snippet: {{ $t('active') }}

- **L229** `t(key)` key: `noDriverAssigned`
  → Suggested Spanish: **[ES: noDriverAssigned]**
  Snippet: {{ $t('noDriverAssigned') }}

- **L244** `t(key)` key: `message`
  → Suggested Spanish: **[ES: message]**
  Snippet: {{ $t('message') }}

- **L257** `t(key)` key: `scanToVerify`
  → Suggested Spanish: **[ES: scanToVerify]**
  Snippet: <span class="text-xs text-tertiary-500 dark:text-tertiary-500">{{ $t('scanToVerify') }}</span>

- **L265** `t(key)` key: `pickupCode`
  → Suggested Spanish: **[ES: pickupCode]**
  Snippet: <p class="text-xs sm:text-sm text-tertiary-600 dark:text-tertiary-400">{{ $t('pickupCode') }}</p>

- **L275** `t(key)` key: `copy`
  → Suggested Spanish: **[ES: copy]**
  Snippet: {{ $t('copy') }}

- **L279** `t(key)` key: `pickupCodeDescription`
  → Suggested Spanish: **[ES: pickupCodeDescription]**
  Snippet: {{ $t('pickupCodeDescription') }}

- **L291** `t(key)` key: `estimatedDelivery`
  → Suggested Spanish: **[ES: estimatedDelivery]**
  Snippet: <p class="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">{{ $t('estimatedDelivery') 

- **L293** `t(key)` key: `notAvailable`
  → Suggested Spanish: **[ES: notAvailable]**
  Snippet: {{ order.estimatedDelivery ? formatDeliveryTime(order.estimatedDelivery) : $t('notAvailable') }}

- **L299** `t(key)` key: `driverRating`
  → Suggested Spanish: **[ES: driverRating]**
  Snippet: <span class="text-secondary-600 dark:text-secondary-400">{{ $t('driverRating') }}</span>

- **L301** `t(key)` key: `notAvailable`
  → Suggested Spanish: **[ES: notAvailable]**
  Snippet: {{ order.driver?.rating || $t('notAvailable') }} ⭐

- **L305** `t(key)` key: `vehicle`
  → Suggested Spanish: **[ES: vehicle]**
  Snippet: <span class="text-secondary-600 dark:text-secondary-400">{{ $t('vehicle') }}</span>

- **L307** `t(key)` key: `motorcycle`
  → Suggested Spanish: **[ES: motorcycle]**
  Snippet: {{ order.driver?.vehicle || $t('motorcycle') }}

- **L322** `t(key)` key: `callCustomer`
  → Suggested Spanish: **[ES: callCustomer]**
  Snippet: :title="$t('callCustomer')"

- **L325** `t(key)` key: `call`
  → Suggested Spanish: **[ES: call]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('call') }}</span>

- **L330** `t(key)` key: `messageCustomer`
  → Suggested Spanish: **[ES: messageCustomer]**
  Snippet: :title="$t('messageCustomer')"

- **L333** `t(key)` key: `message`
  → Suggested Spanish: **[ES: message]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('message') }}</span>

- **L338** `t(key)` key: `printOrder`
  → Suggested Spanish: **[ES: printOrder]**
  Snippet: :title="$t('printOrder')"

- **L341** `t(key)` key: `print`
  → Suggested Spanish: **[ES: print]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('print') }}</span>

- **L347** `t(key)` key: `assignDriver`
  → Suggested Spanish: **[ES: assignDriver]**
  Snippet: :title="$t('assignDriver')"

- **L350** `t(key)` key: `assign`
  → Suggested Spanish: **[ES: assign]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('assign') }}</span>

- **L362** `t(key)` key: `btnDecline`
  → Suggested Spanish: **[ES: btnDecline]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('btnDecline') }}</span>

- **L370** `t(key)` key: `btnAccept`
  → Suggested Spanish: **[ES: btnAccept]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('btnAccept') }}</span>

- **L371** `t(key)` key: `andStart`
  → Suggested Spanish: **[ES: andStart]**
  Snippet: <span class="hidden sm:inline">{{ $t('andStart') }}</span>

- **L379** `t(key)` key: `btnMarkReady`
  → Suggested Spanish: **[ES: btnMarkReady]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('btnMarkReady') }}</span>

- **L387** `t(key)` key: `btnOutForDelivery`
  → Suggested Spanish: **[ES: btnOutForDelivery]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('btnOutForDelivery') }}</span>

- **L395** `t(key)` key: `pickupComplete`
  → Suggested Spanish: **[ES: pickupComplete]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('pickupComplete') }}</span>

- **L403** `t(key)` key: `btnMarkDelivered`
  → Suggested Spanish: **[ES: btnMarkDelivered]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('btnMarkDelivered') }}</span>

- **L416** `t(key)` key: `estimatedCompletion`
  → Suggested Spanish: **[ES: estimatedCompletion]**
  Snippet: <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ $t('estimatedCompletion') }}</p>

- **L424** `t(key)` key: `updateTime`
  → Suggested Spanish: **[ES: updateTime]**
  Snippet: {{ $t('updateTime') }}

- **L593** `t(key)` key: `justNow`
  → Suggested Spanish: **[ES: justNow]**
  Snippet: if (diffInMinutes < 1) return t('justNow');

- **L605** `t(key)` key: `nearby`
  → Suggested Spanish: **[ES: nearby]**
  Snippet: if (!distance) return t('nearby');

- **L119** `t(key, params)` key: `orderItems`
  → Suggested Spanish: **[ES: orderItems]**
  Snippet: {{ $t('orderItems', { count: order.items.length }) }}

- **L594** `t(key, params)` key: `minutesAgo`
  → Suggested Spanish: **[ES: minutesAgo]**
  Snippet: if (diffInMinutes < 60) return t('minutesAgo', { minutes: diffInMinutes });

- **L595** `t(key, params)` key: `hoursAgo`
  → Suggested Spanish: **[ES: hoursAgo]**
  Snippet: if (diffInMinutes < 1440) return t('hoursAgo', { hours: Math.floor(diffInMinutes / 60) });

- **L596** `t(key, params)` key: `daysAgo`
  → Suggested Spanish: **[ES: daysAgo]**
  Snippet: return t('daysAgo', { days: Math.floor(diffInMinutes / 1440) });

- **L606** `t(key, params)` key: `distanceKm`
  → Suggested Spanish: **[ES: distanceKm]**
  Snippet: return t('distanceKm', { distance: distance.toFixed(1) });

- **L33** `$t(key)` key: `${order.status}`
  → Suggested Spanish: **[ES: ${order.status}]**
  Snippet: {{ $t(`${order.status}`) }}

- **L36** `$t(key)` key: `delivery`
  → Suggested Spanish: **Repartidor**
  Snippet: <i class="ri-bike-line mr-1 text-xs"></i>{{ $t('delivery') }}

- **L39** `$t(key)` key: `pickup`
  → Suggested Spanish: **[ES: pickup]**
  Snippet: <i class="ri-store-line mr-1 text-xs"></i>{{ $t('pickup') }}

- **L78** `$t(key)` key: `total`
  → Suggested Spanish: **Total**
  Snippet: <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ $t('total') }}</p>

- **L80** `$t(key)` key: `currency`
  → Suggested Spanish: **[ES: currency]**
  Snippet: ${{ order.totalAmount.toFixed(2) }} <span class="text-xs sm:text-sm">{{ $t('currency') }}</span>

- **L88** `$t(key)` key: `payment.${order.paymentStatus}`
  → Suggested Spanish: **[ES: payment.${order.paymentStatus}]**
  Snippet: {{ $t(`payment.${order.paymentStatus}`) }}

- **L99** `$t(key)` key: `orderStatus.placed`
  → Suggested Spanish: **[ES: orderStatus.placed]**
  Snippet: <span :class="progressLabelClass(1)">{{ $t('orderStatus.placed') }}</span>

- **L100** `$t(key)` key: `orderStatus.preparing`
  → Suggested Spanish: **[ES: orderStatus.preparing]**
  Snippet: <span :class="progressLabelClass(2)">{{ $t('orderStatus.preparing') }}</span>

- **L101** `$t(key)` key: `orderStatus.ready`
  → Suggested Spanish: **[ES: orderStatus.ready]**
  Snippet: <span :class="progressLabelClass(3)">{{ $t('orderStatus.ready') }}</span>

- **L102** `$t(key)` key: `orderStatus.onRoute`
  → Suggested Spanish: **[ES: orderStatus.onRoute]**
  Snippet: <span :class="progressLabelClass(4)" v-if="order.isDelivery">{{ $t('orderStatus.onRoute') }}</span>

- **L103** `$t(key)` key: `orderStatus.completed`
  → Suggested Spanish: **[ES: orderStatus.completed]**
  Snippet: <span :class="progressLabelClass(order.isDelivery ? 5 : 4)">{{ $t('orderStatus.completed') }}</span>

- **L125** `$t(key)` key: `showLess`
  → Suggested Spanish: **[ES: showLess]**
  Snippet: {{ showAllItems ? $t('showLess') : $t('showAll') }}

- **L125** `$t(key)` key: `showAll`
  → Suggested Spanish: **[ES: showAll]**
  Snippet: {{ showAllItems ? $t('showLess') : $t('showAll') }}

- **L160** `$t(key)` key: `preparationChecklist`
  → Suggested Spanish: **[ES: preparationChecklist]**
  Snippet: {{ $t('preparationChecklist') }}

- **L169** `$t(key)` key: `uncheckAll`
  → Suggested Spanish: **[ES: uncheckAll]**
  Snippet: {{ allItemsPrepared ? $t('uncheckAll') : $t('checkAll') }}

- **L169** `$t(key)` key: `checkAll`
  → Suggested Spanish: **[ES: checkAll]**
  Snippet: {{ allItemsPrepared ? $t('uncheckAll') : $t('checkAll') }}

- **L190** `$t(key)` key: `quantity`
  → Suggested Spanish: **[ES: quantity]**
  Snippet: <span class="text-xs text-gray-600 dark:text-gray-400">{{ $t('quantity') }}: {{ item.quantity }}</sp

- **L192** `$t(key)` key: `minutes`
  → Suggested Spanish: **[ES: minutes]**
  Snippet: {{ item.preparationTime }} {{ $t('minutes') }}

- **L219** `$t(key)` key: `deliveryDriver`
  → Suggested Spanish: **[ES: deliveryDriver]**
  Snippet: <h5 class="font-semibold text-tertiary-900 dark:text-tertiary-300 text-sm sm:text-base">{{ $t('deliv

- **L222** `$t(key)` key: `active`
  → Suggested Spanish: **[ES: active]**
  Snippet: {{ $t('active') }}

- **L229** `$t(key)` key: `noDriverAssigned`
  → Suggested Spanish: **[ES: noDriverAssigned]**
  Snippet: {{ $t('noDriverAssigned') }}

- **L244** `$t(key)` key: `message`
  → Suggested Spanish: **[ES: message]**
  Snippet: {{ $t('message') }}

- **L257** `$t(key)` key: `scanToVerify`
  → Suggested Spanish: **[ES: scanToVerify]**
  Snippet: <span class="text-xs text-tertiary-500 dark:text-tertiary-500">{{ $t('scanToVerify') }}</span>

- **L265** `$t(key)` key: `pickupCode`
  → Suggested Spanish: **[ES: pickupCode]**
  Snippet: <p class="text-xs sm:text-sm text-tertiary-600 dark:text-tertiary-400">{{ $t('pickupCode') }}</p>

- **L275** `$t(key)` key: `copy`
  → Suggested Spanish: **[ES: copy]**
  Snippet: {{ $t('copy') }}

- **L279** `$t(key)` key: `pickupCodeDescription`
  → Suggested Spanish: **[ES: pickupCodeDescription]**
  Snippet: {{ $t('pickupCodeDescription') }}

- **L291** `$t(key)` key: `estimatedDelivery`
  → Suggested Spanish: **[ES: estimatedDelivery]**
  Snippet: <p class="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">{{ $t('estimatedDelivery') 

- **L293** `$t(key)` key: `notAvailable`
  → Suggested Spanish: **[ES: notAvailable]**
  Snippet: {{ order.estimatedDelivery ? formatDeliveryTime(order.estimatedDelivery) : $t('notAvailable') }}

- **L299** `$t(key)` key: `driverRating`
  → Suggested Spanish: **[ES: driverRating]**
  Snippet: <span class="text-secondary-600 dark:text-secondary-400">{{ $t('driverRating') }}</span>

- **L301** `$t(key)` key: `notAvailable`
  → Suggested Spanish: **[ES: notAvailable]**
  Snippet: {{ order.driver?.rating || $t('notAvailable') }} ⭐

- **L305** `$t(key)` key: `vehicle`
  → Suggested Spanish: **[ES: vehicle]**
  Snippet: <span class="text-secondary-600 dark:text-secondary-400">{{ $t('vehicle') }}</span>

- **L307** `$t(key)` key: `motorcycle`
  → Suggested Spanish: **[ES: motorcycle]**
  Snippet: {{ order.driver?.vehicle || $t('motorcycle') }}

- **L322** `$t(key)` key: `callCustomer`
  → Suggested Spanish: **[ES: callCustomer]**
  Snippet: :title="$t('callCustomer')"

- **L325** `$t(key)` key: `call`
  → Suggested Spanish: **[ES: call]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('call') }}</span>

- **L330** `$t(key)` key: `messageCustomer`
  → Suggested Spanish: **[ES: messageCustomer]**
  Snippet: :title="$t('messageCustomer')"

- **L333** `$t(key)` key: `message`
  → Suggested Spanish: **[ES: message]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('message') }}</span>

- **L338** `$t(key)` key: `printOrder`
  → Suggested Spanish: **[ES: printOrder]**
  Snippet: :title="$t('printOrder')"

- **L341** `$t(key)` key: `print`
  → Suggested Spanish: **[ES: print]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('print') }}</span>

- **L347** `$t(key)` key: `assignDriver`
  → Suggested Spanish: **[ES: assignDriver]**
  Snippet: :title="$t('assignDriver')"

- **L350** `$t(key)` key: `assign`
  → Suggested Spanish: **[ES: assign]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('assign') }}</span>

- **L362** `$t(key)` key: `btnDecline`
  → Suggested Spanish: **[ES: btnDecline]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('btnDecline') }}</span>

- **L370** `$t(key)` key: `btnAccept`
  → Suggested Spanish: **[ES: btnAccept]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('btnAccept') }}</span>

- **L371** `$t(key)` key: `andStart`
  → Suggested Spanish: **[ES: andStart]**
  Snippet: <span class="hidden sm:inline">{{ $t('andStart') }}</span>

- **L379** `$t(key)` key: `btnMarkReady`
  → Suggested Spanish: **[ES: btnMarkReady]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('btnMarkReady') }}</span>

- **L387** `$t(key)` key: `btnOutForDelivery`
  → Suggested Spanish: **[ES: btnOutForDelivery]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('btnOutForDelivery') }}</span>

- **L395** `$t(key)` key: `pickupComplete`
  → Suggested Spanish: **[ES: pickupComplete]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('pickupComplete') }}</span>

- **L403** `$t(key)` key: `btnMarkDelivered`
  → Suggested Spanish: **[ES: btnMarkDelivered]**
  Snippet: <span class="text-xs sm:text-sm">{{ $t('btnMarkDelivered') }}</span>

- **L416** `$t(key)` key: `estimatedCompletion`
  → Suggested Spanish: **[ES: estimatedCompletion]**
  Snippet: <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ $t('estimatedCompletion') }}</p>

- **L424** `$t(key)` key: `updateTime`
  → Suggested Spanish: **[ES: updateTime]**
  Snippet: {{ $t('updateTime') }}

- **L119** `$t(key, params)` key: `orderItems`
  → Suggested Spanish: **[ES: orderItems]**
  Snippet: {{ $t('orderItems', { count: order.items.length }) }}

- **L33** `t(dynamic)` key: ``${order.status}``
  → Suggested Spanish: **[ES: `${order.status}`]**
  Snippet: {{ $t(`${order.status}`) }}

- **L88** `t(dynamic)` key: ``payment.${order.paymentStatus}``
  → Suggested Spanish: **[ES: `payment.${order.paymentStatus}`]**
  Snippet: {{ $t(`payment.${order.paymentStatus}`) }}

- **L436** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/reviews/RatingDistribution.vue

- **L11** `t(key)` key: `ratingDistribution`
  → Suggested Spanish: **[ES: ratingDistribution]**
  Snippet: {{ t('ratingDistribution') }}

- **L24** `t(key)` key: `switchToChartView`
  → Suggested Spanish: **[ES: switchToChartView]**
  Snippet: :aria-label="t('switchToChartView')"

- **L32** `t(key)` key: `switchToListView`
  → Suggested Spanish: **[ES: switchToListView]**
  Snippet: :aria-label="t('switchToListView')"

- **L77** `t(key)` key: `reviews`
  → Suggested Spanish: **[ES: reviews]**
  Snippet: {{ rating.count }} {{ t('reviews') }}

- **L96** `t(key)` key: `view`
  → Suggested Spanish: **[ES: view]**
  Snippet: {{ t('view') }}

- **L105** `t(key)` key: `averageRating`
  → Suggested Spanish: **[ES: averageRating]**
  Snippet: <span class="stat-label">{{ t('averageRating') }}</span>

- **L125** `t(key)` key: `totalReviews`
  → Suggested Spanish: **[ES: totalReviews]**
  Snippet: <span class="stat-label">{{ t('totalReviews') }}</span>

- **L130** `t(key)` key: `positiveReviews`
  → Suggested Spanish: **[ES: positiveReviews]**
  Snippet: <span class="stat-label">{{ t('positiveReviews') }}</span>

- **L159** `t(key)` key: `stars`
  → Suggested Spanish: **[ES: stars]**
  Snippet: <span class="stars-count">{{ rating.stars }} {{ t('stars') }}</span>

- **L164** `t(key)` key: `count`
  → Suggested Spanish: **[ES: count]**
  Snippet: <span class="detail-label">{{ t('count') }}</span>

- **L168** `t(key)` key: `percentage`
  → Suggested Spanish: **[ES: percentage]**
  Snippet: <span class="detail-label">{{ t('percentage') }}</span>

- **L183** `t(key)` key: `filterByDate`
  → Suggested Spanish: **[ES: filterByDate]**
  Snippet: <label class="filter-label">{{ t('filterByDate') }}</label>

- **L189** `t(key)` key: `allTime`
  → Suggested Spanish: **[ES: allTime]**
  Snippet: <option value="all">{{ t('allTime') }}</option>

- **L190** `t(key)` key: `thisMonth`
  → Suggested Spanish: **[ES: thisMonth]**
  Snippet: <option value="month">{{ t('thisMonth') }}</option>

- **L191** `t(key)` key: `thisWeek`
  → Suggested Spanish: **[ES: thisWeek]**
  Snippet: <option value="week">{{ t('thisWeek') }}</option>

- **L192** `t(key)` key: `today`
  → Suggested Spanish: **[ES: today]**
  Snippet: <option value="today">{{ t('today') }}</option>

- **L197** `t(key)` key: `sortBy`
  → Suggested Spanish: **[ES: sortBy]**
  Snippet: <label class="filter-label">{{ t('sortBy') }}</label>

- **L203** `t(key)` key: `starsHighToLow`
  → Suggested Spanish: **[ES: starsHighToLow]**
  Snippet: <option value="stars-high">{{ t('starsHighToLow') }}</option>

- **L204** `t(key)` key: `starsLowToHigh`
  → Suggested Spanish: **[ES: starsLowToHigh]**
  Snippet: <option value="stars-low">{{ t('starsLowToHigh') }}</option>

- **L205** `t(key)` key: `countHighToLow`
  → Suggested Spanish: **[ES: countHighToLow]**
  Snippet: <option value="count-high">{{ t('countHighToLow') }}</option>

- **L206** `t(key)` key: `percentageHighToLow`
  → Suggested Spanish: **[ES: percentageHighToLow]**
  Snippet: <option value="percentage-high">{{ t('percentageHighToLow') }}</option>

- **L215** `t(key)` key: `excellent`
  → Suggested Spanish: **[ES: excellent]**
  Snippet: <span class="indicator-label">{{ t('excellent') }}</span>

- **L220** `t(key)` key: `good`
  → Suggested Spanish: **[ES: good]**
  Snippet: <span class="indicator-label">{{ t('good') }}</span>

- **L225** `t(key)` key: `average`
  → Suggested Spanish: **[ES: average]**
  Snippet: <span class="indicator-label">{{ t('average') }}</span>

- **L230** `t(key)` key: `poor`
  → Suggested Spanish: **[ES: poor]**
  Snippet: <span class="indicator-label">{{ t('poor') }}</span>

- **L240** `t(key)` key: `stars`
  → Suggested Spanish: **[ES: stars]**
  Snippet: <span class="legend-text">5 {{ t('stars') }}</span>

- **L244** `t(key)` key: `stars`
  → Suggested Spanish: **[ES: stars]**
  Snippet: <span class="legend-text">4 {{ t('stars') }}</span>

- **L248** `t(key)` key: `stars`
  → Suggested Spanish: **[ES: stars]**
  Snippet: <span class="legend-text">3 {{ t('stars') }}</span>

- **L252** `t(key)` key: `stars`
  → Suggested Spanish: **[ES: stars]**
  Snippet: <span class="legend-text">1-2 {{ t('stars') }}</span>

- **L259** `t(key)` key: `comparedToPrevious`
  → Suggested Spanish: **[ES: comparedToPrevious]**
  Snippet: <h4 class="comparison-title">{{ t('comparedToPrevious') }}</h4>

- **L262** `t(key)` key: `ratingChange`
  → Suggested Spanish: **[ES: ratingChange]**
  Snippet: <span class="comparison-label">{{ t('ratingChange') }}</span>

- **L269** `t(key)` key: `reviewChange`
  → Suggested Spanish: **[ES: reviewChange]**
  Snippet: <span class="comparison-label">{{ t('reviewChange') }}</span>

- **L282** `t(key)` key: `exportData`
  → Suggested Spanish: **[ES: exportData]**
  Snippet: {{ t('exportData') }}

- **L286** `t(key)` key: `share`
  → Suggested Spanish: **[ES: share]**
  Snippet: {{ t('share') }}

- **L14** `t(key, params)` key: `basedOnReviews`
  → Suggested Spanish: **[ES: basedOnReviews]**
  Snippet: {{ t('basedOnReviews', { count: totalReviews }) }}

- **L69** `t(key, params)` key: `ratingBarLabel`
  → Suggested Spanish: **[ES: ratingBarLabel]**
  Snippet: :aria-label="t('ratingBarLabel', {

- **L93** `t(key, params)` key: `viewReviewsWithStars`
  → Suggested Spanish: **[ES: viewReviewsWithStars]**
  Snippet: :aria-label="t('viewReviewsWithStars', { stars: rating.stars })"

- **L296** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/reviews/ReviewCard.vue

- **L39** `t(key)` key: `verifiedPurchase`
  → Suggested Spanish: **[ES: verifiedPurchase]**
  Snippet: :aria-label="t('verifiedPurchase')"

- **L42** `t(key)` key: `verified`
  → Suggested Spanish: **[ES: verified]**
  Snippet: <span class="badge-text">{{ t('verified') }}</span>

- **L49** `t(key)` key: `repeatCustomer`
  → Suggested Spanish: **[ES: repeatCustomer]**
  Snippet: :aria-label="t('repeatCustomer')"

- **L52** `t(key)` key: `regular`
  → Suggested Spanish: **[ES: regular]**
  Snippet: <span class="badge-text">{{ t('regular') }}</span>

- **L69** `t(key)` key: `outOf5Stars`
  → Suggested Spanish: **[ES: outOf5Stars]**
  Snippet: <div class="star-rating" :aria-label="`${review.rating} ${t('outOf5Stars')}`">

- **L92** `t(key)` key: `minRead`
  → Suggested Spanish: **[ES: minRead]**
  Snippet: {{ calculateReadTime }} {{ t('minRead') }}

- **L106** `t(key)` key: `moreOptions`
  → Suggested Spanish: **[ES: moreOptions]**
  Snippet: :aria-label="t('moreOptions')"

- **L122** `t(key)` key: `unpinReview`
  → Suggested Spanish: **[ES: unpinReview]**
  Snippet: {{ isPinned ? t('unpinReview') : t('pinReview') }}

- **L122** `t(key)` key: `pinReview`
  → Suggested Spanish: **[ES: pinReview]**
  Snippet: {{ isPinned ? t('unpinReview') : t('pinReview') }}

- **L127** `t(key)` key: `removeFlag`
  → Suggested Spanish: **[ES: removeFlag]**
  Snippet: {{ isFlagged ? t('removeFlag') : t('flagReview') }}

- **L127** `t(key)` key: `flagReview`
  → Suggested Spanish: **[ES: flagReview]**
  Snippet: {{ isFlagged ? t('removeFlag') : t('flagReview') }}

- **L132** `t(key)` key: `reply`
  → Suggested Spanish: **[ES: reply]**
  Snippet: {{ t('reply') }}

- **L137** `t(key)` key: `editResponse`
  → Suggested Spanish: **[ES: editResponse]**
  Snippet: {{ t('editResponse') }}

- **L142** `t(key)` key: `shareReview`
  → Suggested Spanish: **[ES: shareReview]**
  Snippet: {{ t('shareReview') }}

- **L147** `t(key)` key: `deleteReview`
  → Suggested Spanish: **[ES: deleteReview]**
  Snippet: {{ t('deleteReview') }}

- **L177** `t(key)` key: `showLess`
  → Suggested Spanish: **[ES: showLess]**
  Snippet: {{ isExpanded ? t('showLess') : t('readMore') }}

- **L177** `t(key)` key: `readMore`
  → Suggested Spanish: **[ES: readMore]**
  Snippet: {{ isExpanded ? t('showLess') : t('readMore') }}

- **L186** `t(key)` key: `orderedItems`
  → Suggested Spanish: **[ES: orderedItems]**
  Snippet: {{ t('orderedItems') }}:

- **L201** `t(key)` key: `popularItem`
  → Suggested Spanish: **[ES: popularItem]**
  Snippet: :title="t('popularItem')"

- **L213** `t(key)` key: `photosVideos`
  → Suggested Spanish: **[ES: photosVideos]**
  Snippet: {{ t('photosVideos') }} ({{ (review as any).media.length }})

- **L225** `t(key)` key: `reviewPhoto`
  → Suggested Spanish: **[ES: reviewPhoto]**
  Snippet: :alt="t('reviewPhoto')"

- **L230** `t(key)` key: `video`
  → Suggested Spanish: **[ES: video]**
  Snippet: <span>{{ t('video') }}</span>

- **L249** `t(key)` key: `restaurantResponse`
  → Suggested Spanish: **[ES: restaurantResponse]**
  Snippet: <span class="response-label">{{ t('restaurantResponse') }}</span>

- **L252** `t(key)` key: `recently`
  → Suggested Spanish: **[ES: recently]**
  Snippet: {{ t('recently') }}

- **L267** `t(key)` key: `edit`
  → Suggested Spanish: **[ES: edit]**
  Snippet: {{ t('edit') }}

- **L271** `t(key)` key: `deleteResponse`
  → Suggested Spanish: **[ES: deleteResponse]**
  Snippet: {{ t('deleteResponse') }}

- **L301** `t(key)` key: `markAsHelpful`
  → Suggested Spanish: **[ES: markAsHelpful]**
  Snippet: :aria-label="t('markAsHelpful')"

- **L305** `t(key)` key: `helpful`
  → Suggested Spanish: **[ES: helpful]**
  Snippet: {{ t('helpful') }}

- **L316** `t(key)` key: `shareReview`
  → Suggested Spanish: **[ES: shareReview]**
  Snippet: :aria-label="t('shareReview')"

- **L319** `t(key)` key: `share`
  → Suggested Spanish: **[ES: share]**
  Snippet: <span class="action-text">{{ t('share') }}</span>

- **L327** `t(key)` key: `reportReview`
  → Suggested Spanish: **[ES: reportReview]**
  Snippet: :aria-label="t('reportReview')"

- **L330** `t(key)` key: `report`
  → Suggested Spanish: **[ES: report]**
  Snippet: <span class="action-text">{{ t('report') }}</span>

- **L339** `t(key)` key: `translateReview`
  → Suggested Spanish: **[ES: translateReview]**
  Snippet: :aria-label="t('translateReview')"

- **L342** `t(key)` key: `showOriginal`
  → Suggested Spanish: **[ES: showOriginal]**
  Snippet: <span>{{ showOriginal ? t('showOriginal') : t('translate') }}</span>

- **L342** `t(key)` key: `translate`
  → Suggested Spanish: **[ES: translate]**
  Snippet: <span>{{ showOriginal ? t('showOriginal') : t('translate') }}</span>

- **L351** `t(key)` key: `selectLanguage`
  → Suggested Spanish: **[ES: selectLanguage]**
  Snippet: :aria-label="t('selectLanguage')"

- **L353** `t(key)` key: `english`
  → Suggested Spanish: **[ES: english]**
  Snippet: <option value="en">{{ t('english') }}</option>

- **L354** `t(key)` key: `spanish`
  → Suggested Spanish: **[ES: spanish]**
  Snippet: <option value="es">{{ t('spanish') }}</option>

- **L355** `t(key)` key: `french`
  → Suggested Spanish: **[ES: french]**
  Snippet: <option value="fr">{{ t('french') }}</option>

- **L356** `t(key)` key: `german`
  → Suggested Spanish: **[ES: german]**
  Snippet: <option value="de">{{ t('german') }}</option>

- **L365** `t(key)` key: `replyToReview`
  → Suggested Spanish: **[ES: replyToReview]**
  Snippet: :aria-label="t('replyToReview')"

- **L368** `t(key)` key: `reply`
  → Suggested Spanish: **[ES: reply]**
  Snippet: {{ t('reply') }}

- **L23** `t(key, params)` key: `userAvatar`
  → Suggested Spanish: **[ES: userAvatar]**
  Snippet: :aria-label="t('userAvatar', { name: review.customerName })"

- **L59** `t(key, params)` key: `customerLocation`
  → Suggested Spanish: **[ES: customerLocation]**
  Snippet: :aria-label="t('customerLocation', { location: (review as any).location })"

- **L374** `t(key, params)` key: `peopleFoundHelpful`
  → Suggested Spanish: **[ES: peopleFoundHelpful]**
  Snippet: {{ t('peopleFoundHelpful', { count: helpfulCount }) }}

- **L384** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/reviews/ReviewStatsCard.vue

- **L203** `t(dynamic)` key: `props.title`
  → Suggested Spanish: **[ES: props.title]**
  Snippet: // return t(props.title);

- **L198** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/settings/DeliverySettings.vue

- **L8** `t(key)` key: `deliverySettings`
  → Suggested Spanish: **[ES: deliverySettings]**
  Snippet: {{ t('deliverySettings') }}

- **L11** `t(key)` key: `deliverySettingsDescription`
  → Suggested Spanish: **[ES: deliverySettingsDescription]**
  Snippet: {{ t('deliverySettingsDescription') }}

- **L18** `t(key)` key: `resetToDefaults`
  → Suggested Spanish: **[ES: resetToDefaults]**
  Snippet: :aria-label="t('resetToDefaults')"

- **L21** `t(key)` key: `reset`
  → Suggested Spanish: **Restablecer**
  Snippet: {{ t('reset') }}

- **L26** `t(key)` key: `saveAsTemplate`
  → Suggested Spanish: **[ES: saveAsTemplate]**
  Snippet: :aria-label="t('saveAsTemplate')"

- **L29** `t(key)` key: `saveTemplate`
  → Suggested Spanish: **[ES: saveTemplate]**
  Snippet: {{ t('saveTemplate') }}

- **L43** `t(key)` key: `settings`
  → Suggested Spanish: **Configuración**
  Snippet: {{ t('settings') }}

- **L50** `t(key)` key: `delivery`
  → Suggested Spanish: **Repartidor**
  Snippet: {{ t('delivery') }}

- **L62** `t(key)` key: `deliveryZones`
  → Suggested Spanish: **[ES: deliveryZones]**
  Snippet: {{ t('deliveryZones') }}

- **L67** `t(key)` key: `manageDeliveryZones`
  → Suggested Spanish: **[ES: manageDeliveryZones]**
  Snippet: :aria-label="t('manageDeliveryZones')"

- **L70** `t(key)` key: `addZone`
  → Suggested Spanish: **[ES: addZone]**
  Snippet: {{ t('addZone') }}

- **L78** `t(key)` key: `zoneMapPreview`
  → Suggested Spanish: **[ES: zoneMapPreview]**
  Snippet: <p>{{ t('zoneMapPreview') }}</p>

- **L85** `t(key)` key: `deliveryRadius`
  → Suggested Spanish: **[ES: deliveryRadius]**
  Snippet: <span class="stat-label">{{ t('deliveryRadius') }}</span>

- **L92** `t(key)` key: `deliveryFee`
  → Suggested Spanish: **[ES: deliveryFee]**
  Snippet: <span class="stat-label">{{ t('deliveryFee') }}</span>

- **L101** `t(key)` key: `deliveryRadius`
  → Suggested Spanish: **[ES: deliveryRadius]**
  Snippet: {{ t('deliveryRadius') }}

- **L113** `t(key)` key: `deliveryRadiusInput`
  → Suggested Spanish: **[ES: deliveryRadiusInput]**
  Snippet: :aria-label="t('deliveryRadiusInput')"

- **L120** `t(key)` key: `deliveryRadiusDescription`
  → Suggested Spanish: **[ES: deliveryRadiusDescription]**
  Snippet: {{ t('deliveryRadiusDescription') }}

- **L132** `t(key)` key: `pricingAndFees`
  → Suggested Spanish: **[ES: pricingAndFees]**
  Snippet: {{ t('pricingAndFees') }}

- **L135** `t(key)` key: `currency`
  → Suggested Spanish: **[ES: currency]**
  Snippet: <label class="currency-label">{{ t('currency') }}:</label>

- **L149** `t(key)` key: `deliveryFee`
  → Suggested Spanish: **[ES: deliveryFee]**
  Snippet: {{ t('deliveryFee') }}

- **L161** `t(key)` key: `deliveryFeeInput`
  → Suggested Spanish: **[ES: deliveryFeeInput]**
  Snippet: :aria-label="t('deliveryFeeInput')"

- **L167** `t(key)` key: `deliveryFeeDescription`
  → Suggested Spanish: **[ES: deliveryFeeDescription]**
  Snippet: {{ t('deliveryFeeDescription') }}

- **L175** `t(key)` key: `minimumOrder`
  → Suggested Spanish: **[ES: minimumOrder]**
  Snippet: {{ t('minimumOrder') }}

- **L187** `t(key)` key: `minimumOrderInput`
  → Suggested Spanish: **[ES: minimumOrderInput]**
  Snippet: :aria-label="t('minimumOrderInput')"

- **L193** `t(key)` key: `minimumOrderDescription`
  → Suggested Spanish: **[ES: minimumOrderDescription]**
  Snippet: {{ t('minimumOrderDescription') }}

- **L201** `t(key)` key: `serviceFee`
  → Suggested Spanish: **[ES: serviceFee]**
  Snippet: {{ t('serviceFee') }}

- **L211** `t(key)` key: `serviceFeeInput`
  → Suggested Spanish: **[ES: serviceFeeInput]**
  Snippet: :aria-label="t('serviceFeeInput')"

- **L216** `t(key)` key: `serviceFeeDescription`
  → Suggested Spanish: **[ES: serviceFeeDescription]**
  Snippet: {{ t('serviceFeeDescription') }}

- **L224** `t(key)` key: `taxRate`
  → Suggested Spanish: **[ES: taxRate]**
  Snippet: {{ t('taxRate') }}

- **L234** `t(key)` key: `taxRateInput`
  → Suggested Spanish: **[ES: taxRateInput]**
  Snippet: :aria-label="t('taxRateInput')"

- **L240** `t(key)` key: `taxRateDescription`
  → Suggested Spanish: **[ES: taxRateDescription]**
  Snippet: {{ t('taxRateDescription') }}

- **L248** `t(key)` key: `feeCalculator`
  → Suggested Spanish: **[ES: feeCalculator]**
  Snippet: <h4 class="calculator-title">{{ t('feeCalculator') }}</h4>

- **L251** `t(key)` key: `orderSubtotal`
  → Suggested Spanish: **[ES: orderSubtotal]**
  Snippet: <span class="calculator-label">{{ t('orderSubtotal') }}</span>

- **L255** `t(key)` key: `deliveryFee`
  → Suggested Spanish: **[ES: deliveryFee]**
  Snippet: <span class="calculator-label">{{ t('deliveryFee') }}</span>

- **L259** `t(key)` key: `serviceFee`
  → Suggested Spanish: **[ES: serviceFee]**
  Snippet: <span class="calculator-label">{{ t('serviceFee') }}</span>

- **L263** `t(key)` key: `taxes`
  → Suggested Spanish: **[ES: taxes]**
  Snippet: <span class="calculator-label">{{ t('taxes') }}</span>

- **L267** `t(key)` key: `total`
  → Suggested Spanish: **Total**
  Snippet: <span class="calculator-label">{{ t('total') }}</span>

- **L280** `t(key)` key: `deliveryOptions`
  → Suggested Spanish: **[ES: deliveryOptions]**
  Snippet: {{ t('deliveryOptions') }}

- **L342** `t(key)` key: `deliveryTimes`
  → Suggested Spanish: **[ES: deliveryTimes]**
  Snippet: {{ t('deliveryTimes') }}

- **L359** `t(key)` key: `averageDeliveryTime`
  → Suggested Spanish: **[ES: averageDeliveryTime]**
  Snippet: {{ t('averageDeliveryTime') }}

- **L371** `t(key)` key: `averageDeliveryTimeInput`
  → Suggested Spanish: **[ES: averageDeliveryTimeInput]**
  Snippet: :aria-label="t('averageDeliveryTimeInput')"

- **L374** `t(key)` key: `minutes`
  → Suggested Spanish: **[ES: minutes]**
  Snippet: <span class="input-unit">{{ t('minutes') }}</span>

- **L378** `t(key)` key: `averageDeliveryTimeDescription`
  → Suggested Spanish: **[ES: averageDeliveryTimeDescription]**
  Snippet: {{ t('averageDeliveryTimeDescription') }}

- **L385** `t(key)` key: `deliveryHours`
  → Suggested Spanish: **[ES: deliveryHours]**
  Snippet: <h4 class="hours-title">{{ t('deliveryHours') }}</h4>

- **L409** `t(key)` key: `to`
  → Suggested Spanish: **[ES: to]**
  Snippet: <span class="time-separator">{{ t('to') }}</span>

- **L420** `t(key)` key: `copyScheduleToAllDays`
  → Suggested Spanish: **[ES: copyScheduleToAllDays]**
  Snippet: :aria-label="t('copyScheduleToAllDays')"

- **L426** `t(key)` key: `closed`
  → Suggested Spanish: **[ES: closed]**
  Snippet: {{ t('closed') }}

- **L436** `t(key)` key: `peakHours`
  → Suggested Spanish: **[ES: peakHours]**
  Snippet: {{ t('peakHours') }}

- **L440** `t(key)` key: `peakTime`
  → Suggested Spanish: **[ES: peakTime]**
  Snippet: <label class="peak-label">{{ t('peakTime') }}</label>

- **L445** `t(key)` key: `peakStartTime`
  → Suggested Spanish: **[ES: peakStartTime]**
  Snippet: :aria-label="t('peakStartTime')"

- **L447** `t(key)` key: `to`
  → Suggested Spanish: **[ES: to]**
  Snippet: <span class="time-separator">{{ t('to') }}</span>

- **L452** `t(key)` key: `peakEndTime`
  → Suggested Spanish: **[ES: peakEndTime]**
  Snippet: :aria-label="t('peakEndTime')"

- **L456** `t(key)` key: `peakHourFee`
  → Suggested Spanish: **[ES: peakHourFee]**
  Snippet: <label class="peak-label">{{ t('peakHourFee') }}</label>

- **L465** `t(key)` key: `peakHourFeeInput`
  → Suggested Spanish: **[ES: peakHourFeeInput]**
  Snippet: :aria-label="t('peakHourFeeInput')"

- **L479** `t(key)` key: `advancedSettings`
  → Suggested Spanish: **[ES: advancedSettings]**
  Snippet: {{ t('advancedSettings') }}

- **L487** `t(key)` key: `hideAdvanced`
  → Suggested Spanish: **[ES: hideAdvanced]**
  Snippet: {{ showAdvancedSettings ? t('hideAdvanced') : t('showAdvanced') }}

- **L487** `t(key)` key: `showAdvanced`
  → Suggested Spanish: **[ES: showAdvanced]**
  Snippet: {{ showAdvancedSettings ? t('hideAdvanced') : t('showAdvanced') }}

- **L495** `t(key)` key: `maxDeliveriesPerHour`
  → Suggested Spanish: **[ES: maxDeliveriesPerHour]**
  Snippet: <label class="form-label">{{ t('maxDeliveriesPerHour') }}</label>

- **L502** `t(key)` key: `maxDeliveriesPerHourInput`
  → Suggested Spanish: **[ES: maxDeliveriesPerHourInput]**
  Snippet: :aria-label="t('maxDeliveriesPerHourInput')"

- **L508** `t(key)` key: `preparationTime`
  → Suggested Spanish: **[ES: preparationTime]**
  Snippet: <label class="form-label">{{ t('preparationTime') }}</label>

- **L517** `t(key)` key: `preparationTimeInput`
  → Suggested Spanish: **[ES: preparationTimeInput]**
  Snippet: :aria-label="t('preparationTimeInput')"

- **L519** `t(key)` key: `minutes`
  → Suggested Spanish: **[ES: minutes]**
  Snippet: <span class="input-unit">{{ t('minutes') }}</span>

- **L525** `t(key)` key: `driverCommission`
  → Suggested Spanish: **[ES: driverCommission]**
  Snippet: <label class="form-label">{{ t('driverCommission') }}</label>

- **L534** `t(key)` key: `driverCommissionInput`
  → Suggested Spanish: **[ES: driverCommissionInput]**
  Snippet: :aria-label="t('driverCommissionInput')"

- **L542** `t(key)` key: `autoAssignDrivers`
  → Suggested Spanish: **[ES: autoAssignDrivers]**
  Snippet: <label class="form-label">{{ t('autoAssignDrivers') }}</label>

- **L548** `t(key)` key: `autoAssignDriversInput`
  → Suggested Spanish: **[ES: autoAssignDriversInput]**
  Snippet: :aria-label="t('autoAssignDriversInput')"

- **L551** `t(key)` key: `enableAutoAssign`
  → Suggested Spanish: **[ES: enableAutoAssign]**
  Snippet: <span class="checkbox-text">{{ t('enableAutoAssign') }}</span>

- **L565** `t(key)` key: `cancelChanges`
  → Suggested Spanish: **[ES: cancelChanges]**
  Snippet: :aria-label="t('cancelChanges')"

- **L569** `t(key)` key: `cancel`
  → Suggested Spanish: **Cancelar**
  Snippet: {{ t('cancel') }}

- **L574** `t(key)` key: `saveDeliverySettings`
  → Suggested Spanish: **[ES: saveDeliverySettings]**
  Snippet: :aria-label="t('saveDeliverySettings')"

- **L580** `t(key)` key: `saving`
  → Suggested Spanish: **[ES: saving]**
  Snippet: {{ t('saving') }}

- **L584** `t(key)` key: `saveChanges`
  → Suggested Spanish: **[ES: saveChanges]**
  Snippet: {{ t('saveChanges') }}

- **L594** `t(key)` key: `settingsSummary`
  → Suggested Spanish: **[ES: settingsSummary]**
  Snippet: <h3 class="sidebar-title">{{ t('settingsSummary') }}</h3>

- **L599** `t(key)` key: `deliveryRadius`
  → Suggested Spanish: **[ES: deliveryRadius]**
  Snippet: <span class="summary-label">{{ t('deliveryRadius') }}</span>

- **L606** `t(key)` key: `deliveryFee`
  → Suggested Spanish: **[ES: deliveryFee]**
  Snippet: <span class="summary-label">{{ t('deliveryFee') }}</span>

- **L613** `t(key)` key: `minimumOrder`
  → Suggested Spanish: **[ES: minimumOrder]**
  Snippet: <span class="summary-label">{{ t('minimumOrder') }}</span>

- **L620** `t(key)` key: `deliveryTime`
  → Suggested Spanish: **[ES: deliveryTime]**
  Snippet: <span class="summary-label">{{ t('deliveryTime') }}</span>

- **L621** `t(key)` key: `minutes`
  → Suggested Spanish: **[ES: minutes]**
  Snippet: <span class="summary-value">{{ averageDeliveryTime }} {{ t('minutes') }}</span>

- **L629** `t(key)` key: `serviceStatus`
  → Suggested Spanish: **[ES: serviceStatus]**
  Snippet: <h3 class="sidebar-title">{{ t('serviceStatus') }}</h3>

- **L654** `t(key)` key: `quickActions`
  → Suggested Spanish: **[ES: quickActions]**
  Snippet: <h3 class="sidebar-title">{{ t('quickActions') }}</h3>

- **L659** `t(key)` key: `testDeliveryCalculator`
  → Suggested Spanish: **[ES: testDeliveryCalculator]**
  Snippet: :aria-label="t('testDeliveryCalculator')"

- **L662** `t(key)` key: `testCalculator`
  → Suggested Spanish: **[ES: testCalculator]**
  Snippet: {{ t('testCalculator') }}

- **L667** `t(key)` key: `viewDeliveryAnalytics`
  → Suggested Spanish: **[ES: viewDeliveryAnalytics]**
  Snippet: :aria-label="t('viewDeliveryAnalytics')"

- **L670** `t(key)` key: `viewAnalytics`
  → Suggested Spanish: **[ES: viewAnalytics]**
  Snippet: {{ t('viewAnalytics') }}

- **L675** `t(key)` key: `exportDeliverySettings`
  → Suggested Spanish: **[ES: exportDeliverySettings]**
  Snippet: :aria-label="t('exportDeliverySettings')"

- **L678** `t(key)` key: `exportSettings`
  → Suggested Spanish: **[ES: exportSettings]**
  Snippet: {{ t('exportSettings') }}

- **L683** `t(key)` key: `copySettingsLink`
  → Suggested Spanish: **[ES: copySettingsLink]**
  Snippet: :aria-label="t('copySettingsLink')"

- **L686** `t(key)` key: `copyLink`
  → Suggested Spanish: **[ES: copyLink]**
  Snippet: {{ t('copyLink') }}

- **L693** `t(key)` key: `recentChanges`
  → Suggested Spanish: **[ES: recentChanges]**
  Snippet: <h3 class="sidebar-title">{{ t('recentChanges') }}</h3>

- **L749** `t(key)` key: `monday`
  → Suggested Spanish: **[ES: monday]**
  Snippet: { id: 0, name: t('monday'), enabled: true, startTime: '10:00', endTime: '22:00' },

- **L750** `t(key)` key: `tuesday`
  → Suggested Spanish: **[ES: tuesday]**
  Snippet: { id: 1, name: t('tuesday'), enabled: true, startTime: '10:00', endTime: '22:00' },

- **L751** `t(key)` key: `wednesday`
  → Suggested Spanish: **[ES: wednesday]**
  Snippet: { id: 2, name: t('wednesday'), enabled: true, startTime: '10:00', endTime: '22:00' },

- **L752** `t(key)` key: `thursday`
  → Suggested Spanish: **[ES: thursday]**
  Snippet: { id: 3, name: t('thursday'), enabled: true, startTime: '10:00', endTime: '22:00' },

- **L753** `t(key)` key: `friday`
  → Suggested Spanish: **[ES: friday]**
  Snippet: { id: 4, name: t('friday'), enabled: true, startTime: '10:00', endTime: '23:00' },

- **L754** `t(key)` key: `saturday`
  → Suggested Spanish: **[ES: saturday]**
  Snippet: { id: 5, name: t('saturday'), enabled: true, startTime: '11:00', endTime: '23:00' },

- **L755** `t(key)` key: `sunday`
  → Suggested Spanish: **[ES: sunday]**
  Snippet: { id: 6, name: t('sunday'), enabled: true, startTime: '12:00', endTime: '21:00' },

- **L762** `t(key)` key: `enablePickup`
  → Suggested Spanish: **[ES: enablePickup]**
  Snippet: title: t('enablePickup'),

- **L763** `t(key)` key: `allowCustomersPickup`
  → Suggested Spanish: **[ES: allowCustomersPickup]**
  Snippet: description: t('allowCustomersPickup'),

- **L767** `t(key)` key: `togglePickupService`
  → Suggested Spanish: **[ES: togglePickupService]**
  Snippet: ariaLabel: t('togglePickupService'),

- **L771** `t(key)` key: `pickupPreparationTime`
  → Suggested Spanish: **[ES: pickupPreparationTime]**
  Snippet: label: t('pickupPreparationTime'),

- **L777** `t(key)` key: `pickupPreparationTimeInput`
  → Suggested Spanish: **[ES: pickupPreparationTimeInput]**
  Snippet: ariaLabel: t('pickupPreparationTimeInput')

- **L783** `t(key)` key: `enableDelivery`
  → Suggested Spanish: **[ES: enableDelivery]**
  Snippet: title: t('enableDelivery'),

- **L784** `t(key)` key: `offerDeliveryService`
  → Suggested Spanish: **[ES: offerDeliveryService]**
  Snippet: description: t('offerDeliveryService'),

- **L788** `t(key)` key: `toggleDeliveryService`
  → Suggested Spanish: **[ES: toggleDeliveryService]**
  Snippet: ariaLabel: t('toggleDeliveryService'),

- **L792** `t(key)` key: `deliveryBufferTime`
  → Suggested Spanish: **[ES: deliveryBufferTime]**
  Snippet: label: t('deliveryBufferTime'),

- **L798** `t(key)` key: `deliveryBufferTimeInput`
  → Suggested Spanish: **[ES: deliveryBufferTimeInput]**
  Snippet: ariaLabel: t('deliveryBufferTimeInput')

- **L804** `t(key)` key: `expressDelivery`
  → Suggested Spanish: **[ES: expressDelivery]**
  Snippet: title: t('expressDelivery'),

- **L805** `t(key)` key: `offerExpressDelivery`
  → Suggested Spanish: **[ES: offerExpressDelivery]**
  Snippet: description: t('offerExpressDelivery'),

- **L809** `t(key)` key: `toggleExpressDelivery`
  → Suggested Spanish: **[ES: toggleExpressDelivery]**
  Snippet: ariaLabel: t('toggleExpressDelivery'),

- **L813** `t(key)` key: `expressFee`
  → Suggested Spanish: **[ES: expressFee]**
  Snippet: label: t('expressFee'),

- **L818** `t(key)` key: `expressFeeInput`
  → Suggested Spanish: **[ES: expressFeeInput]**
  Snippet: ariaLabel: t('expressFeeInput')

- **L822** `t(key)` key: `expressTime`
  → Suggested Spanish: **[ES: expressTime]**
  Snippet: label: t('expressTime'),

- **L828** `t(key)` key: `expressTimeInput`
  → Suggested Spanish: **[ES: expressTimeInput]**
  Snippet: ariaLabel: t('expressTimeInput')

- **L834** `t(key)` key: `scheduledDelivery`
  → Suggested Spanish: **[ES: scheduledDelivery]**
  Snippet: title: t('scheduledDelivery'),

- **L835** `t(key)` key: `allowScheduledDelivery`
  → Suggested Spanish: **[ES: allowScheduledDelivery]**
  Snippet: description: t('allowScheduledDelivery'),

- **L839** `t(key)` key: `toggleScheduledDelivery`
  → Suggested Spanish: **[ES: toggleScheduledDelivery]**
  Snippet: ariaLabel: t('toggleScheduledDelivery'),

- **L843** `t(key)` key: `advanceBookingHours`
  → Suggested Spanish: **[ES: advanceBookingHours]**
  Snippet: label: t('advanceBookingHours'),

- **L849** `t(key)` key: `advanceBookingHoursInput`
  → Suggested Spanish: **[ES: advanceBookingHoursInput]**
  Snippet: ariaLabel: t('advanceBookingHoursInput')

- **L857** `t(key)` key: `fastDelivery`
  → Suggested Spanish: **[ES: fastDelivery]**
  Snippet: { id: 'fast', label: t('fastDelivery'), value: 15, active: false },

- **L858** `t(key)` key: `standardDelivery`
  → Suggested Spanish: **[ES: standardDelivery]**
  Snippet: { id: 'standard', label: t('standardDelivery'), value: 30, active: true },

- **L859** `t(key)` key: `relaxedDelivery`
  → Suggested Spanish: **[ES: relaxedDelivery]**
  Snippet: { id: 'relaxed', label: t('relaxedDelivery'), value: 45, active: false }

- **L864** `t(key)` key: `pickupService`
  → Suggested Spanish: **[ES: pickupService]**
  Snippet: { id: 'pickup', label: t('pickupService'), active: true, color: 'green' },

- **L865** `t(key)` key: `deliveryService`
  → Suggested Spanish: **[ES: deliveryService]**
  Snippet: { id: 'delivery', label: t('deliveryService'), active: true, color: 'blue' },

- **L866** `t(key)` key: `expressService`
  → Suggested Spanish: **[ES: expressService]**
  Snippet: { id: 'express', label: t('expressService'), active: false, color: 'orange' }

- **L871** `t(key)` key: `deliveryFeeUpdated`
  → Suggested Spanish: **[ES: deliveryFeeUpdated]**
  Snippet: { id: 1, description: t('deliveryFeeUpdated'), time: '2 hours ago', type: 'update', icon: 'ri-money-

- **L872** `t(key)` key: `deliveryHoursExtended`
  → Suggested Spanish: **[ES: deliveryHoursExtended]**
  Snippet: { id: 2, description: t('deliveryHoursExtended'), time: '1 day ago', type: 'add', icon: 'ri-time-lin

- **L873** `t(key)` key: `pickupEnabled`
  → Suggested Spanish: **[ES: pickupEnabled]**
  Snippet: { id: 3, description: t('pickupEnabled'), time: '3 days ago', type: 'enable', icon: 'ri-store-2-line

- **L960** `t(key)` key: `confirmReset`
  → Suggested Spanish: **[ES: confirmReset]**
  Snippet: if (confirm(t('confirmReset'))) {

- **L976** `t(key)` key: `confirmCancel`
  → Suggested Spanish: **[ES: confirmCancel]**
  Snippet: if (confirm(t('confirmCancel'))) {

- **L1002** `t(key)` key: `settingsSaved`
  → Suggested Spanish: **[ES: settingsSaved]**
  Snippet: alert(t('settingsSaved'));

- **L1005** `t(key)` key: `saveError`
  → Suggested Spanish: **[ES: saveError]**
  Snippet: alert(t('saveError'));

- **L1020** `t(key)` key: `calculatorTestMessage`
  → Suggested Spanish: **[ES: calculatorTestMessage]**
  Snippet: alert(t('calculatorTestMessage'));

- **L1036** `t(key)` key: `linkCopied`
  → Suggested Spanish: **[ES: linkCopied]**
  Snippet: alert(t('linkCopied'));

- **L397** `t(key, params)` key: `enableDeliveryFor`
  → Suggested Spanish: **[ES: enableDeliveryFor]**
  Snippet: :aria-label="t('enableDeliveryFor', { day: day.name })"

- **L407** `t(key, params)` key: `startTimeFor`
  → Suggested Spanish: **[ES: startTimeFor]**
  Snippet: :aria-label="t('startTimeFor', { day: day.name })"

- **L414** `t(key, params)` key: `endTimeFor`
  → Suggested Spanish: **[ES: endTimeFor]**
  Snippet: :aria-label="t('endTimeFor', { day: day.name })"

- **L719** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/settings/GeneralSettings.vue

- **L8** `t(key)` key: `deliverySettings`
  → Suggested Spanish: **[ES: deliverySettings]**
  Snippet: {{ t('deliverySettings') }}

- **L11** `t(key)` key: `deliverySettingsDescription`
  → Suggested Spanish: **[ES: deliverySettingsDescription]**
  Snippet: {{ t('deliverySettingsDescription') }}

- **L18** `t(key)` key: `resetToDefaults`
  → Suggested Spanish: **[ES: resetToDefaults]**
  Snippet: :aria-label="t('resetToDefaults')"

- **L21** `t(key)` key: `reset`
  → Suggested Spanish: **Restablecer**
  Snippet: {{ t('reset') }}

- **L26** `t(key)` key: `saveAsTemplate`
  → Suggested Spanish: **[ES: saveAsTemplate]**
  Snippet: :aria-label="t('saveAsTemplate')"

- **L29** `t(key)` key: `saveTemplate`
  → Suggested Spanish: **[ES: saveTemplate]**
  Snippet: {{ t('saveTemplate') }}

- **L43** `t(key)` key: `settings`
  → Suggested Spanish: **Configuración**
  Snippet: {{ t('settings') }}

- **L50** `t(key)` key: `delivery`
  → Suggested Spanish: **Repartidor**
  Snippet: {{ t('delivery') }}

- **L62** `t(key)` key: `deliveryZones`
  → Suggested Spanish: **[ES: deliveryZones]**
  Snippet: {{ t('deliveryZones') }}

- **L67** `t(key)` key: `manageDeliveryZones`
  → Suggested Spanish: **[ES: manageDeliveryZones]**
  Snippet: :aria-label="t('manageDeliveryZones')"

- **L70** `t(key)` key: `addZone`
  → Suggested Spanish: **[ES: addZone]**
  Snippet: {{ t('addZone') }}

- **L78** `t(key)` key: `zoneMapPreview`
  → Suggested Spanish: **[ES: zoneMapPreview]**
  Snippet: <p class="map-placeholder-text">{{ t('zoneMapPreview') }}</p>

- **L85** `t(key)` key: `deliveryRadius`
  → Suggested Spanish: **[ES: deliveryRadius]**
  Snippet: <span class="stat-label">{{ t('deliveryRadius') }}</span>

- **L92** `t(key)` key: `deliveryFee`
  → Suggested Spanish: **[ES: deliveryFee]**
  Snippet: <span class="stat-label">{{ t('deliveryFee') }}</span>

- **L101** `t(key)` key: `deliveryRadius`
  → Suggested Spanish: **[ES: deliveryRadius]**
  Snippet: {{ t('deliveryRadius') }}

- **L113** `t(key)` key: `deliveryRadiusInput`
  → Suggested Spanish: **[ES: deliveryRadiusInput]**
  Snippet: :aria-label="t('deliveryRadiusInput')"

- **L120** `t(key)` key: `deliveryRadiusDescription`
  → Suggested Spanish: **[ES: deliveryRadiusDescription]**
  Snippet: {{ t('deliveryRadiusDescription') }}

- **L132** `t(key)` key: `pricingAndFees`
  → Suggested Spanish: **[ES: pricingAndFees]**
  Snippet: {{ t('pricingAndFees') }}

- **L135** `t(key)` key: `currency`
  → Suggested Spanish: **[ES: currency]**
  Snippet: <label class="currency-label">{{ t('currency') }}:</label>

- **L149** `t(key)` key: `deliveryFee`
  → Suggested Spanish: **[ES: deliveryFee]**
  Snippet: {{ t('deliveryFee') }}

- **L161** `t(key)` key: `deliveryFeeInput`
  → Suggested Spanish: **[ES: deliveryFeeInput]**
  Snippet: :aria-label="t('deliveryFeeInput')"

- **L167** `t(key)` key: `deliveryFeeDescription`
  → Suggested Spanish: **[ES: deliveryFeeDescription]**
  Snippet: {{ t('deliveryFeeDescription') }}

- **L175** `t(key)` key: `minimumOrder`
  → Suggested Spanish: **[ES: minimumOrder]**
  Snippet: {{ t('minimumOrder') }}

- **L187** `t(key)` key: `minimumOrderInput`
  → Suggested Spanish: **[ES: minimumOrderInput]**
  Snippet: :aria-label="t('minimumOrderInput')"

- **L193** `t(key)` key: `minimumOrderDescription`
  → Suggested Spanish: **[ES: minimumOrderDescription]**
  Snippet: {{ t('minimumOrderDescription') }}

- **L201** `t(key)` key: `serviceFee`
  → Suggested Spanish: **[ES: serviceFee]**
  Snippet: {{ t('serviceFee') }}

- **L211** `t(key)` key: `serviceFeeInput`
  → Suggested Spanish: **[ES: serviceFeeInput]**
  Snippet: :aria-label="t('serviceFeeInput')"

- **L216** `t(key)` key: `serviceFeeDescription`
  → Suggested Spanish: **[ES: serviceFeeDescription]**
  Snippet: {{ t('serviceFeeDescription') }}

- **L224** `t(key)` key: `taxRate`
  → Suggested Spanish: **[ES: taxRate]**
  Snippet: {{ t('taxRate') }}

- **L234** `t(key)` key: `taxRateInput`
  → Suggested Spanish: **[ES: taxRateInput]**
  Snippet: :aria-label="t('taxRateInput')"

- **L240** `t(key)` key: `taxRateDescription`
  → Suggested Spanish: **[ES: taxRateDescription]**
  Snippet: {{ t('taxRateDescription') }}

- **L248** `t(key)` key: `feeCalculator`
  → Suggested Spanish: **[ES: feeCalculator]**
  Snippet: <h4 class="calculator-title">{{ t('feeCalculator') }}</h4>

- **L251** `t(key)` key: `orderSubtotal`
  → Suggested Spanish: **[ES: orderSubtotal]**
  Snippet: <span class="calculator-label">{{ t('orderSubtotal') }}</span>

- **L255** `t(key)` key: `deliveryFee`
  → Suggested Spanish: **[ES: deliveryFee]**
  Snippet: <span class="calculator-label">{{ t('deliveryFee') }}</span>

- **L259** `t(key)` key: `serviceFee`
  → Suggested Spanish: **[ES: serviceFee]**
  Snippet: <span class="calculator-label">{{ t('serviceFee') }}</span>

- **L263** `t(key)` key: `taxes`
  → Suggested Spanish: **[ES: taxes]**
  Snippet: <span class="calculator-label">{{ t('taxes') }}</span>

- **L267** `t(key)` key: `total`
  → Suggested Spanish: **Total**
  Snippet: <span class="calculator-label">{{ t('total') }}</span>

- **L280** `t(key)` key: `deliveryOptions`
  → Suggested Spanish: **[ES: deliveryOptions]**
  Snippet: {{ t('deliveryOptions') }}

- **L342** `t(key)` key: `deliveryTimes`
  → Suggested Spanish: **[ES: deliveryTimes]**
  Snippet: {{ t('deliveryTimes') }}

- **L359** `t(key)` key: `averageDeliveryTime`
  → Suggested Spanish: **[ES: averageDeliveryTime]**
  Snippet: {{ t('averageDeliveryTime') }}

- **L371** `t(key)` key: `averageDeliveryTimeInput`
  → Suggested Spanish: **[ES: averageDeliveryTimeInput]**
  Snippet: :aria-label="t('averageDeliveryTimeInput')"

- **L374** `t(key)` key: `minutes`
  → Suggested Spanish: **[ES: minutes]**
  Snippet: <span class="input-unit">{{ t('minutes') }}</span>

- **L378** `t(key)` key: `averageDeliveryTimeDescription`
  → Suggested Spanish: **[ES: averageDeliveryTimeDescription]**
  Snippet: {{ t('averageDeliveryTimeDescription') }}

- **L385** `t(key)` key: `deliveryHours`
  → Suggested Spanish: **[ES: deliveryHours]**
  Snippet: <h4 class="hours-title">{{ t('deliveryHours') }}</h4>

- **L409** `t(key)` key: `to`
  → Suggested Spanish: **[ES: to]**
  Snippet: <span class="time-separator">{{ t('to') }}</span>

- **L420** `t(key)` key: `copyScheduleToAllDays`
  → Suggested Spanish: **[ES: copyScheduleToAllDays]**
  Snippet: :aria-label="t('copyScheduleToAllDays')"

- **L426** `t(key)` key: `closed`
  → Suggested Spanish: **[ES: closed]**
  Snippet: {{ t('closed') }}

- **L436** `t(key)` key: `peakHours`
  → Suggested Spanish: **[ES: peakHours]**
  Snippet: {{ t('peakHours') }}

- **L440** `t(key)` key: `peakTime`
  → Suggested Spanish: **[ES: peakTime]**
  Snippet: <label class="peak-label">{{ t('peakTime') }}</label>

- **L445** `t(key)` key: `peakStartTime`
  → Suggested Spanish: **[ES: peakStartTime]**
  Snippet: :aria-label="t('peakStartTime')"

- **L447** `t(key)` key: `to`
  → Suggested Spanish: **[ES: to]**
  Snippet: <span class="time-separator">{{ t('to') }}</span>

- **L452** `t(key)` key: `peakEndTime`
  → Suggested Spanish: **[ES: peakEndTime]**
  Snippet: :aria-label="t('peakEndTime')"

- **L456** `t(key)` key: `peakHourFee`
  → Suggested Spanish: **[ES: peakHourFee]**
  Snippet: <label class="peak-label">{{ t('peakHourFee') }}</label>

- **L465** `t(key)` key: `peakHourFeeInput`
  → Suggested Spanish: **[ES: peakHourFeeInput]**
  Snippet: :aria-label="t('peakHourFeeInput')"

- **L479** `t(key)` key: `advancedSettings`
  → Suggested Spanish: **[ES: advancedSettings]**
  Snippet: {{ t('advancedSettings') }}

- **L487** `t(key)` key: `hideAdvanced`
  → Suggested Spanish: **[ES: hideAdvanced]**
  Snippet: {{ showAdvancedSettings ? t('hideAdvanced') : t('showAdvanced') }}

- **L487** `t(key)` key: `showAdvanced`
  → Suggested Spanish: **[ES: showAdvanced]**
  Snippet: {{ showAdvancedSettings ? t('hideAdvanced') : t('showAdvanced') }}

- **L495** `t(key)` key: `maxDeliveriesPerHour`
  → Suggested Spanish: **[ES: maxDeliveriesPerHour]**
  Snippet: <label class="form-label">{{ t('maxDeliveriesPerHour') }}</label>

- **L502** `t(key)` key: `maxDeliveriesPerHourInput`
  → Suggested Spanish: **[ES: maxDeliveriesPerHourInput]**
  Snippet: :aria-label="t('maxDeliveriesPerHourInput')"

- **L508** `t(key)` key: `preparationTime`
  → Suggested Spanish: **[ES: preparationTime]**
  Snippet: <label class="form-label">{{ t('preparationTime') }}</label>

- **L517** `t(key)` key: `preparationTimeInput`
  → Suggested Spanish: **[ES: preparationTimeInput]**
  Snippet: :aria-label="t('preparationTimeInput')"

- **L519** `t(key)` key: `minutes`
  → Suggested Spanish: **[ES: minutes]**
  Snippet: <span class="input-unit">{{ t('minutes') }}</span>

- **L525** `t(key)` key: `driverCommission`
  → Suggested Spanish: **[ES: driverCommission]**
  Snippet: <label class="form-label">{{ t('driverCommission') }}</label>

- **L534** `t(key)` key: `driverCommissionInput`
  → Suggested Spanish: **[ES: driverCommissionInput]**
  Snippet: :aria-label="t('driverCommissionInput')"

- **L542** `t(key)` key: `autoAssignDrivers`
  → Suggested Spanish: **[ES: autoAssignDrivers]**
  Snippet: <label class="form-label">{{ t('autoAssignDrivers') }}</label>

- **L548** `t(key)` key: `autoAssignDriversInput`
  → Suggested Spanish: **[ES: autoAssignDriversInput]**
  Snippet: :aria-label="t('autoAssignDriversInput')"

- **L551** `t(key)` key: `enableAutoAssign`
  → Suggested Spanish: **[ES: enableAutoAssign]**
  Snippet: <span class="checkbox-text">{{ t('enableAutoAssign') }}</span>

- **L565** `t(key)` key: `cancelChanges`
  → Suggested Spanish: **[ES: cancelChanges]**
  Snippet: :aria-label="t('cancelChanges')"

- **L569** `t(key)` key: `cancel`
  → Suggested Spanish: **Cancelar**
  Snippet: {{ t('cancel') }}

- **L574** `t(key)` key: `saveDeliverySettings`
  → Suggested Spanish: **[ES: saveDeliverySettings]**
  Snippet: :aria-label="t('saveDeliverySettings')"

- **L580** `t(key)` key: `saving`
  → Suggested Spanish: **[ES: saving]**
  Snippet: {{ t('saving') }}

- **L584** `t(key)` key: `saveChanges`
  → Suggested Spanish: **[ES: saveChanges]**
  Snippet: {{ t('saveChanges') }}

- **L594** `t(key)` key: `settingsSummary`
  → Suggested Spanish: **[ES: settingsSummary]**
  Snippet: <h3 class="sidebar-title">{{ t('settingsSummary') }}</h3>

- **L599** `t(key)` key: `deliveryRadius`
  → Suggested Spanish: **[ES: deliveryRadius]**
  Snippet: <span class="summary-label">{{ t('deliveryRadius') }}</span>

- **L606** `t(key)` key: `deliveryFee`
  → Suggested Spanish: **[ES: deliveryFee]**
  Snippet: <span class="summary-label">{{ t('deliveryFee') }}</span>

- **L613** `t(key)` key: `minimumOrder`
  → Suggested Spanish: **[ES: minimumOrder]**
  Snippet: <span class="summary-label">{{ t('minimumOrder') }}</span>

- **L620** `t(key)` key: `deliveryTime`
  → Suggested Spanish: **[ES: deliveryTime]**
  Snippet: <span class="summary-label">{{ t('deliveryTime') }}</span>

- **L621** `t(key)` key: `minutes`
  → Suggested Spanish: **[ES: minutes]**
  Snippet: <span class="summary-value">{{ averageDeliveryTime }} {{ t('minutes') }}</span>

- **L629** `t(key)` key: `serviceStatus`
  → Suggested Spanish: **[ES: serviceStatus]**
  Snippet: <h3 class="sidebar-title">{{ t('serviceStatus') }}</h3>

- **L654** `t(key)` key: `quickActions`
  → Suggested Spanish: **[ES: quickActions]**
  Snippet: <h3 class="sidebar-title">{{ t('quickActions') }}</h3>

- **L659** `t(key)` key: `testDeliveryCalculator`
  → Suggested Spanish: **[ES: testDeliveryCalculator]**
  Snippet: :aria-label="t('testDeliveryCalculator')"

- **L662** `t(key)` key: `testCalculator`
  → Suggested Spanish: **[ES: testCalculator]**
  Snippet: {{ t('testCalculator') }}

- **L667** `t(key)` key: `viewDeliveryAnalytics`
  → Suggested Spanish: **[ES: viewDeliveryAnalytics]**
  Snippet: :aria-label="t('viewDeliveryAnalytics')"

- **L670** `t(key)` key: `viewAnalytics`
  → Suggested Spanish: **[ES: viewAnalytics]**
  Snippet: {{ t('viewAnalytics') }}

- **L675** `t(key)` key: `exportDeliverySettings`
  → Suggested Spanish: **[ES: exportDeliverySettings]**
  Snippet: :aria-label="t('exportDeliverySettings')"

- **L678** `t(key)` key: `exportSettings`
  → Suggested Spanish: **[ES: exportSettings]**
  Snippet: {{ t('exportSettings') }}

- **L683** `t(key)` key: `copySettingsLink`
  → Suggested Spanish: **[ES: copySettingsLink]**
  Snippet: :aria-label="t('copySettingsLink')"

- **L686** `t(key)` key: `copyLink`
  → Suggested Spanish: **[ES: copyLink]**
  Snippet: {{ t('copyLink') }}

- **L693** `t(key)` key: `recentChanges`
  → Suggested Spanish: **[ES: recentChanges]**
  Snippet: <h3 class="sidebar-title">{{ t('recentChanges') }}</h3>

- **L749** `t(key)` key: `monday`
  → Suggested Spanish: **[ES: monday]**
  Snippet: { id: 0, name: t('monday'), enabled: true, startTime: '10:00', endTime: '22:00' },

- **L750** `t(key)` key: `tuesday`
  → Suggested Spanish: **[ES: tuesday]**
  Snippet: { id: 1, name: t('tuesday'), enabled: true, startTime: '10:00', endTime: '22:00' },

- **L751** `t(key)` key: `wednesday`
  → Suggested Spanish: **[ES: wednesday]**
  Snippet: { id: 2, name: t('wednesday'), enabled: true, startTime: '10:00', endTime: '22:00' },

- **L752** `t(key)` key: `thursday`
  → Suggested Spanish: **[ES: thursday]**
  Snippet: { id: 3, name: t('thursday'), enabled: true, startTime: '10:00', endTime: '22:00' },

- **L753** `t(key)` key: `friday`
  → Suggested Spanish: **[ES: friday]**
  Snippet: { id: 4, name: t('friday'), enabled: true, startTime: '10:00', endTime: '23:00' },

- **L754** `t(key)` key: `saturday`
  → Suggested Spanish: **[ES: saturday]**
  Snippet: { id: 5, name: t('saturday'), enabled: true, startTime: '11:00', endTime: '23:00' },

- **L755** `t(key)` key: `sunday`
  → Suggested Spanish: **[ES: sunday]**
  Snippet: { id: 6, name: t('sunday'), enabled: true, startTime: '12:00', endTime: '21:00' },

- **L762** `t(key)` key: `enablePickup`
  → Suggested Spanish: **[ES: enablePickup]**
  Snippet: title: t('enablePickup'),

- **L763** `t(key)` key: `allowCustomersPickup`
  → Suggested Spanish: **[ES: allowCustomersPickup]**
  Snippet: description: t('allowCustomersPickup'),

- **L767** `t(key)` key: `togglePickupService`
  → Suggested Spanish: **[ES: togglePickupService]**
  Snippet: ariaLabel: t('togglePickupService'),

- **L771** `t(key)` key: `pickupPreparationTime`
  → Suggested Spanish: **[ES: pickupPreparationTime]**
  Snippet: label: t('pickupPreparationTime'),

- **L777** `t(key)` key: `pickupPreparationTimeInput`
  → Suggested Spanish: **[ES: pickupPreparationTimeInput]**
  Snippet: ariaLabel: t('pickupPreparationTimeInput')

- **L783** `t(key)` key: `enableDelivery`
  → Suggested Spanish: **[ES: enableDelivery]**
  Snippet: title: t('enableDelivery'),

- **L784** `t(key)` key: `offerDeliveryService`
  → Suggested Spanish: **[ES: offerDeliveryService]**
  Snippet: description: t('offerDeliveryService'),

- **L788** `t(key)` key: `toggleDeliveryService`
  → Suggested Spanish: **[ES: toggleDeliveryService]**
  Snippet: ariaLabel: t('toggleDeliveryService'),

- **L792** `t(key)` key: `deliveryBufferTime`
  → Suggested Spanish: **[ES: deliveryBufferTime]**
  Snippet: label: t('deliveryBufferTime'),

- **L798** `t(key)` key: `deliveryBufferTimeInput`
  → Suggested Spanish: **[ES: deliveryBufferTimeInput]**
  Snippet: ariaLabel: t('deliveryBufferTimeInput')

- **L804** `t(key)` key: `expressDelivery`
  → Suggested Spanish: **[ES: expressDelivery]**
  Snippet: title: t('expressDelivery'),

- **L805** `t(key)` key: `offerExpressDelivery`
  → Suggested Spanish: **[ES: offerExpressDelivery]**
  Snippet: description: t('offerExpressDelivery'),

- **L809** `t(key)` key: `toggleExpressDelivery`
  → Suggested Spanish: **[ES: toggleExpressDelivery]**
  Snippet: ariaLabel: t('toggleExpressDelivery'),

- **L813** `t(key)` key: `expressFee`
  → Suggested Spanish: **[ES: expressFee]**
  Snippet: label: t('expressFee'),

- **L818** `t(key)` key: `expressFeeInput`
  → Suggested Spanish: **[ES: expressFeeInput]**
  Snippet: ariaLabel: t('expressFeeInput')

- **L822** `t(key)` key: `expressTime`
  → Suggested Spanish: **[ES: expressTime]**
  Snippet: label: t('expressTime'),

- **L828** `t(key)` key: `expressTimeInput`
  → Suggested Spanish: **[ES: expressTimeInput]**
  Snippet: ariaLabel: t('expressTimeInput')

- **L834** `t(key)` key: `scheduledDelivery`
  → Suggested Spanish: **[ES: scheduledDelivery]**
  Snippet: title: t('scheduledDelivery'),

- **L835** `t(key)` key: `allowScheduledDelivery`
  → Suggested Spanish: **[ES: allowScheduledDelivery]**
  Snippet: description: t('allowScheduledDelivery'),

- **L839** `t(key)` key: `toggleScheduledDelivery`
  → Suggested Spanish: **[ES: toggleScheduledDelivery]**
  Snippet: ariaLabel: t('toggleScheduledDelivery'),

- **L843** `t(key)` key: `advanceBookingHours`
  → Suggested Spanish: **[ES: advanceBookingHours]**
  Snippet: label: t('advanceBookingHours'),

- **L849** `t(key)` key: `advanceBookingHoursInput`
  → Suggested Spanish: **[ES: advanceBookingHoursInput]**
  Snippet: ariaLabel: t('advanceBookingHoursInput')

- **L857** `t(key)` key: `fastDelivery`
  → Suggested Spanish: **[ES: fastDelivery]**
  Snippet: { id: 'fast', label: t('fastDelivery'), value: 15, active: false },

- **L858** `t(key)` key: `standardDelivery`
  → Suggested Spanish: **[ES: standardDelivery]**
  Snippet: { id: 'standard', label: t('standardDelivery'), value: 30, active: true },

- **L859** `t(key)` key: `relaxedDelivery`
  → Suggested Spanish: **[ES: relaxedDelivery]**
  Snippet: { id: 'relaxed', label: t('relaxedDelivery'), value: 45, active: false }

- **L864** `t(key)` key: `pickupService`
  → Suggested Spanish: **[ES: pickupService]**
  Snippet: { id: 'pickup', label: t('pickupService'), active: true, color: 'green' },

- **L865** `t(key)` key: `deliveryService`
  → Suggested Spanish: **[ES: deliveryService]**
  Snippet: { id: 'delivery', label: t('deliveryService'), active: true, color: 'blue' },

- **L866** `t(key)` key: `expressService`
  → Suggested Spanish: **[ES: expressService]**
  Snippet: { id: 'express', label: t('expressService'), active: false, color: 'orange' }

- **L871** `t(key)` key: `deliveryFeeUpdated`
  → Suggested Spanish: **[ES: deliveryFeeUpdated]**
  Snippet: { id: 1, description: t('deliveryFeeUpdated'), time: '2 hours ago', type: 'update', icon: 'ri-money-

- **L872** `t(key)` key: `deliveryHoursExtended`
  → Suggested Spanish: **[ES: deliveryHoursExtended]**
  Snippet: { id: 2, description: t('deliveryHoursExtended'), time: '1 day ago', type: 'add', icon: 'ri-time-lin

- **L873** `t(key)` key: `pickupEnabled`
  → Suggested Spanish: **[ES: pickupEnabled]**
  Snippet: { id: 3, description: t('pickupEnabled'), time: '3 days ago', type: 'enable', icon: 'ri-store-2-line

- **L960** `t(key)` key: `confirmReset`
  → Suggested Spanish: **[ES: confirmReset]**
  Snippet: if (confirm(t('confirmReset'))) {

- **L976** `t(key)` key: `confirmCancel`
  → Suggested Spanish: **[ES: confirmCancel]**
  Snippet: if (confirm(t('confirmCancel'))) {

- **L1002** `t(key)` key: `settingsSaved`
  → Suggested Spanish: **[ES: settingsSaved]**
  Snippet: alert(t('settingsSaved'));

- **L1005** `t(key)` key: `saveError`
  → Suggested Spanish: **[ES: saveError]**
  Snippet: alert(t('saveError'));

- **L1020** `t(key)` key: `calculatorTestMessage`
  → Suggested Spanish: **[ES: calculatorTestMessage]**
  Snippet: alert(t('calculatorTestMessage'));

- **L1036** `t(key)` key: `linkCopied`
  → Suggested Spanish: **[ES: linkCopied]**
  Snippet: alert(t('linkCopied'));

- **L397** `t(key, params)` key: `enableDeliveryFor`
  → Suggested Spanish: **[ES: enableDeliveryFor]**
  Snippet: :aria-label="t('enableDeliveryFor', { day: day.name })"

- **L407** `t(key, params)` key: `startTimeFor`
  → Suggested Spanish: **[ES: startTimeFor]**
  Snippet: :aria-label="t('startTimeFor', { day: day.name })"

- **L414** `t(key, params)` key: `endTimeFor`
  → Suggested Spanish: **[ES: endTimeFor]**
  Snippet: :aria-label="t('endTimeFor', { day: day.name })"

- **L719** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/settings/MenuSettings.vue

- **L3** `t(key)` key: `businessSettings.title`
  → Suggested Spanish: **[ES: businessSettings.title]**
  Snippet: <h1 class="text-3xl font-bold text-gray-900">{{ t('businessSettings.title') }}</h1>

- **L5** `t(key)` key: `businessSettings.subtitle`
  → Suggested Spanish: **Gestiona tu negocio**
  Snippet: {{ t('businessSettings.subtitle') }}

- **L11** `t(key)` key: `businessSettings.category.title`
  → Suggested Spanish: **[ES: businessSettings.category.title]**
  Snippet: <h2 class="text-xl font-semibold text-gray-800">{{ t('businessSettings.category.title') }}</h2>

- **L16** `t(key)` key: `common.save`
  → Suggested Spanish: **[ES: common.save]**
  Snippet: {{ editingCategory ? t('common.save') : t('common.edit') }}

- **L16** `t(key)` key: `common.edit`
  → Suggested Spanish: **[ES: common.edit]**
  Snippet: {{ editingCategory ? t('common.save') : t('common.edit') }}

- **L22** `t(key)` key: `businessSettings.category.primaryCuisine`
  → Suggested Spanish: **[ES: businessSettings.category.primaryCuisine]**
  Snippet: <label class="text-gray-700 font-medium text-lg">{{ t('businessSettings.category.primaryCuisine') }}

- **L27** `t(key)` key: `businessSettings.category.primaryCuisineTooltip`
  → Suggested Spanish: **[ES: businessSettings.category.primaryCuisineTooltip]**
  Snippet: :title="t('businessSettings.category.primaryCuisineTooltip')"

- **L29** `t(key)` key: `businessSettings.category.selectCuisine`
  → Suggested Spanish: **[ES: businessSettings.category.selectCuisine]**
  Snippet: <option value="">{{ t('businessSettings.category.selectCuisine') }}</option>

- **L30** `t(key)` key: `cuisine.pizza`
  → Suggested Spanish: **[ES: cuisine.pizza]**
  Snippet: <option value="pizza">{{ t('cuisine.pizza') }}</option>

- **L31** `t(key)` key: `cuisine.burger`
  → Suggested Spanish: **[ES: cuisine.burger]**
  Snippet: <option value="burger">{{ t('cuisine.burger') }}</option>

- **L32** `t(key)` key: `cuisine.sushi`
  → Suggested Spanish: **[ES: cuisine.sushi]**
  Snippet: <option value="sushi">{{ t('cuisine.sushi') }}</option>

- **L33** `t(key)` key: `cuisine.mexican`
  → Suggested Spanish: **[ES: cuisine.mexican]**
  Snippet: <option value="mexican">{{ t('cuisine.mexican') }}</option>

- **L34** `t(key)` key: `cuisine.dessert`
  → Suggested Spanish: **[ES: cuisine.dessert]**
  Snippet: <option value="dessert">{{ t('cuisine.dessert') }}</option>

- **L35** `t(key)` key: `cuisine.other`
  → Suggested Spanish: **[ES: cuisine.other]**
  Snippet: <option value="other">{{ t('cuisine.other') }}</option>

- **L40** `t(key)` key: `businessSettings.category.additionalTags`
  → Suggested Spanish: **[ES: businessSettings.category.additionalTags]**
  Snippet: <label class="text-gray-700 font-medium text-lg">{{ t('businessSettings.category.additionalTags') }}

- **L45** `t(key)` key: `businessSettings.category.tagsPlaceholder`
  → Suggested Spanish: **[ES: businessSettings.category.tagsPlaceholder]**
  Snippet: :placeholder="t('businessSettings.category.tagsPlaceholder')"

- **L47** `t(key)` key: `businessSettings.category.tagsTooltip`
  → Suggested Spanish: **[ES: businessSettings.category.tagsTooltip]**
  Snippet: :title="t('businessSettings.category.tagsTooltip')"

- **L52** `t(key)` key: `businessSettings.category.menuDescription`
  → Suggested Spanish: **[ES: businessSettings.category.menuDescription]**
  Snippet: <label class="text-gray-700 font-medium text-lg">{{ t('businessSettings.category.menuDescription') }

- **L56** `t(key)` key: `businessSettings.category.descriptionPlaceholder`
  → Suggested Spanish: **[ES: businessSettings.category.descriptionPlaceholder]**
  Snippet: :placeholder="t('businessSettings.category.descriptionPlaceholder')"

- **L58** `t(key)` key: `businessSettings.category.descriptionTooltip`
  → Suggested Spanish: **[ES: businessSettings.category.descriptionTooltip]**
  Snippet: :title="t('businessSettings.category.descriptionTooltip')"

- **L68** `t(key)` key: `businessSettings.delivery.title`
  → Suggested Spanish: **[ES: businessSettings.delivery.title]**
  Snippet: {{ t('businessSettings.delivery.title') }}

- **L74** `t(key)` key: `common.save`
  → Suggested Spanish: **[ES: common.save]**
  Snippet: {{ editingDelivery ? t('common.save') : t('common.edit') }}

- **L74** `t(key)` key: `common.edit`
  → Suggested Spanish: **[ES: common.edit]**
  Snippet: {{ editingDelivery ? t('common.save') : t('common.edit') }}

- **L87** `t(key)` key: `businessSettings.delivery.enablePickup`
  → Suggested Spanish: **[ES: businessSettings.delivery.enablePickup]**
  Snippet: <span class="text-gray-700 text-lg">{{ t('businessSettings.delivery.enablePickup') }}</span>

- **L96** `t(key)` key: `businessSettings.delivery.enableDelivery`
  → Suggested Spanish: **[ES: businessSettings.delivery.enableDelivery]**
  Snippet: <span class="text-gray-700 text-lg">{{ t('businessSettings.delivery.enableDelivery') }}</span>

- **L106** `t(key)` key: `businessSettings.promotions.title`
  → Suggested Spanish: **[ES: businessSettings.promotions.title]**
  Snippet: {{ t('businessSettings.promotions.title') }}

- **L112** `t(key)` key: `common.save`
  → Suggested Spanish: **[ES: common.save]**
  Snippet: {{ editingPromo ? t('common.save') : t('common.edit') }}

- **L112** `t(key)` key: `common.edit`
  → Suggested Spanish: **[ES: common.edit]**
  Snippet: {{ editingPromo ? t('common.save') : t('common.edit') }}

- **L124** `t(key)` key: `businessSettings.promotions.enableFreeDelivery`
  → Suggested Spanish: **[ES: businessSettings.promotions.enableFreeDelivery]**
  Snippet: <span class="text-gray-700 text-lg">{{ t('businessSettings.promotions.enableFreeDelivery') }}</span>

- **L129** `t(key)` key: `businessSettings.promotions.minimumOrder`
  → Suggested Spanish: **[ES: businessSettings.promotions.minimumOrder]**
  Snippet: <label class="text-gray-700 font-medium text-lg">{{ t('businessSettings.promotions.minimumOrder') }}

- **L135** `t(key)` key: `businessSettings.promotions.minOrderPlaceholder`
  → Suggested Spanish: **[ES: businessSettings.promotions.minOrderPlaceholder]**
  Snippet: :placeholder="t('businessSettings.promotions.minOrderPlaceholder')"

- **L137** `t(key)` key: `businessSettings.promotions.minOrderTooltip`
  → Suggested Spanish: **[ES: businessSettings.promotions.minOrderTooltip]**
  Snippet: :title="t('businessSettings.promotions.minOrderTooltip')"

- **L142** `t(key)` key: `businessSettings.promotions.activeSchedule`
  → Suggested Spanish: **[ES: businessSettings.promotions.activeSchedule]**
  Snippet: <label class="block text-gray-700 font-medium text-lg mb-2">{{ t('businessSettings.promotions.active

- **L149** `t(key)` key: `days.${day.label.toLowerCase()}`
  → Suggested Spanish: **[ES: days.${day.label.toLowerCase()}]**
  Snippet: <span class="w-24 font-medium">{{ t(`days.${day.label.toLowerCase()}`) }}</span>

- **L158** `t(key)` key: `businessSettings.promotions.active`
  → Suggested Spanish: **[ES: businessSettings.promotions.active]**
  Snippet: <span class="text-sm text-gray-700">{{ t('businessSettings.promotions.active') }}</span>

- **L149** `t(dynamic)` key: ``days.${day.label.toLowerCase()}``
  → Suggested Spanish: **[ES: `days.${day.label.toLowerCase()}`]**
  Snippet: <span class="w-24 font-medium">{{ t(`days.${day.label.toLowerCase()}`) }}</span>

- **L188** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/settings/NotificationSettings.vue

- **L5** `t(key)` key: `notificationPreferences`
  → Suggested Spanish: **[ES: notificationPreferences]**
  Snippet: <h3 class="text-gray-900 mb-6">{{ t('notificationPreferences') }}</h3>

- **L11** `t(key)` key: `orderNotifications`
  → Suggested Spanish: **[ES: orderNotifications]**
  Snippet: {{ t('orderNotifications') }}

- **L15** `t(key)` key: `newOrders`
  → Suggested Spanish: **[ES: newOrders]**
  Snippet: <span class="text-gray-700">{{ t('newOrders') }}</span>

- **L23** `t(key)` key: `orderCancellations`
  → Suggested Spanish: **[ES: orderCancellations]**
  Snippet: <span class="text-gray-700">{{ t('orderCancellations') }}</span>

- **L36** `t(key)` key: `reviewNotifications`
  → Suggested Spanish: **[ES: reviewNotifications]**
  Snippet: {{ t('reviewNotifications') }}

- **L40** `t(key)` key: `newReviews`
  → Suggested Spanish: **[ES: newReviews]**
  Snippet: <span class="text-gray-700">{{ t('newReviews') }}</span>

- **L48** `t(key)` key: `reviewResponses`
  → Suggested Spanish: **[ES: reviewResponses]**
  Snippet: <span class="text-gray-700">{{ t('reviewResponses') }}</span>

- **L64** `t(key)` key: `cancel`
  → Suggested Spanish: **Cancelar**
  Snippet: {{ t('cancel') }}

- **L69** `t(key)` key: `saveChanges`
  → Suggested Spanish: **[ES: saveChanges]**
  Snippet: {{ t('saveChanges') }}

- **L77** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/settings/OperatingHoursDay.vue

- **L4** `t(key)` key: `weeklyPreferences`
  → Suggested Spanish: **[ES: weeklyPreferences]**
  Snippet: {{ t('weeklyPreferences') }}

- **L6** `t(key)` key: `weeklyPreferencesDescription`
  → Suggested Spanish: **[ES: weeklyPreferencesDescription]**
  Snippet: <p class="text-gray-500">{{ t('weeklyPreferencesDescription') }}</p>

- **L17** `t(key)` key: `available`
  → Suggested Spanish: **[ES: available]**
  Snippet: <span class="text-sm text-gray-700">{{ t('available') }}</span>

- **L35** `t(key)` key: `save`
  → Suggested Spanish: **[ES: save]**
  Snippet: {{ day.editable ? t('save') : t('edit') }}

- **L35** `t(key)` key: `edit`
  → Suggested Spanish: **[ES: edit]**
  Snippet: {{ day.editable ? t('save') : t('edit') }}

- **L44** `t(key)` key: `dayOff`
  → Suggested Spanish: **[ES: dayOff]**
  Snippet: {{ t('dayOff') }}

- **L51** `t(key)` key: `specialOverrides`
  → Suggested Spanish: **[ES: specialOverrides]**
  Snippet: <h4 class="font-semibold text-gray-800">{{ t('specialOverrides') }}</h4>

- **L75** `t(key)` key: `holidayEvent`
  → Suggested Spanish: **[ES: holidayEvent]**
  Snippet: :placeholder="t('holidayEvent')"

- **L82** `t(key)` key: `remove`
  → Suggested Spanish: **[ES: remove]**
  Snippet: {{ t('remove') }}

- **L86** `t(key)` key: `addSpecialDay`
  → Suggested Spanish: **[ES: addSpecialDay]**
  Snippet: + {{ t('addSpecialDay') }}

- **L91** `t(key)` key: `yearlyView`
  → Suggested Spanish: **[ES: yearlyView]**
  Snippet: <h4 class="font-semibold text-gray-800">{{ t('yearlyView') }}</h4>

- **L92** `t(key)` key: `yearlyViewDescription`
  → Suggested Spanish: **[ES: yearlyViewDescription]**
  Snippet: <p class="text-gray-500 text-sm">{{ t('yearlyViewDescription') }}</p>

- **L14** `t(dynamic)` key: `day.label`
  → Suggested Spanish: **[ES: day.label]**
  Snippet: <span class="col-span-2 font-medium">{{ t(day.label) }}</span>

- **L100** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/settings/PaymentSettings.vue

- **L5** `t(key)` key: `paymentMethods`
  → Suggested Spanish: **[ES: paymentMethods]**
  Snippet: {{ t('paymentMethods') }}

- **L38** `t(key)` key: `taxSettings`
  → Suggested Spanish: **[ES: taxSettings]**
  Snippet: {{ t('taxSettings') }}

- **L44** `t(key)` key: `taxRate`
  → Suggested Spanish: **[ES: taxRate]**
  Snippet: t('taxRate')

- **L60** `t(key)` key: `includeTax`
  → Suggested Spanish: **[ES: includeTax]**
  Snippet: <span class="text-gray-700">{{ t('includeTax') }}</span>

- **L69** `t(key)` key: `cancel`
  → Suggested Spanish: **Cancelar**
  Snippet: {{ t('cancel') }}

- **L74** `t(key)` key: `saveChanges`
  → Suggested Spanish: **[ES: saveChanges]**
  Snippet: {{ t('saveChanges') }}

- **L23** `t(dynamic)` key: `method.name`
  → Suggested Spanish: **Nombre**
  Snippet: <p class="font-medium text-gray-900">{{ t(method.name) }}</p>

- **L24** `t(dynamic)` key: `method.description`
  → Suggested Spanish: **[ES: method.description]**
  Snippet: <p class="text-sm text-gray-500">{{ t(method.description) }}</p>

- **L82** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/settings/StaffSettings.vue

- **L6** `t(key)` key: `staffManagement`
  → Suggested Spanish: **[ES: staffManagement]**
  Snippet: {{ t('staffManagement') }}

- **L14** `t(key)` key: `addStaff`
  → Suggested Spanish: **[ES: addStaff]**
  Snippet: {{ t('addStaff') }}

- **L52** `t(key)` key: `cancel`
  → Suggested Spanish: **Cancelar**
  Snippet: {{ t('cancel') }}

- **L57** `t(key)` key: `saveChanges`
  → Suggested Spanish: **[ES: saveChanges]**
  Snippet: {{ t('saveChanges') }}

- **L39** `t(dynamic)` key: `member.role`
  → Suggested Spanish: **[ES: member.role]**
  Snippet: {{ t(member.role) }} • {{ member.email }}

- **L43** `t(dynamic)` key: `member.status`
  → Suggested Spanish: **[ES: member.status]**
  Snippet: <span :class="member.statusClass">{{ t(member.status) }}</span>

- **L65** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/components/TopSellingItem.vue

- **L37** `t(key)` key: `popularItem`
  → Suggested Spanish: **[ES: popularItem]**
  Snippet: <span v-if="isPopular" class="popular-badge" :title="$t('popularItem')">

- **L40** `t(key)` key: `newItem`
  → Suggested Spanish: **[ES: newItem]**
  Snippet: <span v-if="isNew" class="new-badge" :title="$t('newItem')">

- **L41** `t(key)` key: `new`
  → Suggested Spanish: **[ES: new]**
  Snippet: {{ $t('new') }}

- **L79** `t(key)` key: `rating`
  → Suggested Spanish: **[ES: rating]**
  Snippet: <span class="stat-label">{{ $t('rating') }}</span>

- **L87** `t(key)` key: `successRate`
  → Suggested Spanish: **[ES: successRate]**
  Snippet: <span class="stat-label">{{ $t('successRate') }}</span>

- **L96** `t(key)` key: `progress`
  → Suggested Spanish: **[ES: progress]**
  Snippet: <span>{{ $t('progress') }}</span>

- **L125** `t(key)` key: `vsPrevious`
  → Suggested Spanish: **[ES: vsPrevious]**
  Snippet: <span class="comparison-label">{{ $t('vsPrevious') }}</span>

- **L236** `t(key)` key: `order`
  → Suggested Spanish: **[ES: order]**
  Snippet: return orderCount === 1 ? t('order') : t('orders', orderCount);

- **L277** `t(key, params)` key: `topItemAriaLabel`
  → Suggested Spanish: **[ES: topItemAriaLabel]**
  Snippet: return t('topItemAriaLabel', {

- **L37** `$t(key)` key: `popularItem`
  → Suggested Spanish: **[ES: popularItem]**
  Snippet: <span v-if="isPopular" class="popular-badge" :title="$t('popularItem')">

- **L40** `$t(key)` key: `newItem`
  → Suggested Spanish: **[ES: newItem]**
  Snippet: <span v-if="isNew" class="new-badge" :title="$t('newItem')">

- **L41** `$t(key)` key: `new`
  → Suggested Spanish: **[ES: new]**
  Snippet: {{ $t('new') }}

- **L79** `$t(key)` key: `rating`
  → Suggested Spanish: **[ES: rating]**
  Snippet: <span class="stat-label">{{ $t('rating') }}</span>

- **L87** `$t(key)` key: `successRate`
  → Suggested Spanish: **[ES: successRate]**
  Snippet: <span class="stat-label">{{ $t('successRate') }}</span>

- **L96** `$t(key)` key: `progress`
  → Suggested Spanish: **[ES: progress]**
  Snippet: <span>{{ $t('progress') }}</span>

- **L125** `$t(key)` key: `vsPrevious`
  → Suggested Spanish: **[ES: vsPrevious]**
  Snippet: <span class="comparison-label">{{ $t('vsPrevious') }}</span>

- **L159** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/containers/AnalyticsPanel.vue

- **L11** `t(key)` key: `analytics`
  → Suggested Spanish: **[ES: analytics]**
  Snippet: {{ $t('analytics') }}

- **L14** `t(key)` key: `trackPerformance`
  → Suggested Spanish: **[ES: trackPerformance]**
  Snippet: {{ $t('trackPerformance') }}

- **L16** `t(key)` key: `lastUpdated`
  → Suggested Spanish: **[ES: lastUpdated]**
  Snippet: {{ $t('lastUpdated') }}: {{ formatTime(analyticsData.lastUpdated) }}

- **L69** `t(key)` key: `export`
  → Suggested Spanish: **[ES: export]**
  Snippet: <span class="hidden xs:inline">{{ $t('export') }}</span>

- **L82** `t(key)` key: `refreshing`
  → Suggested Spanish: **[ES: refreshing]**
  Snippet: <span class="hidden xs:inline">{{ loading ? $t('refreshing') : $t('refresh') }}</span>

- **L82** `t(key)` key: `refresh`
  → Suggested Spanish: **[ES: refresh]**
  Snippet: <span class="hidden xs:inline">{{ loading ? $t('refreshing') : $t('refresh') }}</span>

- **L90** `t(key)` key: `totalRevenue`
  → Suggested Spanish: **[ES: totalRevenue]**
  Snippet: :title="$t('totalRevenue')"

- **L101** `t(key)` key: `totalOrders`
  → Suggested Spanish: **[ES: totalOrders]**
  Snippet: :title="$t('totalOrders')"

- **L112** `t(key)` key: `avgOrderValue`
  → Suggested Spanish: **[ES: avgOrderValue]**
  Snippet: :title="$t('avgOrderValue')"

- **L122** `t(key)` key: `customerRating`
  → Suggested Spanish: **[ES: customerRating]**
  Snippet: :title="$t('customerRating')"

- **L167** `t(key)` key: `revenueTrend`
  → Suggested Spanish: **[ES: revenueTrend]**
  Snippet: {{ $t('revenueTrend') }}

- **L198** `t(key)` key: `revenueChartPlaceholder`
  → Suggested Spanish: **[ES: revenueChartPlaceholder]**
  Snippet: <p class="text-xs sm:text-sm">{{ $t('revenueChartPlaceholder') }}</p>

- **L207** `t(key)` key: `ordersByHour`
  → Suggested Spanish: **[ES: ordersByHour]**
  Snippet: {{ $t('ordersByHour') }}

- **L228** `t(key)` key: `ordersByHourPlaceholder`
  → Suggested Spanish: **[ES: ordersByHourPlaceholder]**
  Snippet: <p class="text-xs sm:text-sm">{{ $t('ordersByHourPlaceholder') }}</p>

- **L236** `t(key)` key: `salesByCategory`
  → Suggested Spanish: **[ES: salesByCategory]**
  Snippet: {{ $t('salesByCategory') }}

- **L249** `t(key)` key: `salesByCategoryPlaceholder`
  → Suggested Spanish: **[ES: salesByCategoryPlaceholder]**
  Snippet: <p class="text-xs sm:text-sm">{{ $t('salesByCategoryPlaceholder') }}</p>

- **L258** `t(key)` key: `topSellingItems`
  → Suggested Spanish: **[ES: topSellingItems]**
  Snippet: {{ $t('topSellingItems') }}

- **L296** `t(key)` key: `noTopItemsData`
  → Suggested Spanish: **[ES: noTopItemsData]**
  Snippet: <p class="text-xs sm:text-sm">{{ $t('noTopItemsData') }}</p>

- **L305** `t(key)` key: `performanceInsights`
  → Suggested Spanish: **[ES: performanceInsights]**
  Snippet: {{ $t('performanceInsights') }}

- **L340** `t(key)` key: `comingSoon`
  → Suggested Spanish: **[ES: comingSoon]**
  Snippet: {{ $t('comingSoon') }}

- **L343** `t(key)` key: `featureComingSoon`
  → Suggested Spanish: **[ES: featureComingSoon]**
  Snippet: {{ $t('featureComingSoon') }}

- **L401** `t(key)` key: `peakHoursDescription`
  → Suggested Spanish: **[ES: peakHoursDescription]**
  Snippet: description: t('peakHoursDescription'),

- **L412** `t(key)` key: `bestCategoryDescription`
  → Suggested Spanish: **[ES: bestCategoryDescription]**
  Snippet: description: t('bestCategoryDescription'),

- **L416** `t(key)` key: `pizza`
  → Suggested Spanish: **[ES: pizza]**
  Snippet: metric: t('pizza'),

- **L423** `t(key)` key: `customerGrowthDescription`
  → Suggested Spanish: **[ES: customerGrowthDescription]**
  Snippet: description: t('customerGrowthDescription'),

- **L11** `$t(key)` key: `analytics`
  → Suggested Spanish: **[ES: analytics]**
  Snippet: {{ $t('analytics') }}

- **L14** `$t(key)` key: `trackPerformance`
  → Suggested Spanish: **[ES: trackPerformance]**
  Snippet: {{ $t('trackPerformance') }}

- **L16** `$t(key)` key: `lastUpdated`
  → Suggested Spanish: **[ES: lastUpdated]**
  Snippet: {{ $t('lastUpdated') }}: {{ formatTime(analyticsData.lastUpdated) }}

- **L69** `$t(key)` key: `export`
  → Suggested Spanish: **[ES: export]**
  Snippet: <span class="hidden xs:inline">{{ $t('export') }}</span>

- **L82** `$t(key)` key: `refreshing`
  → Suggested Spanish: **[ES: refreshing]**
  Snippet: <span class="hidden xs:inline">{{ loading ? $t('refreshing') : $t('refresh') }}</span>

- **L82** `$t(key)` key: `refresh`
  → Suggested Spanish: **[ES: refresh]**
  Snippet: <span class="hidden xs:inline">{{ loading ? $t('refreshing') : $t('refresh') }}</span>

- **L90** `$t(key)` key: `totalRevenue`
  → Suggested Spanish: **[ES: totalRevenue]**
  Snippet: :title="$t('totalRevenue')"

- **L101** `$t(key)` key: `totalOrders`
  → Suggested Spanish: **[ES: totalOrders]**
  Snippet: :title="$t('totalOrders')"

- **L112** `$t(key)` key: `avgOrderValue`
  → Suggested Spanish: **[ES: avgOrderValue]**
  Snippet: :title="$t('avgOrderValue')"

- **L122** `$t(key)` key: `customerRating`
  → Suggested Spanish: **[ES: customerRating]**
  Snippet: :title="$t('customerRating')"

- **L167** `$t(key)` key: `revenueTrend`
  → Suggested Spanish: **[ES: revenueTrend]**
  Snippet: {{ $t('revenueTrend') }}

- **L198** `$t(key)` key: `revenueChartPlaceholder`
  → Suggested Spanish: **[ES: revenueChartPlaceholder]**
  Snippet: <p class="text-xs sm:text-sm">{{ $t('revenueChartPlaceholder') }}</p>

- **L207** `$t(key)` key: `ordersByHour`
  → Suggested Spanish: **[ES: ordersByHour]**
  Snippet: {{ $t('ordersByHour') }}

- **L228** `$t(key)` key: `ordersByHourPlaceholder`
  → Suggested Spanish: **[ES: ordersByHourPlaceholder]**
  Snippet: <p class="text-xs sm:text-sm">{{ $t('ordersByHourPlaceholder') }}</p>

- **L236** `$t(key)` key: `salesByCategory`
  → Suggested Spanish: **[ES: salesByCategory]**
  Snippet: {{ $t('salesByCategory') }}

- **L249** `$t(key)` key: `salesByCategoryPlaceholder`
  → Suggested Spanish: **[ES: salesByCategoryPlaceholder]**
  Snippet: <p class="text-xs sm:text-sm">{{ $t('salesByCategoryPlaceholder') }}</p>

- **L258** `$t(key)` key: `topSellingItems`
  → Suggested Spanish: **[ES: topSellingItems]**
  Snippet: {{ $t('topSellingItems') }}

- **L296** `$t(key)` key: `noTopItemsData`
  → Suggested Spanish: **[ES: noTopItemsData]**
  Snippet: <p class="text-xs sm:text-sm">{{ $t('noTopItemsData') }}</p>

- **L305** `$t(key)` key: `performanceInsights`
  → Suggested Spanish: **[ES: performanceInsights]**
  Snippet: {{ $t('performanceInsights') }}

- **L340** `$t(key)` key: `comingSoon`
  → Suggested Spanish: **[ES: comingSoon]**
  Snippet: {{ $t('comingSoon') }}

- **L343** `$t(key)` key: `featureComingSoon`
  → Suggested Spanish: **[ES: featureComingSoon]**
  Snippet: {{ $t('featureComingSoon') }}

- **L55** `t(dynamic)` key: `period.label`
  → Suggested Spanish: **[ES: period.label]**
  Snippet: <span>{{ $t(period.label) }}</span>

- **L149** `t(dynamic)` key: `tab.label`
  → Suggested Spanish: **[ES: tab.label]**
  Snippet: <span>{{ $t(tab.label) }}</span>

- **L181** `t(dynamic)` key: `chartType`
  → Suggested Spanish: **[ES: chartType]**
  Snippet: {{ $t(chartType) }}

- **L319** `t(dynamic)` key: `insight.title`
  → Suggested Spanish: **[ES: insight.title]**
  Snippet: <h4 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{{ $t(insight.title) }}

- **L468** `t(dynamic)` key: `periodKey`
  → Suggested Spanish: **[ES: periodKey]**
  Snippet: return `${prefix}${value}${unit} ${t(periodKey)}`;

- **L364** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/containers/MenuManagement.vue

- **L11** `t(key)` key: `menuManagement`
  → Suggested Spanish: **[ES: menuManagement]**
  Snippet: {{ $t('menuManagement') }}

- **L14** `t(key)` key: `trackMenuItems`
  → Suggested Spanish: **[ES: trackMenuItems]**
  Snippet: {{ $t('trackMenuItems') }}

- **L28** `t(key)` key: `searchMenuPlaceholder`
  → Suggested Spanish: **[ES: searchMenuPlaceholder]**
  Snippet: :placeholder="$t('searchMenuPlaceholder')"

- **L47** `t(key)` key: `addMenuItem`
  → Suggested Spanish: **[ES: addMenuItem]**
  Snippet: {{ $t('addMenuItem') }}

- **L73** `t(key)` key: `changeFromLastMonth`
  → Suggested Spanish: **[ES: changeFromLastMonth]**
  Snippet: {{ $t('changeFromLastMonth') }}

- **L118** `t(key)` key: `swipeForMoreCategories`
  → Suggested Spanish: **[ES: swipeForMoreCategories]**
  Snippet: {{ $t('swipeForMoreCategories') }}

- **L130** `t(key)` key: `export`
  → Suggested Spanish: **[ES: export]**
  Snippet: {{ $t('export') }}

- **L137** `t(key)` key: `printMenu`
  → Suggested Spanish: **[ES: printMenu]**
  Snippet: {{ $t('printMenu') }}

- **L144** `t(key)` key: `disableAll`
  → Suggested Spanish: **[ES: disableAll]**
  Snippet: {{ allItemsAvailable ? $t('disableAll') : $t('enableAll') }}

- **L144** `t(key)` key: `enableAll`
  → Suggested Spanish: **[ES: enableAll]**
  Snippet: {{ allItemsAvailable ? $t('disableAll') : $t('enableAll') }}

- **L168** `t(key)` key: `noMenuItemsFound`
  → Suggested Spanish: **[ES: noMenuItemsFound]**
  Snippet: {{ searchQuery ? $t('noMenuItemsFound') : $t('noMenuItems') }}

- **L168** `t(key)` key: `noMenuItems`
  → Suggested Spanish: **[ES: noMenuItems]**
  Snippet: {{ searchQuery ? $t('noMenuItemsFound') : $t('noMenuItems') }}

- **L171** `t(key)` key: `tryDifferentSearchMenu`
  → Suggested Spanish: **[ES: tryDifferentSearchMenu]**
  Snippet: {{ searchQuery ? $t('tryDifferentSearchMenu') : $t('addFirstMenuItemPrompt') }}

- **L171** `t(key)` key: `addFirstMenuItemPrompt`
  → Suggested Spanish: **[ES: addFirstMenuItemPrompt]**
  Snippet: {{ searchQuery ? $t('tryDifferentSearchMenu') : $t('addFirstMenuItemPrompt') }}

- **L179** `t(key)` key: `addMenuItem`
  → Suggested Spanish: **[ES: addMenuItem]**
  Snippet: {{ $t('addMenuItem') }}

- **L204** `t(key)` key: `addNewItem`
  → Suggested Spanish: **[ES: addNewItem]**
  Snippet: {{ $t('addNewItem') }}

- **L207** `t(key)` key: `addNewItemDescription`
  → Suggested Spanish: **[ES: addNewItemDescription]**
  Snippet: {{ $t('addNewItemDescription') }}

- **L215** `t(key)` key: `showing`
  → Suggested Spanish: **[ES: showing]**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L215** `t(key)` key: `of`
  → Suggested Spanish: **[ES: of]**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L224** `t(key)` key: `previous`
  → Suggested Spanish: **[ES: previous]**
  Snippet: {{ $t('previous') }}

- **L231** `t(key)` key: `next`
  → Suggested Spanish: **[ES: next]**
  Snippet: {{ $t('next') }}

- **L447** `t(key, params)` key: `confirmDeleteItem`
  → Suggested Spanish: **[ES: confirmDeleteItem]**
  Snippet: if (confirm(t('confirmDeleteItem', { name: item.name }))) {

- **L11** `$t(key)` key: `menuManagement`
  → Suggested Spanish: **[ES: menuManagement]**
  Snippet: {{ $t('menuManagement') }}

- **L14** `$t(key)` key: `trackMenuItems`
  → Suggested Spanish: **[ES: trackMenuItems]**
  Snippet: {{ $t('trackMenuItems') }}

- **L28** `$t(key)` key: `searchMenuPlaceholder`
  → Suggested Spanish: **[ES: searchMenuPlaceholder]**
  Snippet: :placeholder="$t('searchMenuPlaceholder')"

- **L47** `$t(key)` key: `addMenuItem`
  → Suggested Spanish: **[ES: addMenuItem]**
  Snippet: {{ $t('addMenuItem') }}

- **L73** `$t(key)` key: `changeFromLastMonth`
  → Suggested Spanish: **[ES: changeFromLastMonth]**
  Snippet: {{ $t('changeFromLastMonth') }}

- **L118** `$t(key)` key: `swipeForMoreCategories`
  → Suggested Spanish: **[ES: swipeForMoreCategories]**
  Snippet: {{ $t('swipeForMoreCategories') }}

- **L130** `$t(key)` key: `export`
  → Suggested Spanish: **[ES: export]**
  Snippet: {{ $t('export') }}

- **L137** `$t(key)` key: `printMenu`
  → Suggested Spanish: **[ES: printMenu]**
  Snippet: {{ $t('printMenu') }}

- **L144** `$t(key)` key: `disableAll`
  → Suggested Spanish: **[ES: disableAll]**
  Snippet: {{ allItemsAvailable ? $t('disableAll') : $t('enableAll') }}

- **L144** `$t(key)` key: `enableAll`
  → Suggested Spanish: **[ES: enableAll]**
  Snippet: {{ allItemsAvailable ? $t('disableAll') : $t('enableAll') }}

- **L168** `$t(key)` key: `noMenuItemsFound`
  → Suggested Spanish: **[ES: noMenuItemsFound]**
  Snippet: {{ searchQuery ? $t('noMenuItemsFound') : $t('noMenuItems') }}

- **L168** `$t(key)` key: `noMenuItems`
  → Suggested Spanish: **[ES: noMenuItems]**
  Snippet: {{ searchQuery ? $t('noMenuItemsFound') : $t('noMenuItems') }}

- **L171** `$t(key)` key: `tryDifferentSearchMenu`
  → Suggested Spanish: **[ES: tryDifferentSearchMenu]**
  Snippet: {{ searchQuery ? $t('tryDifferentSearchMenu') : $t('addFirstMenuItemPrompt') }}

- **L171** `$t(key)` key: `addFirstMenuItemPrompt`
  → Suggested Spanish: **[ES: addFirstMenuItemPrompt]**
  Snippet: {{ searchQuery ? $t('tryDifferentSearchMenu') : $t('addFirstMenuItemPrompt') }}

- **L179** `$t(key)` key: `addMenuItem`
  → Suggested Spanish: **[ES: addMenuItem]**
  Snippet: {{ $t('addMenuItem') }}

- **L204** `$t(key)` key: `addNewItem`
  → Suggested Spanish: **[ES: addNewItem]**
  Snippet: {{ $t('addNewItem') }}

- **L207** `$t(key)` key: `addNewItemDescription`
  → Suggested Spanish: **[ES: addNewItemDescription]**
  Snippet: {{ $t('addNewItemDescription') }}

- **L215** `$t(key)` key: `showing`
  → Suggested Spanish: **[ES: showing]**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L215** `$t(key)` key: `of`
  → Suggested Spanish: **[ES: of]**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L224** `$t(key)` key: `previous`
  → Suggested Spanish: **[ES: previous]**
  Snippet: {{ $t('previous') }}

- **L231** `$t(key)` key: `next`
  → Suggested Spanish: **[ES: next]**
  Snippet: {{ $t('next') }}

- **L16** `$t(key, params)` key: `products`
  → Suggested Spanish: **[ES: products]**
  Snippet: ({{ menuItems.length }} {{ $t('products', menuItems.length) }})

- **L215** `$t(key, params)` key: `items`
  → Suggested Spanish: **artículos**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L65** `t(dynamic)` key: `stat.label`
  → Suggested Spanish: **[ES: stat.label]**
  Snippet: {{ $t(stat.label) }}

- **L104** `t(dynamic)` key: `category.translationKey`
  → Suggested Spanish: **[ES: category.translationKey]**
  Snippet: {{ $t(category.translationKey) }}

- **L262** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/containers/OrdersPanel.vue

- **L10** `t(key)` key: `orders`
  → Suggested Spanish: **Pedidos**
  Snippet: {{ $t('orders') }}

- **L13** `t(key)` key: `manageTrackOrders`
  → Suggested Spanish: **[ES: manageTrackOrders]**
  Snippet: {{ $t('manageTrackOrders') }}

- **L28** `t(key)` key: `searchPlaceholder`
  → Suggested Spanish: **[ES: searchPlaceholder]**
  Snippet: :placeholder="$t('searchPlaceholder')"

- **L31** `t(key)` key: `searchPlaceholder`
  → Suggested Spanish: **[ES: searchPlaceholder]**
  Snippet: :aria-label="$t('searchPlaceholder')"

- **L37** `t(key)` key: `clearSearch`
  → Suggested Spanish: **[ES: clearSearch]**
  Snippet: :aria-label="$t('clearSearch')"

- **L49** `t(key)` key: `filterOrders`
  → Suggested Spanish: **[ES: filterOrders]**
  Snippet: :aria-label="$t('filterOrders')"

- **L52** `t(key)` key: `filter`
  → Suggested Spanish: **[ES: filter]**
  Snippet: {{ $t('filter') }}

- **L69** `t(key)` key: `filter`
  → Suggested Spanish: **[ES: filter]**
  Snippet: <h3 class="filter-title">{{ $t('filter') }}</h3>

- **L73** `t(key)` key: `resetFilters`
  → Suggested Spanish: **[ES: resetFilters]**
  Snippet: :aria-label="$t('resetFilters')"

- **L76** `t(key)` key: `resetFilters`
  → Suggested Spanish: **[ES: resetFilters]**
  Snippet: {{ $t('resetFilters') }}

- **L86** `t(key)` key: `filterByStatus`
  → Suggested Spanish: **[ES: filterByStatus]**
  Snippet: <h3 class="filter-section-title">{{ $t('filterByStatus') }}</h3>

- **L131** `t(key)` key: `sortBy`
  → Suggested Spanish: **[ES: sortBy]**
  Snippet: <h3 class="filter-section-title">{{ $t('sortBy') }}</h3>

- **L140** `t(key)` key: `sortBy`
  → Suggested Spanish: **[ES: sortBy]**
  Snippet: :aria-label="$t('sortBy')"

- **L142** `t(key)` key: `newestFirst`
  → Suggested Spanish: **[ES: newestFirst]**
  Snippet: <option value="newest">{{ $t('newestFirst') }}</option>

- **L143** `t(key)` key: `oldestFirst`
  → Suggested Spanish: **[ES: oldestFirst]**
  Snippet: <option value="oldest">{{ $t('oldestFirst') }}</option>

- **L144** `t(key)` key: `highestAmount`
  → Suggested Spanish: **[ES: highestAmount]**
  Snippet: <option value="amount">{{ $t('highestAmount') }}</option>

- **L152** `t(key)` key: `ascending`
  → Suggested Spanish: **[ES: ascending]**
  Snippet: <span>{{ $t('ascending') }}</span>

- **L156** `t(key)` key: `descending`
  → Suggested Spanish: **[ES: descending]**
  Snippet: <span>{{ $t('descending') }}</span>

- **L166** `t(key)` key: `applyFilters`
  → Suggested Spanish: **[ES: applyFilters]**
  Snippet: :aria-label="$t('applyFilters')"

- **L169** `t(key)` key: `applyFilters`
  → Suggested Spanish: **[ES: applyFilters]**
  Snippet: {{ $t('applyFilters') }}

- **L173** `t(key)` key: `activeFilters`
  → Suggested Spanish: **[ES: activeFilters]**
  Snippet: {{ selectedStatuses.length }} {{ $t('activeFilters') }} • {{ filteredOrders.length }} {{ $t('results

- **L173** `t(key)` key: `results`
  → Suggested Spanish: **[ES: results]**
  Snippet: {{ selectedStatuses.length }} {{ $t('activeFilters') }} • {{ filteredOrders.length }} {{ $t('results

- **L186** `t(key)` key: `offline`
  → Suggested Spanish: **[ES: offline]**
  Snippet: :aria-label="!isOnline ? $t('offline') : $t('refresh')"

- **L186** `t(key)` key: `refresh`
  → Suggested Spanish: **[ES: refresh]**
  Snippet: :aria-label="!isOnline ? $t('offline') : $t('refresh')"

- **L192** `t(key)` key: `refreshing`
  → Suggested Spanish: **[ES: refreshing]**
  Snippet: {{ loading ? $t('refreshing') : $t('refresh') }}

- **L192** `t(key)` key: `refresh`
  → Suggested Spanish: **[ES: refresh]**
  Snippet: {{ loading ? $t('refreshing') : $t('refresh') }}

- **L262** `t(key)` key: `noResultsFound`
  → Suggested Spanish: **[ES: noResultsFound]**
  Snippet: {{ searchQuery ? $t('noResultsFound') : $t('noOrders') }}

- **L262** `t(key)` key: `noOrders`
  → Suggested Spanish: **[ES: noOrders]**
  Snippet: {{ searchQuery ? $t('noResultsFound') : $t('noOrders') }}

- **L265** `t(key)` key: `tryDifferentSearch`
  → Suggested Spanish: **[ES: tryDifferentSearch]**
  Snippet: {{ searchQuery ? $t('tryDifferentSearch') : $t('createNewOrderPrompt') }}

- **L265** `t(key)` key: `createNewOrderPrompt`
  → Suggested Spanish: **[ES: createNewOrderPrompt]**
  Snippet: {{ searchQuery ? $t('tryDifferentSearch') : $t('createNewOrderPrompt') }}

- **L270** `t(key)` key: `orderNow`
  → Suggested Spanish: **[ES: orderNow]**
  Snippet: :aria-label="$t('orderNow')"

- **L273** `t(key)` key: `orderNow`
  → Suggested Spanish: **[ES: orderNow]**
  Snippet: {{ $t('orderNow') }}

- **L288** `t(key)` key: `showing`
  → Suggested Spanish: **[ES: showing]**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L288** `t(key)` key: `of`
  → Suggested Spanish: **[ES: of]**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L296** `t(key)` key: `previousPage`
  → Suggested Spanish: **[ES: previousPage]**
  Snippet: :aria-label="$t('previousPage')"

- **L298** `t(key)` key: `previous`
  → Suggested Spanish: **[ES: previous]**
  Snippet: {{ $t('previous') }}

- **L305** `t(key)` key: `nextPage`
  → Suggested Spanish: **[ES: nextPage]**
  Snippet: :aria-label="$t('nextPage')"

- **L307** `t(key)` key: `next`
  → Suggested Spanish: **[ES: next]**
  Snippet: {{ $t('next') }}

- **L389** `t(key)` key: `new`
  → Suggested Spanish: **[ES: new]**
  Snippet: { value: 'new', label: t('new') },

- **L390** `t(key)` key: `preparing`
  → Suggested Spanish: **[ES: preparing]**
  Snippet: { value: 'preparing', label: t('preparing') },

- **L391** `t(key)` key: `ready`
  → Suggested Spanish: **[ES: ready]**
  Snippet: { value: 'ready', label: t('ready') },

- **L392** `t(key)` key: `delivered`
  → Suggested Spanish: **[ES: delivered]**
  Snippet: { value: 'delivered', label: t('delivered') },

- **L393** `t(key)` key: `statuscancelled`
  → Suggested Spanish: **[ES: statuscancelled]**
  Snippet: { value: 'cancelled', label: t('statuscancelled') }

- **L565** `t(key)` key: `errorMessage`
  → Suggested Spanish: **[ES: errorMessage]**
  Snippet: // Show error toast notification here using t('errorMessage')

- **L578** `t(key)` key: `invalidStatusTransition`
  → Suggested Spanish: **[ES: invalidStatusTransition]**
  Snippet: // Show error toast: t('invalidStatusTransition')

- **L584** `t(key)` key: `statusUpdated`
  → Suggested Spanish: **[ES: statusUpdated]**
  Snippet: // Show success toast notification here using t('statusUpdated')

- **L587** `t(key)` key: `updateFailed`
  → Suggested Spanish: **[ES: updateFailed]**
  Snippet: // Show error toast notification here using t('updateFailed')

- **L10** `$t(key)` key: `orders`
  → Suggested Spanish: **Pedidos**
  Snippet: {{ $t('orders') }}

- **L13** `$t(key)` key: `manageTrackOrders`
  → Suggested Spanish: **[ES: manageTrackOrders]**
  Snippet: {{ $t('manageTrackOrders') }}

- **L28** `$t(key)` key: `searchPlaceholder`
  → Suggested Spanish: **[ES: searchPlaceholder]**
  Snippet: :placeholder="$t('searchPlaceholder')"

- **L31** `$t(key)` key: `searchPlaceholder`
  → Suggested Spanish: **[ES: searchPlaceholder]**
  Snippet: :aria-label="$t('searchPlaceholder')"

- **L37** `$t(key)` key: `clearSearch`
  → Suggested Spanish: **[ES: clearSearch]**
  Snippet: :aria-label="$t('clearSearch')"

- **L49** `$t(key)` key: `filterOrders`
  → Suggested Spanish: **[ES: filterOrders]**
  Snippet: :aria-label="$t('filterOrders')"

- **L52** `$t(key)` key: `filter`
  → Suggested Spanish: **[ES: filter]**
  Snippet: {{ $t('filter') }}

- **L69** `$t(key)` key: `filter`
  → Suggested Spanish: **[ES: filter]**
  Snippet: <h3 class="filter-title">{{ $t('filter') }}</h3>

- **L73** `$t(key)` key: `resetFilters`
  → Suggested Spanish: **[ES: resetFilters]**
  Snippet: :aria-label="$t('resetFilters')"

- **L76** `$t(key)` key: `resetFilters`
  → Suggested Spanish: **[ES: resetFilters]**
  Snippet: {{ $t('resetFilters') }}

- **L86** `$t(key)` key: `filterByStatus`
  → Suggested Spanish: **[ES: filterByStatus]**
  Snippet: <h3 class="filter-section-title">{{ $t('filterByStatus') }}</h3>

- **L131** `$t(key)` key: `sortBy`
  → Suggested Spanish: **[ES: sortBy]**
  Snippet: <h3 class="filter-section-title">{{ $t('sortBy') }}</h3>

- **L140** `$t(key)` key: `sortBy`
  → Suggested Spanish: **[ES: sortBy]**
  Snippet: :aria-label="$t('sortBy')"

- **L142** `$t(key)` key: `newestFirst`
  → Suggested Spanish: **[ES: newestFirst]**
  Snippet: <option value="newest">{{ $t('newestFirst') }}</option>

- **L143** `$t(key)` key: `oldestFirst`
  → Suggested Spanish: **[ES: oldestFirst]**
  Snippet: <option value="oldest">{{ $t('oldestFirst') }}</option>

- **L144** `$t(key)` key: `highestAmount`
  → Suggested Spanish: **[ES: highestAmount]**
  Snippet: <option value="amount">{{ $t('highestAmount') }}</option>

- **L152** `$t(key)` key: `ascending`
  → Suggested Spanish: **[ES: ascending]**
  Snippet: <span>{{ $t('ascending') }}</span>

- **L156** `$t(key)` key: `descending`
  → Suggested Spanish: **[ES: descending]**
  Snippet: <span>{{ $t('descending') }}</span>

- **L166** `$t(key)` key: `applyFilters`
  → Suggested Spanish: **[ES: applyFilters]**
  Snippet: :aria-label="$t('applyFilters')"

- **L169** `$t(key)` key: `applyFilters`
  → Suggested Spanish: **[ES: applyFilters]**
  Snippet: {{ $t('applyFilters') }}

- **L173** `$t(key)` key: `activeFilters`
  → Suggested Spanish: **[ES: activeFilters]**
  Snippet: {{ selectedStatuses.length }} {{ $t('activeFilters') }} • {{ filteredOrders.length }} {{ $t('results

- **L173** `$t(key)` key: `results`
  → Suggested Spanish: **[ES: results]**
  Snippet: {{ selectedStatuses.length }} {{ $t('activeFilters') }} • {{ filteredOrders.length }} {{ $t('results

- **L186** `$t(key)` key: `offline`
  → Suggested Spanish: **[ES: offline]**
  Snippet: :aria-label="!isOnline ? $t('offline') : $t('refresh')"

- **L186** `$t(key)` key: `refresh`
  → Suggested Spanish: **[ES: refresh]**
  Snippet: :aria-label="!isOnline ? $t('offline') : $t('refresh')"

- **L192** `$t(key)` key: `refreshing`
  → Suggested Spanish: **[ES: refreshing]**
  Snippet: {{ loading ? $t('refreshing') : $t('refresh') }}

- **L192** `$t(key)` key: `refresh`
  → Suggested Spanish: **[ES: refresh]**
  Snippet: {{ loading ? $t('refreshing') : $t('refresh') }}

- **L262** `$t(key)` key: `noResultsFound`
  → Suggested Spanish: **[ES: noResultsFound]**
  Snippet: {{ searchQuery ? $t('noResultsFound') : $t('noOrders') }}

- **L262** `$t(key)` key: `noOrders`
  → Suggested Spanish: **[ES: noOrders]**
  Snippet: {{ searchQuery ? $t('noResultsFound') : $t('noOrders') }}

- **L265** `$t(key)` key: `tryDifferentSearch`
  → Suggested Spanish: **[ES: tryDifferentSearch]**
  Snippet: {{ searchQuery ? $t('tryDifferentSearch') : $t('createNewOrderPrompt') }}

- **L265** `$t(key)` key: `createNewOrderPrompt`
  → Suggested Spanish: **[ES: createNewOrderPrompt]**
  Snippet: {{ searchQuery ? $t('tryDifferentSearch') : $t('createNewOrderPrompt') }}

- **L270** `$t(key)` key: `orderNow`
  → Suggested Spanish: **[ES: orderNow]**
  Snippet: :aria-label="$t('orderNow')"

- **L273** `$t(key)` key: `orderNow`
  → Suggested Spanish: **[ES: orderNow]**
  Snippet: {{ $t('orderNow') }}

- **L288** `$t(key)` key: `showing`
  → Suggested Spanish: **[ES: showing]**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L288** `$t(key)` key: `of`
  → Suggested Spanish: **[ES: of]**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L296** `$t(key)` key: `previousPage`
  → Suggested Spanish: **[ES: previousPage]**
  Snippet: :aria-label="$t('previousPage')"

- **L298** `$t(key)` key: `previous`
  → Suggested Spanish: **[ES: previous]**
  Snippet: {{ $t('previous') }}

- **L305** `$t(key)` key: `nextPage`
  → Suggested Spanish: **[ES: nextPage]**
  Snippet: :aria-label="$t('nextPage')"

- **L307** `$t(key)` key: `next`
  → Suggested Spanish: **[ES: next]**
  Snippet: {{ $t('next') }}

- **L15** `$t(key, params)` key: `orders`
  → Suggested Spanish: **Pedidos**
  Snippet: ({{ orders.length }} {{ $t('orders', orders.length) }})

- **L288** `$t(key, params)` key: `orders`
  → Suggested Spanish: **Pedidos**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L211** `t(dynamic)` key: `tab.translationKey`
  → Suggested Spanish: **[ES: tab.translationKey]**
  Snippet: :aria-label="`${$t(tab.translationKey)} orders`"

- **L215** `t(dynamic)` key: `tab.translationKey`
  → Suggested Spanish: **[ES: tab.translationKey]**
  Snippet: {{ $t(tab.translationKey) }}

- **L235** `t(dynamic)` key: `stat.label`
  → Suggested Spanish: **[ES: stat.label]**
  Snippet: <p class="stat-label">{{ $t(stat.label) }}</p>

- **L334** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/containers/ReviewsPanel.vue

- **L11** `t(key)` key: `customerReviews`
  → Suggested Spanish: **[ES: customerReviews]**
  Snippet: {{ $t('customerReviews') }}

- **L14** `t(key)` key: `manageRespondFeedback`
  → Suggested Spanish: **[ES: manageRespondFeedback]**
  Snippet: {{ $t('manageRespondFeedback') }}

- **L28** `t(key)` key: `searchReviews`
  → Suggested Spanish: **[ES: searchReviews]**
  Snippet: :placeholder="$t('searchReviews')"

- **L50** `t(key)` key: `filter`
  → Suggested Spanish: **[ES: filter]**
  Snippet: <span class="hidden xs:inline">{{ $t('filter') }}</span>

- **L62** `t(key)` key: `filterByRating`
  → Suggested Spanish: **[ES: filterByRating]**
  Snippet: <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">{{ $t('fil

- **L83** `t(key)` key: `filterByStatus`
  → Suggested Spanish: **[ES: filterByStatus]**
  Snippet: <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">{{ $t('fil

- **L92** `t(key)` key: `unreadOnly`
  → Suggested Spanish: **[ES: unreadOnly]**
  Snippet: <span class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{{ $t('unreadOnly') }}</span>

- **L101** `t(key)` key: `unrespondedOnly`
  → Suggested Spanish: **[ES: unrespondedOnly]**
  Snippet: <span class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{{ $t('unrespondedOnly') }}</span>

- **L107** `t(key)` key: `sortBy`
  → Suggested Spanish: **[ES: sortBy]**
  Snippet: <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">{{ $t('sor

- **L113** `t(key)` key: `newestFirst`
  → Suggested Spanish: **[ES: newestFirst]**
  Snippet: <option value="newest">{{ $t('newestFirst') }}</option>

- **L114** `t(key)` key: `oldestFirst`
  → Suggested Spanish: **[ES: oldestFirst]**
  Snippet: <option value="oldest">{{ $t('oldestFirst') }}</option>

- **L115** `t(key)` key: `highestRating`
  → Suggested Spanish: **[ES: highestRating]**
  Snippet: <option value="highest">{{ $t('highestRating') }}</option>

- **L116** `t(key)` key: `lowestRating`
  → Suggested Spanish: **[ES: lowestRating]**
  Snippet: <option value="lowest">{{ $t('lowestRating') }}</option>

- **L117** `t(key)` key: `mostHelpful`
  → Suggested Spanish: **[ES: mostHelpful]**
  Snippet: <option value="helpful">{{ $t('mostHelpful') }}</option>

- **L125** `t(key)` key: `resetFilters`
  → Suggested Spanish: **[ES: resetFilters]**
  Snippet: {{ $t('resetFilters') }}

- **L138** `t(key)` key: `export`
  → Suggested Spanish: **[ES: export]**
  Snippet: <span class="hidden xs:inline">{{ $t('export') }}</span>

- **L151** `t(key)` key: `refreshing`
  → Suggested Spanish: **[ES: refreshing]**
  Snippet: <span class="hidden xs:inline">{{ loading ? $t('refreshing') : $t('refresh') }}</span>

- **L151** `t(key)` key: `refresh`
  → Suggested Spanish: **[ES: refresh]**
  Snippet: <span class="hidden xs:inline">{{ loading ? $t('refreshing') : $t('refresh') }}</span>

- **L160** `t(key)` key: `averageRating`
  → Suggested Spanish: **[ES: averageRating]**
  Snippet: :title="$t('averageRating')"

- **L173** `t(key)` key: `totalReviews`
  → Suggested Spanish: **[ES: totalReviews]**
  Snippet: :title="$t('totalReviews')"

- **L184** `t(key)` key: `responseRate`
  → Suggested Spanish: **[ES: responseRate]**
  Snippet: :title="$t('responseRate')"

- **L195** `t(key)` key: `positiveReviews`
  → Suggested Spanish: **[ES: positiveReviews]**
  Snippet: :title="$t('positiveReviews')"

- **L210** `t(key)` key: `ratingDistribution`
  → Suggested Spanish: **[ES: ratingDistribution]**
  Snippet: {{ $t('ratingDistribution') }}

- **L213** `t(key)` key: `total`
  → Suggested Spanish: **Total**
  Snippet: <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ $t('total') }}: {{ reviews.leng

- **L215** `t(key)` key: `avg`
  → Suggested Spanish: **[ES: avg]**
  Snippet: {{ $t('avg') }}: {{ averageRating.toFixed(1) }}

- **L246** `t(key)` key: `allReviews`
  → Suggested Spanish: **[ES: allReviews]**
  Snippet: {{ filter.id === 'all' ? $t('allReviews') : $t('stars', { n: parseInt(filter.id) }) }}

- **L260** `t(key)` key: `swipeForMoreFilters`
  → Suggested Spanish: **[ES: swipeForMoreFilters]**
  Snippet: {{ $t('swipeForMoreFilters') }}

- **L271** `t(key)` key: `selected`
  → Suggested Spanish: **[ES: selected]**
  Snippet: {{ selectedReviews.length }} {{ $t('reviews', selectedReviews.length) }} {{ $t('selected') }}

- **L280** `t(key)` key: `markAsRead`
  → Suggested Spanish: **[ES: markAsRead]**
  Snippet: {{ $t('markAsRead') }}

- **L287** `t(key)` key: `delete`
  → Suggested Spanish: **[ES: delete]**
  Snippet: {{ $t('delete') }}

- **L313** `t(key)` key: `noReviewsFound`
  → Suggested Spanish: **[ES: noReviewsFound]**
  Snippet: {{ searchQuery ? $t('noReviewsFound') : $t('noReviews') }}

- **L313** `t(key)` key: `noReviews`
  → Suggested Spanish: **[ES: noReviews]**
  Snippet: {{ searchQuery ? $t('noReviewsFound') : $t('noReviews') }}

- **L316** `t(key)` key: `tryDifferentSearchReview`
  → Suggested Spanish: **[ES: tryDifferentSearchReview]**
  Snippet: {{ searchQuery ? $t('tryDifferentSearchReview') : $t('noReviewsDescription') }}

- **L316** `t(key)` key: `noReviewsDescription`
  → Suggested Spanish: **[ES: noReviewsDescription]**
  Snippet: {{ searchQuery ? $t('tryDifferentSearchReview') : $t('noReviewsDescription') }}

- **L336** `t(key)` key: `showing`
  → Suggested Spanish: **[ES: showing]**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L336** `t(key)` key: `of`
  → Suggested Spanish: **[ES: of]**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L345** `t(key)` key: `previous`
  → Suggested Spanish: **[ES: previous]**
  Snippet: {{ $t('previous') }}

- **L352** `t(key)` key: `next`
  → Suggested Spanish: **[ES: next]**
  Snippet: {{ $t('next') }}

- **L374** `t(key)` key: `replyToReview`
  → Suggested Spanish: **[ES: replyToReview]**
  Snippet: {{ $t('replyToReview') }}

- **L379** `t(key)` key: `yourResponse`
  → Suggested Spanish: **[ES: yourResponse]**
  Snippet: :placeholder="$t('yourResponse')"

- **L387** `t(key)` key: `cancel`
  → Suggested Spanish: **Cancelar**
  Snippet: {{ $t('cancel') }}

- **L394** `t(key)` key: `processing`
  → Suggested Spanish: **[ES: processing]**
  Snippet: {{ loading ? $t('processing') : $t('sendResponse') }}

- **L394** `t(key)` key: `sendResponse`
  → Suggested Spanish: **[ES: sendResponse]**
  Snippet: {{ loading ? $t('processing') : $t('sendResponse') }}

- **L426** `t(key)` key: `ratingFilter.5stars`
  → Suggested Spanish: **[ES: ratingFilter.5stars]**
  Snippet: { value: 5, label: t('ratingFilter.5stars') },

- **L427** `t(key)` key: `ratingFilter.4stars`
  → Suggested Spanish: **[ES: ratingFilter.4stars]**
  Snippet: { value: 4, label: t('ratingFilter.4stars') },

- **L428** `t(key)` key: `ratingFilter.3stars`
  → Suggested Spanish: **[ES: ratingFilter.3stars]**
  Snippet: { value: 3, label: t('ratingFilter.3stars') },

- **L429** `t(key)` key: `ratingFilter.2stars`
  → Suggested Spanish: **[ES: ratingFilter.2stars]**
  Snippet: { value: 2, label: t('ratingFilter.2stars') },

- **L430** `t(key)` key: `ratingFilter.1star`
  → Suggested Spanish: **[ES: ratingFilter.1star]**
  Snippet: { value: 1, label: t('ratingFilter.1star') }

- **L459** `t(key)` key: `fromLastMonth`
  → Suggested Spanish: **[ES: fromLastMonth]**
  Snippet: const ratingChange = computed(() => `+0.2 ${t('fromLastMonth')}`);

- **L461** `t(key)` key: `fromLastMonth`
  → Suggested Spanish: **[ES: fromLastMonth]**
  Snippet: const reviewsChange = computed(() => `+12 ${t('fromLastMonth')}`);

- **L463** `t(key)` key: `fromLastMonth`
  → Suggested Spanish: **[ES: fromLastMonth]**
  Snippet: const responseRateChange = computed(() => `+5% ${t('fromLastMonth')}`);

- **L465** `t(key)` key: `ofTotal`
  → Suggested Spanish: **[ES: ofTotal]**
  Snippet: const positiveReviewsChange = computed(() => `+80% ${t('ofTotal')}`);

- **L469** `t(key)` key: `allReviews`
  → Suggested Spanish: **[ES: allReviews]**
  Snippet: { id: 'all', label: t('allReviews'), count: reviews.value.length, icon: 'ri-list-check', color: '#8b

- **L246** `t(key, params)` key: `stars`
  → Suggested Spanish: **[ES: stars]**
  Snippet: {{ filter.id === 'all' ? $t('allReviews') : $t('stars', { n: parseInt(filter.id) }) }}

- **L470** `t(key, params)` key: `stars`
  → Suggested Spanish: **[ES: stars]**
  Snippet: { id: '5', label: t('stars', { n: 5 }), count: ratingDistribution.value[5], icon: 'ri-star-fill', co

- **L471** `t(key, params)` key: `stars`
  → Suggested Spanish: **[ES: stars]**
  Snippet: { id: '4', label: t('stars', { n: 4 }), count: ratingDistribution.value[4], icon: 'ri-star-fill', co

- **L472** `t(key, params)` key: `stars`
  → Suggested Spanish: **[ES: stars]**
  Snippet: { id: '3', label: t('stars', { n: 3 }), count: ratingDistribution.value[3], icon: 'ri-star-half-fill

- **L473** `t(key, params)` key: `stars`
  → Suggested Spanish: **[ES: stars]**
  Snippet: { id: '2', label: t('stars', { n: 2 }), count: ratingDistribution.value[2], icon: 'ri-star-line', co

- **L474** `t(key, params)` key: `stars`
  → Suggested Spanish: **[ES: stars]**
  Snippet: { id: '1', label: t('stars', { n: 1 }), count: ratingDistribution.value[1], icon: 'ri-star-line', co

- **L604** `t(key, params)` key: `confirmDeleteReviews`
  → Suggested Spanish: **[ES: confirmDeleteReviews]**
  Snippet: if (confirm(t('confirmDeleteReviews', { count: selectedReviews.value.length }))) {

- **L11** `$t(key)` key: `customerReviews`
  → Suggested Spanish: **[ES: customerReviews]**
  Snippet: {{ $t('customerReviews') }}

- **L14** `$t(key)` key: `manageRespondFeedback`
  → Suggested Spanish: **[ES: manageRespondFeedback]**
  Snippet: {{ $t('manageRespondFeedback') }}

- **L28** `$t(key)` key: `searchReviews`
  → Suggested Spanish: **[ES: searchReviews]**
  Snippet: :placeholder="$t('searchReviews')"

- **L50** `$t(key)` key: `filter`
  → Suggested Spanish: **[ES: filter]**
  Snippet: <span class="hidden xs:inline">{{ $t('filter') }}</span>

- **L62** `$t(key)` key: `filterByRating`
  → Suggested Spanish: **[ES: filterByRating]**
  Snippet: <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">{{ $t('fil

- **L83** `$t(key)` key: `filterByStatus`
  → Suggested Spanish: **[ES: filterByStatus]**
  Snippet: <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">{{ $t('fil

- **L92** `$t(key)` key: `unreadOnly`
  → Suggested Spanish: **[ES: unreadOnly]**
  Snippet: <span class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{{ $t('unreadOnly') }}</span>

- **L101** `$t(key)` key: `unrespondedOnly`
  → Suggested Spanish: **[ES: unrespondedOnly]**
  Snippet: <span class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{{ $t('unrespondedOnly') }}</span>

- **L107** `$t(key)` key: `sortBy`
  → Suggested Spanish: **[ES: sortBy]**
  Snippet: <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">{{ $t('sor

- **L113** `$t(key)` key: `newestFirst`
  → Suggested Spanish: **[ES: newestFirst]**
  Snippet: <option value="newest">{{ $t('newestFirst') }}</option>

- **L114** `$t(key)` key: `oldestFirst`
  → Suggested Spanish: **[ES: oldestFirst]**
  Snippet: <option value="oldest">{{ $t('oldestFirst') }}</option>

- **L115** `$t(key)` key: `highestRating`
  → Suggested Spanish: **[ES: highestRating]**
  Snippet: <option value="highest">{{ $t('highestRating') }}</option>

- **L116** `$t(key)` key: `lowestRating`
  → Suggested Spanish: **[ES: lowestRating]**
  Snippet: <option value="lowest">{{ $t('lowestRating') }}</option>

- **L117** `$t(key)` key: `mostHelpful`
  → Suggested Spanish: **[ES: mostHelpful]**
  Snippet: <option value="helpful">{{ $t('mostHelpful') }}</option>

- **L125** `$t(key)` key: `resetFilters`
  → Suggested Spanish: **[ES: resetFilters]**
  Snippet: {{ $t('resetFilters') }}

- **L138** `$t(key)` key: `export`
  → Suggested Spanish: **[ES: export]**
  Snippet: <span class="hidden xs:inline">{{ $t('export') }}</span>

- **L151** `$t(key)` key: `refreshing`
  → Suggested Spanish: **[ES: refreshing]**
  Snippet: <span class="hidden xs:inline">{{ loading ? $t('refreshing') : $t('refresh') }}</span>

- **L151** `$t(key)` key: `refresh`
  → Suggested Spanish: **[ES: refresh]**
  Snippet: <span class="hidden xs:inline">{{ loading ? $t('refreshing') : $t('refresh') }}</span>

- **L160** `$t(key)` key: `averageRating`
  → Suggested Spanish: **[ES: averageRating]**
  Snippet: :title="$t('averageRating')"

- **L173** `$t(key)` key: `totalReviews`
  → Suggested Spanish: **[ES: totalReviews]**
  Snippet: :title="$t('totalReviews')"

- **L184** `$t(key)` key: `responseRate`
  → Suggested Spanish: **[ES: responseRate]**
  Snippet: :title="$t('responseRate')"

- **L195** `$t(key)` key: `positiveReviews`
  → Suggested Spanish: **[ES: positiveReviews]**
  Snippet: :title="$t('positiveReviews')"

- **L210** `$t(key)` key: `ratingDistribution`
  → Suggested Spanish: **[ES: ratingDistribution]**
  Snippet: {{ $t('ratingDistribution') }}

- **L213** `$t(key)` key: `total`
  → Suggested Spanish: **Total**
  Snippet: <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ $t('total') }}: {{ reviews.leng

- **L215** `$t(key)` key: `avg`
  → Suggested Spanish: **[ES: avg]**
  Snippet: {{ $t('avg') }}: {{ averageRating.toFixed(1) }}

- **L246** `$t(key)` key: `allReviews`
  → Suggested Spanish: **[ES: allReviews]**
  Snippet: {{ filter.id === 'all' ? $t('allReviews') : $t('stars', { n: parseInt(filter.id) }) }}

- **L260** `$t(key)` key: `swipeForMoreFilters`
  → Suggested Spanish: **[ES: swipeForMoreFilters]**
  Snippet: {{ $t('swipeForMoreFilters') }}

- **L271** `$t(key)` key: `selected`
  → Suggested Spanish: **[ES: selected]**
  Snippet: {{ selectedReviews.length }} {{ $t('reviews', selectedReviews.length) }} {{ $t('selected') }}

- **L280** `$t(key)` key: `markAsRead`
  → Suggested Spanish: **[ES: markAsRead]**
  Snippet: {{ $t('markAsRead') }}

- **L287** `$t(key)` key: `delete`
  → Suggested Spanish: **[ES: delete]**
  Snippet: {{ $t('delete') }}

- **L313** `$t(key)` key: `noReviewsFound`
  → Suggested Spanish: **[ES: noReviewsFound]**
  Snippet: {{ searchQuery ? $t('noReviewsFound') : $t('noReviews') }}

- **L313** `$t(key)` key: `noReviews`
  → Suggested Spanish: **[ES: noReviews]**
  Snippet: {{ searchQuery ? $t('noReviewsFound') : $t('noReviews') }}

- **L316** `$t(key)` key: `tryDifferentSearchReview`
  → Suggested Spanish: **[ES: tryDifferentSearchReview]**
  Snippet: {{ searchQuery ? $t('tryDifferentSearchReview') : $t('noReviewsDescription') }}

- **L316** `$t(key)` key: `noReviewsDescription`
  → Suggested Spanish: **[ES: noReviewsDescription]**
  Snippet: {{ searchQuery ? $t('tryDifferentSearchReview') : $t('noReviewsDescription') }}

- **L336** `$t(key)` key: `showing`
  → Suggested Spanish: **[ES: showing]**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L336** `$t(key)` key: `of`
  → Suggested Spanish: **[ES: of]**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L345** `$t(key)` key: `previous`
  → Suggested Spanish: **[ES: previous]**
  Snippet: {{ $t('previous') }}

- **L352** `$t(key)` key: `next`
  → Suggested Spanish: **[ES: next]**
  Snippet: {{ $t('next') }}

- **L374** `$t(key)` key: `replyToReview`
  → Suggested Spanish: **[ES: replyToReview]**
  Snippet: {{ $t('replyToReview') }}

- **L379** `$t(key)` key: `yourResponse`
  → Suggested Spanish: **[ES: yourResponse]**
  Snippet: :placeholder="$t('yourResponse')"

- **L387** `$t(key)` key: `cancel`
  → Suggested Spanish: **Cancelar**
  Snippet: {{ $t('cancel') }}

- **L394** `$t(key)` key: `processing`
  → Suggested Spanish: **[ES: processing]**
  Snippet: {{ loading ? $t('processing') : $t('sendResponse') }}

- **L394** `$t(key)` key: `sendResponse`
  → Suggested Spanish: **[ES: sendResponse]**
  Snippet: {{ loading ? $t('processing') : $t('sendResponse') }}

- **L16** `$t(key, params)` key: `reviews`
  → Suggested Spanish: **[ES: reviews]**
  Snippet: ({{ reviews.length }} {{ $t('reviews', reviews.length) }})

- **L213** `$t(key, params)` key: `reviews`
  → Suggested Spanish: **[ES: reviews]**
  Snippet: <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ $t('total') }}: {{ reviews.leng

- **L246** `$t(key, params)` key: `stars`
  → Suggested Spanish: **[ES: stars]**
  Snippet: {{ filter.id === 'all' ? $t('allReviews') : $t('stars', { n: parseInt(filter.id) }) }}

- **L271** `$t(key, params)` key: `reviews`
  → Suggested Spanish: **[ES: reviews]**
  Snippet: {{ selectedReviews.length }} {{ $t('reviews', selectedReviews.length) }} {{ $t('selected') }}

- **L336** `$t(key, params)` key: `reviews`
  → Suggested Spanish: **[ES: reviews]**
  Snippet: {{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPag

- **L410** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/business-owner/containers/SettingsPanel.vue

- **L11** `t(key)` key: `settings`
  → Suggested Spanish: **Configuración**
  Snippet: {{ t('settings') }}

- **L14** `t(key)` key: `manageTrackOrders`
  → Suggested Spanish: **[ES: manageTrackOrders]**
  Snippet: {{ t('manageTrackOrders') }}

- **L16** `t(key)` key: `manageRestaurantSettings`
  → Suggested Spanish: **[ES: manageRestaurantSettings]**
  Snippet: {{ t('manageRestaurantSettings') }}

- **L30** `t(key)` key: `deliverySettings`
  → Suggested Spanish: **[ES: deliverySettings]**
  Snippet: {{ t('deliverySettings') }}

- **L37** `t(key)` key: `saveChanges`
  → Suggested Spanish: **[ES: saveChanges]**
  Snippet: :aria-label="t('saveChanges')"

- **L44** `t(key)` key: `deliverySettingsDescription`
  → Suggested Spanish: **[ES: deliverySettingsDescription]**
  Snippet: {{ t('deliverySettingsDescription') }}

- **L72** `t(key)` key: `deliveryZones`
  → Suggested Spanish: **[ES: deliveryZones]**
  Snippet: {{ t('deliveryZones') }}

- **L77** `t(key)` key: `addZone`
  → Suggested Spanish: **[ES: addZone]**
  Snippet: :aria-label="$t('addZone')"

- **L87** `t(key)` key: `zoneMapPreview`
  → Suggested Spanish: **[ES: zoneMapPreview]**
  Snippet: <p>{{ t('zoneMapPreview') }}</p>

- **L94** `t(key)` key: `deliveryRadius`
  → Suggested Spanish: **[ES: deliveryRadius]**
  Snippet: <span>{{ t('deliveryRadius') }}</span>

- **L101** `t(key)` key: `deliveryFee`
  → Suggested Spanish: **[ES: deliveryFee]**
  Snippet: <span>{{ t('deliveryFee') }}</span>

- **L110** `t(key)` key: `deliveryRadius`
  → Suggested Spanish: **[ES: deliveryRadius]**
  Snippet: {{ t('deliveryRadius') }}

- **L138** `t(key)` key: `pricingAndFees`
  → Suggested Spanish: **[ES: pricingAndFees]**
  Snippet: {{ t('pricingAndFees') }}

- **L151** `t(key)` key: `deliveryFee`
  → Suggested Spanish: **[ES: deliveryFee]**
  Snippet: <label>{{ t('deliveryFee') }}</label>

- **L166** `t(key)` key: `minimumOrder`
  → Suggested Spanish: **[ES: minimumOrder]**
  Snippet: <label>{{ t('minimumOrder') }}</label>

- **L181** `t(key)` key: `serviceFee`
  → Suggested Spanish: **[ES: serviceFee]**
  Snippet: <label>{{ t('serviceFee') }}</label>

- **L197** `t(key)` key: `feeCalculator`
  → Suggested Spanish: **[ES: feeCalculator]**
  Snippet: <h4>{{ t('feeCalculator') }}</h4>

- **L200** `t(key)` key: `orderSubtotal`
  → Suggested Spanish: **[ES: orderSubtotal]**
  Snippet: <span>{{ t('orderSubtotal') }}</span>

- **L204** `t(key)` key: `deliveryFee`
  → Suggested Spanish: **[ES: deliveryFee]**
  Snippet: <span>{{ t('deliveryFee') }}</span>

- **L208** `t(key)` key: `total`
  → Suggested Spanish: **Total**
  Snippet: <span>{{ t('total') }}</span>

- **L222** `t(key)` key: `deliveryOptions`
  → Suggested Spanish: **[ES: deliveryOptions]**
  Snippet: {{ t('deliveryOptions') }}

- **L261** `t(key)` key: `deliveryTimes`
  → Suggested Spanish: **[ES: deliveryTimes]**
  Snippet: {{ t('deliveryTimes') }}

- **L267** `t(key)` key: `averageDeliveryTime`
  → Suggested Spanish: **[ES: averageDeliveryTime]**
  Snippet: <label>{{ t('averageDeliveryTime') }}</label>

- **L277** `t(key)` key: `minutes`
  → Suggested Spanish: **[ES: minutes]**
  Snippet: <span class="unit">{{ t('minutes') }}</span>

- **L283** `t(key)` key: `deliveryHours`
  → Suggested Spanish: **[ES: deliveryHours]**
  Snippet: <h4>{{ t('deliveryHours') }}</h4>

- **L322** `t(key)` key: `reset`
  → Suggested Spanish: **Restablecer**
  Snippet: {{ t('reset') }}

- **L332** `t(key)` key: `saving`
  → Suggested Spanish: **[ES: saving]**
  Snippet: {{ t('saving') }}

- **L336** `t(key)` key: `saveChanges`
  → Suggested Spanish: **[ES: saveChanges]**
  Snippet: {{ t('saveChanges') }}

- **L346** `t(key)` key: `quickActions`
  → Suggested Spanish: **[ES: quickActions]**
  Snippet: <h3>{{ t('quickActions') }}</h3>

- **L354** `t(key)` key: `testCalculator`
  → Suggested Spanish: **[ES: testCalculator]**
  Snippet: <span>{{ t('testCalculator') }}</span>

- **L358** `t(key)` key: `viewAnalytics`
  → Suggested Spanish: **[ES: viewAnalytics]**
  Snippet: <span>{{ t('viewAnalytics') }}</span>

- **L362** `t(key)` key: `exportSettings`
  → Suggested Spanish: **[ES: exportSettings]**
  Snippet: <span>{{ t('exportSettings') }}</span>

- **L399** `t(key)` key: `monday`
  → Suggested Spanish: **[ES: monday]**
  Snippet: { id: 0, name: t('monday'), enabled: true, startTime: '10:00', endTime: '22:00' },

- **L400** `t(key)` key: `tuesday`
  → Suggested Spanish: **[ES: tuesday]**
  Snippet: { id: 1, name: t('tuesday'), enabled: true, startTime: '10:00', endTime: '22:00' },

- **L401** `t(key)` key: `wednesday`
  → Suggested Spanish: **[ES: wednesday]**
  Snippet: { id: 2, name: t('wednesday'), enabled: true, startTime: '10:00', endTime: '22:00' },

- **L402** `t(key)` key: `thursday`
  → Suggested Spanish: **[ES: thursday]**
  Snippet: { id: 3, name: t('thursday'), enabled: true, startTime: '10:00', endTime: '22:00' },

- **L403** `t(key)` key: `friday`
  → Suggested Spanish: **[ES: friday]**
  Snippet: { id: 4, name: t('friday'), enabled: true, startTime: '10:00', endTime: '23:00' },

- **L404** `t(key)` key: `saturday`
  → Suggested Spanish: **[ES: saturday]**
  Snippet: { id: 5, name: t('saturday'), enabled: true, startTime: '11:00', endTime: '23:00' },

- **L405** `t(key)` key: `sunday`
  → Suggested Spanish: **[ES: sunday]**
  Snippet: { id: 6, name: t('sunday'), enabled: true, startTime: '12:00', endTime: '21:00' },

- **L412** `t(key)` key: `enablePickup`
  → Suggested Spanish: **[ES: enablePickup]**
  Snippet: title: t('enablePickup'),

- **L413** `t(key)` key: `allowCustomersPickup`
  → Suggested Spanish: **[ES: allowCustomersPickup]**
  Snippet: description: t('allowCustomersPickup'),

- **L420** `t(key)` key: `enableDelivery`
  → Suggested Spanish: **[ES: enableDelivery]**
  Snippet: title: t('enableDelivery'),

- **L421** `t(key)` key: `offerDeliveryService`
  → Suggested Spanish: **[ES: offerDeliveryService]**
  Snippet: description: t('offerDeliveryService'),

- **L428** `t(key)` key: `expressDelivery`
  → Suggested Spanish: **[ES: expressDelivery]**
  Snippet: title: t('expressDelivery'),

- **L429** `t(key)` key: `offerExpressDelivery`
  → Suggested Spanish: **[ES: offerExpressDelivery]**
  Snippet: description: t('offerExpressDelivery'),

- **L491** `t(key)` key: `confirmReset`
  → Suggested Spanish: **[ES: confirmReset]**
  Snippet: if (confirm(t('confirmReset'))) {

- **L505** `t(key)` key: `settingsSaved`
  → Suggested Spanish: **[ES: settingsSaved]**
  Snippet: alert(t('settingsSaved'));

- **L508** `t(key)` key: `saveError`
  → Suggested Spanish: **[ES: saveError]**
  Snippet: alert(t('saveError'));

- **L515** `t(key)` key: `calculatorTestMessage`
  → Suggested Spanish: **[ES: calculatorTestMessage]**
  Snippet: alert(t('calculatorTestMessage'));

- **L77** `$t(key)` key: `addZone`
  → Suggested Spanish: **[ES: addZone]**
  Snippet: :aria-label="$t('addZone')"

- **L60** `t(dynamic)` key: `tab.label`
  → Suggested Spanish: **[ES: tab.label]**
  Snippet: <span>{{ t(tab.label) }}</span>

- **L374** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/customer/containers/CartPanel.vue

- **L164** `t(key)` key: `continueShopping`
  → Suggested Spanish: **[ES: continueShopping]**
  Snippet: <span class="font-medium ml-1">{{ t('continueShopping') }}</span>

- **L363** `t(key)` key: `browseMenu`
  → Suggested Spanish: **[ES: browseMenu]**
  Snippet: {{ t('browseMenu') }}

- **L388** `t(key)` key: `free`
  → Suggested Spanish: **Gratis**
  Snippet: deliveryFee === 0 ? t('free') : `$${deliveryFee.toFixed(2)}`

- **L177** `t(key, params)` key: `itemsInCart`
  → Suggested Spanish: **[ES: itemsInCart]**
  Snippet: {{ t('itemsInCart', { count: itemCount }) }}

- **L322** `t(key, params)` key: `each`
  → Suggested Spanish: **c/u**
  Snippet: {{ t('each', { price: item.price.toFixed(2) }) }}

- **L381** `t(key, params)` key: `subtotal`
  → Suggested Spanish: **Subtotal**
  Snippet: <span>{{ t('subtotal', { count: itemCount }) }}</span>

- **L409** `t(key, params)` key: `freeDeliveryProgress`
  → Suggested Spanish: **[ES: freeDeliveryProgress]**
  Snippet: {{ t('freeDeliveryProgress', { amount: (250 - total).toFixed(2) }) }}


## src/features/customer/containers/OrderCard.vue

- **L84** `t(key)` key: `track`
  → Suggested Spanish: **Rastrear**
  Snippet: {{ $t('track') }}aqui

- **L84** `$t(key)` key: `track`
  → Suggested Spanish: **Rastrear**
  Snippet: {{ $t('track') }}aqui


## src/features/customer/containers/OrdersPanel.vue

- **L133** `t(key)` key: `retry`
  → Suggested Spanish: **Reintentar**
  Snippet: {{ t('retry') }}

- **L253** `t(key)` key: `favorites`
  → Suggested Spanish: **Favoritos**
  Snippet: <h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{{ t('favorites') }}</h2>

- **L352** `t(key)` key: `totalOrders`
  → Suggested Spanish: **[ES: totalOrders]**
  Snippet: <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('totalOrders') }}</p>


## src/features/delivery/components/DashboardOverview.vue

- **L11** `t(key)` key: `dashboard`
  → Suggested Spanish: **Panel**
  Snippet: {{ t('dashboard') }}

- **L14** `t(key)` key: `readyToDeliver`
  → Suggested Spanish: **[ES: readyToDeliver]**
  Snippet: {{ t('readyToDeliver') }}

- **L46** `t(key)` key: `online`
  → Suggested Spanish: **[ES: online]**
  Snippet: {{ deliveryStore.isOnline ? t('online') : t('offline') }}

- **L46** `t(key)` key: `offline`
  → Suggested Spanish: **[ES: offline]**
  Snippet: {{ deliveryStore.isOnline ? t('online') : t('offline') }}

- **L56** `t(key)` key: `receivingOrders`
  → Suggested Spanish: **[ES: receivingOrders]**
  Snippet: {{ deliveryStore.isOnline ? t('receivingOrders') : t('notReceivingOrders') }}

- **L56** `t(key)` key: `notReceivingOrders`
  → Suggested Spanish: **[ES: notReceivingOrders]**
  Snippet: {{ deliveryStore.isOnline ? t('receivingOrders') : t('notReceivingOrders') }}

- **L147** `t(key)` key: `markNextStep`
  → Suggested Spanish: **[ES: markNextStep]**
  Snippet: {{ t('markNextStep') }}

- **L161** `t(key)` key: `order`
  → Suggested Spanish: **[ES: order]**
  Snippet: {{ t('order') }} {{ currentDelivery.id }}

- **L184** `t(key)` key: `markDelivered`
  → Suggested Spanish: **[ES: markDelivered]**
  Snippet: <i class="ri-checkbox-circle-line mr-2"></i> {{ t('markDelivered') }}

- **L190** `t(key)` key: `callCustomer`
  → Suggested Spanish: **[ES: callCustomer]**
  Snippet: <i class="ri-phone-line mr-2"></i> {{ t('callCustomer') }}

- **L196** `t(key)` key: `noActiveDelivery`
  → Suggested Spanish: **[ES: noActiveDelivery]**
  Snippet: <p>{{ t('noActiveDelivery') }}</p>

- **L233** `t(key)` key: `liveInsights`
  → Suggested Spanish: **[ES: liveInsights]**
  Snippet: {{ t('liveInsights') }}

- **L359** `t(key)` key: `noData`
  → Suggested Spanish: **[ES: noData]**
  Snippet: change: t('noData'),

- **L366** `t(key)` key: `noData`
  → Suggested Spanish: **[ES: noData]**
  Snippet: change: t('noData'),

- **L373** `t(key)` key: `noData`
  → Suggested Spanish: **[ES: noData]**
  Snippet: change: t('noData'),

- **L380** `t(key)` key: `noData`
  → Suggested Spanish: **[ES: noData]**
  Snippet: change: t('noData'),

- **L420** `t(key)` key: `insight1`
  → Suggested Spanish: **[ES: insight1]**
  Snippet: t('insight1'),

- **L421** `t(key)` key: `insight2`
  → Suggested Spanish: **[ES: insight2]**
  Snippet: t('insight2'),

- **L422** `t(key)` key: `insight3`
  → Suggested Spanish: **[ES: insight3]**
  Snippet: t('insight3'),

- **L391** `t(key, params)` key: `changeFromYesterday`
  → Suggested Spanish: **[ES: changeFromYesterday]**
  Snippet: change: t('changeFromYesterday', { value: earnings.today.deliveries }),

- **L398** `t(key, params)` key: `changeEarnings`
  → Suggested Spanish: **[ES: changeEarnings]**
  Snippet: change: t('changeEarnings', { amount: earnings.today.earnings.toFixed(2) }),

- **L405** `t(key, params)` key: `avgDistance`
  → Suggested Spanish: **[ES: avgDistance]**
  Snippet: change: t('avgDistance', { distance: earnings.today.distance.toFixed(1) }),

- **L412** `t(key, params)` key: `sinceTime`
  → Suggested Spanish: **[ES: sinceTime]**
  Snippet: change: t('sinceTime', { time: new Date().toLocaleTimeString() }),

- **L131** `t(dynamic)` key: `step.label`
  → Suggested Spanish: **[ES: step.label]**
  Snippet: {{ t(step.label) }}

- **L210** `t(dynamic)` key: `stat.label`
  → Suggested Spanish: **[ES: stat.label]**
  Snippet: <p class="text-neutral-600 dark:text-neutral-300 text-sm font-medium">{{ t(stat.label) }}</p>

- **L256** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/delivery/components/profile/ScheduleInfo.vue

- **L92** `t(key)` key: `basedOnLast7Days`
  → Suggested Spanish: **[ES: basedOnLast7Days]**
  Snippet: <p class="text-sm text-white mb-3">{{ $t('basedOnLast7Days') }}</p>

- **L92** `$t(key)` key: `basedOnLast7Days`
  → Suggested Spanish: **[ES: basedOnLast7Days]**
  Snippet: <p class="text-sm text-white mb-3">{{ $t('basedOnLast7Days') }}</p>


## src/features/delivery/containers/EarningsPanel.vue

- **L9** `t(key)` key: `earnings`
  → Suggested Spanish: **[ES: earnings]**
  Snippet: {{ $t('earnings') }}

- **L12** `t(key)` key: `trackEarningsPayments`
  → Suggested Spanish: **[ES: trackEarningsPayments]**
  Snippet: {{ $t('trackEarningsPayments') }}

- **L28** `t(key)` key: `thisWeek`
  → Suggested Spanish: **[ES: thisWeek]**
  Snippet: {{ $t('thisWeek') }}

- **L42** `t(key)` key: `thisMonth`
  → Suggested Spanish: **[ES: thisMonth]**
  Snippet: {{ $t('thisMonth') }}

- **L84** `t(key)` key: `earningsTrend`
  → Suggested Spanish: **[ES: earningsTrend]**
  Snippet: {{ $t('earningsTrend') }}

- **L89** `t(key)` key: `noDataAvailable`
  → Suggested Spanish: **[ES: noDataAvailable]**
  Snippet: <p>{{ t('noDataAvailable') }}</p>

- **L99** `t(key)` key: `earningsBreakdown`
  → Suggested Spanish: **[ES: earningsBreakdown]**
  Snippet: {{ $t('earningsBreakdown') }}

- **L114** `t(key)` key: `paymentHistory`
  → Suggested Spanish: **[ES: paymentHistory]**
  Snippet: {{ $t('paymentHistory') }}

- **L119** `t(key)` key: `viewAll`
  → Suggested Spanish: **[ES: viewAll]**
  Snippet: {{ $t('viewAll') }}

- **L162** `t(key)` key: `downloadReport`
  → Suggested Spanish: **[ES: downloadReport]**
  Snippet: <p class="font-medium text-gray-900">{{ $t('downloadReport') }}</p>

- **L163** `t(key)` key: `exportEarningsData`
  → Suggested Spanish: **[ES: exportEarningsData]**
  Snippet: <p class="text-sm text-gray-500">{{ $t('exportEarningsData') }}</p>

- **L173** `t(key)` key: `paymentMethods`
  → Suggested Spanish: **[ES: paymentMethods]**
  Snippet: <p class="font-medium text-gray-900">{{ $t('paymentMethods') }}</p>

- **L174** `t(key)` key: `manageBankAccounts`
  → Suggested Spanish: **[ES: manageBankAccounts]**
  Snippet: <p class="text-sm text-gray-500">{{ $t('manageBankAccounts') }}</p>

- **L184** `t(key)` key: `taxDocuments`
  → Suggested Spanish: **[ES: taxDocuments]**
  Snippet: <p class="font-medium text-gray-900">{{ $t('taxDocuments') }}</p>

- **L185** `t(key)` key: `taxFormsReceipts`
  → Suggested Spanish: **[ES: taxFormsReceipts]**
  Snippet: <p class="text-sm text-gray-500">{{ $t('taxFormsReceipts') }}</p>

- **L248** `t(key)` key: `noData`
  → Suggested Spanish: **[ES: noData]**
  Snippet: change: t('noData'),

- **L257** `t(key)` key: `noData`
  → Suggested Spanish: **[ES: noData]**
  Snippet: change: t('noData'),

- **L266** `t(key)` key: `noData`
  → Suggested Spanish: **[ES: noData]**
  Snippet: change: t('noData'),

- **L332** `t(key)` key: `weeklyPayout`
  → Suggested Spanish: **[ES: weeklyPayout]**
  Snippet: title: t('weeklyPayout'),

- **L338** `t(key)` key: `weeklyPayout`
  → Suggested Spanish: **[ES: weeklyPayout]**
  Snippet: title: t('weeklyPayout'),

- **L344** `t(key)` key: `weeklyPayout`
  → Suggested Spanish: **[ES: weeklyPayout]**
  Snippet: title: t('weeklyPayout'),

- **L350** `t(key)` key: `weeklyPayout`
  → Suggested Spanish: **[ES: weeklyPayout]**
  Snippet: title: t('weeklyPayout'),

- **L361** `t(key)` key: `dayMon`
  → Suggested Spanish: **[ES: dayMon]**
  Snippet: t('dayMon'),

- **L362** `t(key)` key: `dayTue`
  → Suggested Spanish: **[ES: dayTue]**
  Snippet: t('dayTue'),

- **L363** `t(key)` key: `dayWed`
  → Suggested Spanish: **[ES: dayWed]**
  Snippet: t('dayWed'),

- **L364** `t(key)` key: `dayThu`
  → Suggested Spanish: **[ES: dayThu]**
  Snippet: t('dayThu'),

- **L365** `t(key)` key: `dayFri`
  → Suggested Spanish: **[ES: dayFri]**
  Snippet: t('dayFri'),

- **L366** `t(key)` key: `daySat`
  → Suggested Spanish: **[ES: daySat]**
  Snippet: t('daySat'),

- **L367** `t(key)` key: `daySun`
  → Suggested Spanish: **[ES: daySun]**
  Snippet: t('daySun'),

- **L371** `t(key)` key: `earnings`
  → Suggested Spanish: **[ES: earnings]**
  Snippet: label: t('earnings'),

- **L393** `t(key)` key: `deliveryFees`
  → Suggested Spanish: **[ES: deliveryFees]**
  Snippet: labels: [t('deliveryFees'), t('tips'), t('bonuses'), t('peakHour')],

- **L393** `t(key)` key: `tips`
  → Suggested Spanish: **[ES: tips]**
  Snippet: labels: [t('deliveryFees'), t('tips'), t('bonuses'), t('peakHour')],

- **L393** `t(key)` key: `bonuses`
  → Suggested Spanish: **[ES: bonuses]**
  Snippet: labels: [t('deliveryFees'), t('tips'), t('bonuses'), t('peakHour')],

- **L393** `t(key)` key: `peakHour`
  → Suggested Spanish: **[ES: peakHour]**
  Snippet: labels: [t('deliveryFees'), t('tips'), t('bonuses'), t('peakHour')],

- **L290** `t(key, params)` key: `changeFromLastWeek`
  → Suggested Spanish: **[ES: changeFromLastWeek]**
  Snippet: change: t('changeFromLastWeek', { value: '0%' }),

- **L299** `t(key, params)` key: `avgPerOrder`
  → Suggested Spanish: **[ES: avgPerOrder]**
  Snippet: change: t('avgPerOrder', { value: `$${earnings.averagePerDelivery.toFixed(2)}` }),

- **L308** `t(key, params)` key: `ratePerHour`
  → Suggested Spanish: **[ES: ratePerHour]**
  Snippet: change: t('ratePerHour', {

- **L9** `$t(key)` key: `earnings`
  → Suggested Spanish: **[ES: earnings]**
  Snippet: {{ $t('earnings') }}

- **L12** `$t(key)` key: `trackEarningsPayments`
  → Suggested Spanish: **[ES: trackEarningsPayments]**
  Snippet: {{ $t('trackEarningsPayments') }}

- **L28** `$t(key)` key: `thisWeek`
  → Suggested Spanish: **[ES: thisWeek]**
  Snippet: {{ $t('thisWeek') }}

- **L42** `$t(key)` key: `thisMonth`
  → Suggested Spanish: **[ES: thisMonth]**
  Snippet: {{ $t('thisMonth') }}

- **L84** `$t(key)` key: `earningsTrend`
  → Suggested Spanish: **[ES: earningsTrend]**
  Snippet: {{ $t('earningsTrend') }}

- **L99** `$t(key)` key: `earningsBreakdown`
  → Suggested Spanish: **[ES: earningsBreakdown]**
  Snippet: {{ $t('earningsBreakdown') }}

- **L114** `$t(key)` key: `paymentHistory`
  → Suggested Spanish: **[ES: paymentHistory]**
  Snippet: {{ $t('paymentHistory') }}

- **L119** `$t(key)` key: `viewAll`
  → Suggested Spanish: **[ES: viewAll]**
  Snippet: {{ $t('viewAll') }}

- **L162** `$t(key)` key: `downloadReport`
  → Suggested Spanish: **[ES: downloadReport]**
  Snippet: <p class="font-medium text-gray-900">{{ $t('downloadReport') }}</p>

- **L163** `$t(key)` key: `exportEarningsData`
  → Suggested Spanish: **[ES: exportEarningsData]**
  Snippet: <p class="text-sm text-gray-500">{{ $t('exportEarningsData') }}</p>

- **L173** `$t(key)` key: `paymentMethods`
  → Suggested Spanish: **[ES: paymentMethods]**
  Snippet: <p class="font-medium text-gray-900">{{ $t('paymentMethods') }}</p>

- **L174** `$t(key)` key: `manageBankAccounts`
  → Suggested Spanish: **[ES: manageBankAccounts]**
  Snippet: <p class="text-sm text-gray-500">{{ $t('manageBankAccounts') }}</p>

- **L184** `$t(key)` key: `taxDocuments`
  → Suggested Spanish: **[ES: taxDocuments]**
  Snippet: <p class="font-medium text-gray-900">{{ $t('taxDocuments') }}</p>

- **L185** `$t(key)` key: `taxFormsReceipts`
  → Suggested Spanish: **[ES: taxFormsReceipts]**
  Snippet: <p class="text-sm text-gray-500">{{ $t('taxFormsReceipts') }}</p>

- **L57** `t(dynamic)` key: `card.titleKey`
  → Suggested Spanish: **[ES: card.titleKey]**
  Snippet: {{ $t(card.titleKey) }}

- **L230** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/features/delivery/containers/OrdersPanel.vue

- **L5** `t(key)` key: `orders`
  → Suggested Spanish: **Pedidos**
  Snippet: <h1 class="text-2xl font-bold text-gray-900">{{ $t('orders') }}</h1>

- **L6** `t(key)` key: `manageDeliveries`
  → Suggested Spanish: **[ES: manageDeliveries]**
  Snippet: <p class="text-gray-600 mt-1">{{ $t('manageDeliveries') }}</p>

- **L51** `t(key)` key: `avgDistance`
  → Suggested Spanish: **[ES: avgDistance]**
  Snippet: <p class="text-sm text-blue-600 dark:text-blue-400">{{ $t('avgDistance') }}</p>

- **L54** `t(key)` key: `potentialEarnings`
  → Suggested Spanish: **[ES: potentialEarnings]**
  Snippet: {{ $t('potentialEarnings') }}: ${{ ordersSummary.totalEarnings }}

- **L91** `t(key)` key: `to`
  → Suggested Spanish: **[ES: to]**
  Snippet: {{ $t('to') }} {{ order.customer }}

- **L97** `t(key)` key: `items`
  → Suggested Spanish: **artículos**
  Snippet: {{ order.items }} {{ $t('items') }}

- **L139** `t(key)` key: `pickup`
  → Suggested Spanish: **[ES: pickup]**
  Snippet: {{ $t('pickup') }}

- **L160** `t(key)` key: `dropoff`
  → Suggested Spanish: **[ES: dropoff]**
  Snippet: {{ $t('dropoff') }}

- **L176** `t(key)` key: `acceptOrder`
  → Suggested Spanish: **[ES: acceptOrder]**
  Snippet: {{ $t('acceptOrder') }}

- **L182** `t(key)` key: `decline`
  → Suggested Spanish: **[ES: decline]**
  Snippet: {{ $t('decline') }}

- **L190** `t(key)` key: `viewDelivery`
  → Suggested Spanish: **[ES: viewDelivery]**
  Snippet: {{ $t('viewDelivery') }}

- **L5** `$t(key)` key: `orders`
  → Suggested Spanish: **Pedidos**
  Snippet: <h1 class="text-2xl font-bold text-gray-900">{{ $t('orders') }}</h1>

- **L6** `$t(key)` key: `manageDeliveries`
  → Suggested Spanish: **[ES: manageDeliveries]**
  Snippet: <p class="text-gray-600 mt-1">{{ $t('manageDeliveries') }}</p>

- **L51** `$t(key)` key: `avgDistance`
  → Suggested Spanish: **[ES: avgDistance]**
  Snippet: <p class="text-sm text-blue-600 dark:text-blue-400">{{ $t('avgDistance') }}</p>

- **L54** `$t(key)` key: `potentialEarnings`
  → Suggested Spanish: **[ES: potentialEarnings]**
  Snippet: {{ $t('potentialEarnings') }}: ${{ ordersSummary.totalEarnings }}

- **L91** `$t(key)` key: `to`
  → Suggested Spanish: **[ES: to]**
  Snippet: {{ $t('to') }} {{ order.customer }}

- **L97** `$t(key)` key: `items`
  → Suggested Spanish: **artículos**
  Snippet: {{ order.items }} {{ $t('items') }}

- **L139** `$t(key)` key: `pickup`
  → Suggested Spanish: **[ES: pickup]**
  Snippet: {{ $t('pickup') }}

- **L160** `$t(key)` key: `dropoff`
  → Suggested Spanish: **[ES: dropoff]**
  Snippet: {{ $t('dropoff') }}

- **L176** `$t(key)` key: `acceptOrder`
  → Suggested Spanish: **[ES: acceptOrder]**
  Snippet: {{ $t('acceptOrder') }}

- **L182** `$t(key)` key: `decline`
  → Suggested Spanish: **[ES: decline]**
  Snippet: {{ $t('decline') }}

- **L190** `$t(key)` key: `viewDelivery`
  → Suggested Spanish: **[ES: viewDelivery]**
  Snippet: {{ $t('viewDelivery') }}

- **L29** `t(dynamic)` key: `tab.label`
  → Suggested Spanish: **[ES: tab.label]**
  Snippet: {{ $t(tab.label) }} ({{ tabCount(tab.key) }})

- **L46** `t(dynamic)` key: `ordersSummary.title`
  → Suggested Spanish: **[ES: ordersSummary.title]**
  Snippet: <p class="font-medium text-blue-900 dark:text-blue-200">{{ $t(ordersSummary.title) }}</p>

- **L47** `t(dynamic)` key: `ordersSummary.subtitle`
  → Suggested Spanish: **Gestiona tu negocio**
  Snippet: <p class="text-sm text-blue-700 dark:text-blue-300">{{ $t(ordersSummary.subtitle) }}</p>


## src/features/delivery/containers/ProfilePanel.vue

- **L6** `t(key)` key: `profileAndSettings`
  → Suggested Spanish: **[ES: profileAndSettings]**
  Snippet: {{ $t('profileAndSettings') }}

- **L9** `t(key)` key: `manageAccountPreferences`
  → Suggested Spanish: **[ES: manageAccountPreferences]**
  Snippet: {{ $t('manageAccountPreferences') }}

- **L41** `t(key)` key: `rating`
  → Suggested Spanish: **[ES: rating]**
  Snippet: <span>{{ $t('rating') }}</span>

- **L53** `t(key)` key: `editProfile`
  → Suggested Spanish: **[ES: editProfile]**
  Snippet: {{ $t('editProfile') }}

- **L44** `t(key, params)` key: `deliveriesCount`
  → Suggested Spanish: **[ES: deliveriesCount]**
  Snippet: <span>{{ $t('deliveriesCount', { count: 1247 }) }}</span>

- **L46** `t(key, params)` key: `memberSince`
  → Suggested Spanish: **[ES: memberSince]**
  Snippet: <span>{{ $t('memberSince', { date: 'March 2023' }) }}</span>

- **L6** `$t(key)` key: `profileAndSettings`
  → Suggested Spanish: **[ES: profileAndSettings]**
  Snippet: {{ $t('profileAndSettings') }}

- **L9** `$t(key)` key: `manageAccountPreferences`
  → Suggested Spanish: **[ES: manageAccountPreferences]**
  Snippet: {{ $t('manageAccountPreferences') }}

- **L41** `$t(key)` key: `rating`
  → Suggested Spanish: **[ES: rating]**
  Snippet: <span>{{ $t('rating') }}</span>

- **L53** `$t(key)` key: `editProfile`
  → Suggested Spanish: **[ES: editProfile]**
  Snippet: {{ $t('editProfile') }}

- **L44** `$t(key, params)` key: `deliveriesCount`
  → Suggested Spanish: **[ES: deliveriesCount]**
  Snippet: <span>{{ $t('deliveriesCount', { count: 1247 }) }}</span>

- **L46** `$t(key, params)` key: `memberSince`
  → Suggested Spanish: **[ES: memberSince]**
  Snippet: <span>{{ $t('memberSince', { date: 'March 2023' }) }}</span>

- **L72** `t(dynamic)` key: `tab.label`
  → Suggested Spanish: **[ES: tab.label]**
  Snippet: <span>{{ $t(tab.label) }}</span>


## src/features/delivery/views/LiveDelivery.vue

- **L7** `t(key)` key: `liveDelivery`
  → Suggested Spanish: **[ES: liveDelivery]**
  Snippet: {{ t('liveDelivery') }}

- **L10** `t(key)` key: `trackYourDelivery`
  → Suggested Spanish: **[ES: trackYourDelivery]**
  Snippet: {{ t('trackYourDelivery') }}

- **L32** `t(key)` key: `deliveryFee`
  → Suggested Spanish: **[ES: deliveryFee]**
  Snippet: {{ t('deliveryFee') }}: ${{ deliveryStore.activeOrder.fee.toFixed(2) }}

- **L95** `t(key)` key: `markPickedUp`
  → Suggested Spanish: **[ES: markPickedUp]**
  Snippet: {{ t('markPickedUp') }}

- **L103** `t(key)` key: `startDelivery`
  → Suggested Spanish: **[ES: startDelivery]**
  Snippet: {{ t('startDelivery') }}

- **L111** `t(key)` key: `markDelivered`
  → Suggested Spanish: **[ES: markDelivered]**
  Snippet: {{ t('markDelivered') }}

- **L118** `t(key)` key: `callCustomer`
  → Suggested Spanish: **[ES: callCustomer]**
  Snippet: {{ t('callCustomer') }}

- **L129** `t(key)` key: `currentLocation`
  → Suggested Spanish: **[ES: currentLocation]**
  Snippet: {{ t('currentLocation') }}

- **L133** `t(key)` key: `latitude`
  → Suggested Spanish: **[ES: latitude]**
  Snippet: <span class="text-gray-600 dark:text-gray-400">{{ t('latitude') }}:</span>

- **L139** `t(key)` key: `longitude`
  → Suggested Spanish: **[ES: longitude]**
  Snippet: <span class="text-gray-600 dark:text-gray-400">{{ t('longitude') }}:</span>

- **L145** `t(key)` key: `accuracy`
  → Suggested Spanish: **[ES: accuracy]**
  Snippet: <span class="text-gray-600 dark:text-gray-400">{{ t('accuracy') }}:</span>

- **L151** `t(key)` key: `lastUpdate`
  → Suggested Spanish: **[ES: lastUpdate]**
  Snippet: <span class="text-gray-600 dark:text-gray-400">{{ t('lastUpdate') }}:</span>

- **L159** `t(key)` key: `locationNotAvailable`
  → Suggested Spanish: **[ES: locationNotAvailable]**
  Snippet: <p>{{ t('locationNotAvailable') }}</p>

- **L169** `t(key)` key: `deliveryRoute`
  → Suggested Spanish: **[ES: deliveryRoute]**
  Snippet: {{ t('deliveryRoute') }}

- **L227** `t(key)` key: `distance`
  → Suggested Spanish: **[ES: distance]**
  Snippet: <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('distance') }}</p>

- **L233** `t(key)` key: `estimatedTime`
  → Suggested Spanish: **[ES: estimatedTime]**
  Snippet: <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('estimatedTime') }}</p>

- **L247** `t(key)` key: `orderItems`
  → Suggested Spanish: **[ES: orderItems]**
  Snippet: {{ t('orderItems') }}

- **L81** `t(dynamic)` key: `step.label`
  → Suggested Spanish: **[ES: step.label]**
  Snippet: {{ t(step.label) }}

- **L270** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar


## src/shared/layout/LanguageToggle.vue

- **L21** `useI18n()` key: `(remove when replacing with Spanish)`
  Snippet: const { t } = useI18n(); or similar

