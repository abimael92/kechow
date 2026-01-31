# UI text inventory — layouts, pages, shared UI

Inventory of layout, page, and shared UI components that render user-facing text. Use this for **Spanish-only** and **responsive (mobile-first)** work on branch `feature/es-only-responsive-mobile`.

---

## 1. Layouts

| Component | Path | User-facing text / i18n |
|-----------|------|-------------------------|
| **MainLayout** | `src/shared/layout/MainLayout.vue` | Skip link: `$t('skipToContent') \|\| 'Skip to main content'` (English fallback). |
| **CustomerLayout** | `src/shared/layout/CustomerLayout.vue` | Same skip link fallback. |
| **OwnerLayout** | `src/shared/layout/OwnerLayout.vue` | Same skip link fallback. |
| **DeliveryLayout** | `src/shared/layout/DeliveryLayout.vue` | Same skip link fallback. |
| **RoleNavigation** | `src/shared/layout/RoleNavigation.vue` | Labels from i18n (`dashboard`, `orders`, etc.); mobile label `currentActiveLabel \|\| 'Menú'`; aria "Navegación {role}". |
| **LanguageToggle** | `src/shared/layout/LanguageToggle.vue` | Button label: `currentLocale === 'en' ? 'Español' : 'English'` (hardcoded). |
| **Header** | `src/components/layout/Header.vue` | "Kechow" (title), "Kechow Logo", "Toggle menu", "Toggle dark mode", "User menu", "Profile", "Logout", "Light Mode", "Dark Mode" (all hardcoded English). |
| **Footer** | `src/components/layout/Footer.vue` | All via `$t()`: kechowFoodDelivery, yourLocalFoodDeliveryIsCooking, explore, aboutUs, careers, terms, privacy, connect, allRightsReserved. |
| **RoleNavbar** | `src/components/layout/RoleNavbar.vue` | Role-specific nav labels (likely i18n or hardcoded). |

---

## 2. Pages

| Page | Path | Notes |
|------|------|--------|
| **LandingPage** | `src/pages/LandingPage.vue` | i18n keys for hero, CTA, footer-style content. |
| **HomePage** | `src/pages/HomePage.vue` | i18n: restaurants, searchPlaceholder, featuredCategories, etc.; may have hardcoded category names. |
| **RestaurantListPage** | `src/pages/RestaurantListPage.vue` | User-facing labels, search, categories. |
| **RestaurantDetailView** | `src/pages/RestaurantDetailView.vue` | Menu, price, add to cart, etc. |
| **CartPage** | `src/pages/customer/CartPage.vue` | Wraps CartView; may have minimal text. |
| **CheckoutPage** | `src/pages/customer/CheckoutPage.vue` | Subtotal, delivery, total, buttons; i18n + possible fallbacks. |
| **OrdersPage** | `src/pages/customer/OrdersPage.vue` | Order list labels. |
| **OrderTrackingPage** | `src/pages/customer/OrderTrackingPage.vue` | Status, timeline text. |
| **ProfilePage** (customer) | `src/pages/customer/ProfilePage.vue` | Profile form labels. |
| **ReviewsPage** (customer) | `src/pages/customer/ReviewsPage.vue` | Reviews UI text. |
| **OwnerDashboardPage** | `src/pages/owner/OwnerDashboardPage.vue` | Dashboard copy. |
| **MenuPage** (owner) | `src/pages/owner/MenuPage.vue` | Menu management labels. |
| **EditMenuItemPage** | `src/pages/owner/EditMenuItemPage.vue` | Form labels, buttons. |
| **OrdersListPage** (owner) | `src/pages/owner/OrdersListPage.vue` | Orders table/list text. |
| **AnalyticsPage** | `src/pages/owner/AnalyticsPage.vue` | Chart labels, metrics. |
| **ReviewsPage** (owner) | `src/pages/owner/ReviewsPage.vue` | Reviews management text. |
| **OwnerSettingsPage** | `src/pages/owner/OwnerSettingsPage.vue` | Settings section titles. |
| **DeliveryDashboard** (view) | `src/features/delivery/views/DeliveryDashboard.vue` | Dashboard text. |
| **DeliveryOrderDetail** | `src/features/delivery/views/DeliveryOrderDetail.vue` | Order detail labels. |
| **LiveDelivery** | `src/features/delivery/views/LiveDelivery.vue` | Live tracking text. |
| **ProfilePage** (delivery) | `src/pages/delivery/ProfilePage.vue` | Profile form. |
| **EarningsPage** (delivery) | `src/pages/delivery/EarningsPage.vue` | Earnings labels. |
| **OrderDetailPage** (delivery) | `src/pages/delivery/OrderDetailPage.vue` | Order list/detail. |

---

## 3. Shared UI components

| Component | Path | User-facing text |
|-----------|------|------------------|
| **EmptyState** | `src/shared/ui/EmptyState.vue` | Props: `title`, `description` (callers pass text); no hardcoded strings. |
| **ErrorBoundary** | `src/shared/ui/ErrorBoundary.vue` | Default props: `title: 'Something went wrong'`, `message: 'An unexpected error occurred...'`, `retryLabel: 'Try again'`, `reloadLabel: 'Reload page'` (English). |
| **NetworkBanner** | `src/shared/ui/NetworkBanner.vue` | Default `message: "You're offline. Some actions are unavailable."` (English). |
| **BaseButton** | `src/shared/ui/BaseButton.vue` | Slot only; no visible text. |
| **NavButton** | `src/shared/ui/NavButton.vue` | Slot only; no visible text. |
| **Skeleton** | `src/shared/ui/Skeleton.vue` | No user-facing text. |
| **IconClose** | `src/shared/ui/IconClose.vue` | No user-facing text. |
| **SearchBar** | `src/components/SearchBar.vue` | Placeholder and any labels. |
| **RestaurantCard** | `src/components/RestaurantCard.vue` | Restaurant name, description, etc. (props or i18n). |
| **CategoryChips** | `src/components/CategoryChips.vue` | Category names. |
| **ConfirmationModal** | `src/components/ConfirmationModal.vue` | Title, message, button labels (props or defaults). |

---

## 4. Feature components (auth, customer, owner, delivery)

These are used by pages and often contain the bulk of visible copy:

| Area | Components / views | Text source |
|------|--------------------|-------------|
| **Auth** | `LoginForm.vue`, `RegisterView.vue` | i18n (login, register, errors); may have fallbacks. |
| **Customer** | `CartPanel.vue`, `OrdersPanel.vue`, `OrderCard.vue` | Mix of i18n and hardcoded (e.g. "Español"/"English", cart copy). |
| **Business owner** | `DashboardOverview.vue`, `MenuManagement.vue`, `MenuItemCard.vue`, `MenuModal.vue`, `OrdersPanel.vue`, `OrderCard.vue`, `AnalyticsPanel.vue`, `AnalyticsCard.vue`, charts (`OrdersByHourChart`, `RevenueChart`, `SalesByCategoryChart`), `ReviewsPanel.vue`, `ReviewCard.vue`, `ReviewStatsCard.vue`, `RatingDistribution.vue`, `SettingsPanel.vue`, settings subcomponents (`GeneralSettings`, `DeliverySettings`, `MenuSettings`, `NotificationSettings`, `OperatingHoursDay`, `PaymentSettings`, `StaffSettings`), `TopSellingItem.vue` | i18n keys + possible hardcoded English. |
| **Delivery** | `DashboardOverview.vue`, `EarningsPanel.vue`, `ProfilePanel.vue`, `OrdersPanel.vue`, profile subcomponents (`ProfileInfo`, `ScheduleInfo`, `VehicleInfo`, `NotificationsSettings`, `SupportInfo`), `DeliveryOrderDetail.vue`, `LiveDelivery.vue`, `DeliverySettings.vue` | i18n + hardcoded strings. |

---

## 5. i18n and locale

- **Config**: `src/app/config/i18n.config.ts` — locale `es`, fallback `es`; messages `en`, `es`.
- **Locale files**: `src/app/locales/en.json`, `src/app/locales/es.json` — all UI keys; for Spanish-only, UI can rely on `es` only (no English bundle needed for display if locale is fixed to `es`).
- **Fallbacks in templates**: Several components use `$t('key') || 'English fallback'`. For Spanish-only, remove English fallbacks and use only Spanish (or drop fallbacks and rely on `es.json`).

---

## 6. Summary for Spanish-only + mobile-first

1. **Layouts**: MainLayout, CustomerLayout, OwnerLayout, DeliveryLayout (skip link); Header (all hardcoded English → Spanish or i18n); Footer (already i18n); RoleNavigation (i18n + "Menú"); LanguageToggle (Spanish-only: can hide or show single "Idioma" / remove toggle).  
2. **Pages**: Every page under `src/pages/` and delivery views under `src/features/delivery/views/` — ensure all visible text comes from `es.json` or Spanish defaults.  
3. **Shared UI**: ErrorBoundary, NetworkBanner — change default props to Spanish; EmptyState, ConfirmationModal — ensure callers pass Spanish; SearchBar, RestaurantCard, CategoryChips — Spanish placeholders/labels.  
4. **Feature components**: All listed in §4 — replace any hardcoded English with Spanish or i18n keys present in `es.json`.  
5. **Mobile-first**: Audit the same components for layout and breakpoints (e.g. Header drawer, RoleNavigation mobile menu, tables/cards on small screens).

---

*Generated for branch `feature/es-only-responsive-mobile`. Do not modify `main`.*
