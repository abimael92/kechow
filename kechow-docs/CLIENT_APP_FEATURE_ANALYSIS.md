# Kechow Food Delivery – Client App Feature Analysis

**Scope:** Customer-facing pages (Inicio, Restaurantes, Carrito, Mis Pedidos, Reseñas, Perfil)  
**Language:** Spanish only  
**Last updated:** February 2025

---

## A. REAL DATA INTEGRATION

### Page → Database/API Mapping

| Page | Data Source | API Endpoints | Real-time |
|------|-------------|---------------|-----------|
| **Inicio (Home)** | `restaurants.ts` (shared) | None | No |
| **Restaurantes** | `restaurants.ts` or API | `GET /api/restaurants`, `GET /api/restaurants/:id` | No |
| **Restaurante Detalle** | `restaurants.ts` (local) | `GET /api/restaurants/:id`, `GET /api/restaurants/:id/menu` | No |
| **Mi Carrito** | Local state only | None | No |
| **Checkout** | Profile API | `GET /api/customer/profile`, `POST /api/customer/orders` | No |
| **Mis Pedidos** | Order API | `GET /api/customer/orders` | No |
| **Rastreo Pedido** | Order API | `GET /api/customer/orders/:id`, `GET /api/customer/orders/:id/track` | Polling (10s) |
| **Reseñas** | Reviews API | `GET /api/restaurants/:id/reviews`, `POST /api/customer/reviews` | No |
| **Perfil** | Profile API | `GET /api/customer/profile`, `PUT /api/customer/profile`, CRUD `/api/customer/addresses` | No |

### Backend Tables/Models (Server)

| Table/Model | Used By | Notes |
|-------------|---------|-------|
| `restaurants` | Restaurants, Menu | RestaurantController, MenuItemController |
| `menu_items` | Restaurant detail | MenuItemController |
| `orders` | Orders, tracking | OrderController |
| `order_items` | Order details | Order model |
| `users` | Auth, customer, driver | User model |
| `reviews` | Reviews page | Not fully implemented in backend |
| `addresses` | Profile, checkout | Customer profile – may need migration |

### API Endpoint Reality Check

**Frontend expects (customer.service.ts):**
- `GET /restaurants` – ✅ Exists as `GET /api/restaurants`
- `GET /restaurants/:id` – ✅ Exists
- `GET /restaurants/:id/menu` – ⚠️ Backend uses `GET /api/restaurants/:id/menu-items`
- `GET /customer/orders` – ⚠️ Backend has `GET /api/orders` (auth-scoped)
- `GET /customer/orders/:id` – ⚠️ Backend has `GET /api/orders/:id`
- `GET /customer/orders/:id/track` – ❓ May not exist
- `POST /customer/orders` – ✅ Backend has `POST /api/orders`
- `GET /restaurants/:id/reviews` – ❓ May not exist
- `POST /customer/reviews` – ❓ May not exist
- `GET/PUT /customer/profile` – ❓ May not exist
| `POST/PUT/DELETE /customer/addresses` – ❓ May not exist

**Note:** Axios baseURL typically includes `/api`. Customer routes (`/customer/*`) may need backend implementation.

### Real-time / Polling

| Feature | Implementation |
|---------|----------------|
| New orders | None on client |
| Order status updates | Polling every 10s on OrderTrackingPage |
| WebSocket | Not used |
| Push notifications | Not implemented |

---

## B. FULLY RESPONSIVE CHECK

### Breakpoints Used

| Breakpoint | Tailwind | Usage |
|------------|----------|--------|
| Default | — | Mobile-first base |
| sm | 640px | Padding, text, layout tweaks |
| md | 768px | Grid columns, spacing |
| lg | 1024px | Sidebar visibility, 3-col layouts |
| xl | 1280px | Max widths, hero sizing |

### Touch Targets

| Element | Min Size | Location |
|---------|----------|----------|
| `.btn-primary`, `.btn-secondary` | 44px height | global.css |
| Cart quantity buttons | 50×32px mobile, 60×32px sm+ | CartPanel |
| Order tracking buttons | py-3 (min ~44px) | OrderTrackingPage |
| Category chips | min-w-[72px], padding | HomePage, RestaurantList |
| **Gaps:** Some icon-only buttons (e.g. filter, refresh) may be <44px | — | OrdersPage, RestaurantList |

### Landscape / Portrait

- No explicit orientation handling
- Horizontal scroll on category chips (`overflow-x-auto`)
- Sticky headers on mobile

### Slow Connection

| Feature | Status |
|---------|--------|
| Loading skeletons | OrdersPage, OrderTrackingPage, ReviewsPage, ProfilePage |
| Image lazy loading | HomePage (`loading="lazy"` on restaurant images) |
| Error states | EmptyState, loadError on OrdersPage |
| Retry buttons | OrdersPage, NetworkBanner |
| Offline detection | `useOnline()` – disables refresh on OrdersPage |

---

## C. COLOR SYSTEM AUDIT

### Primary (Brand Orange)

| Usage | Classes |
|-------|---------|
| CTAs, main actions | `bg-primary-500`, `bg-primary-600`, `text-primary-500` |
| Focus rings | `ring-primary-500`, `focus:ring-primary-500` |
| Headings (dark) | `text-primary-500 dark:text-primary-400` |
| Borders (active) | `border-primary-500` |

**Values:** `#FF6B00` (500), `#E65F00` (600), `#CC5500` (700)

### Secondary (Neutral/Gray)

| Usage | Classes |
|-------|---------|
| Text | `text-secondary-900`, `text-secondary-500` |
| Backgrounds | `bg-secondary-100`, `bg-secondary-800` |
| Borders | `border-secondary-300` |

### Tertiary (Teal/Cyan)

| Usage | Classes |
|-------|---------|
| Accents | `tertiary-500`, `tertiary-600` |
| Driver cards, secondary highlights | OrderCard, DashboardOverview |

### Dark / Light Mode

| Aspect | Implementation |
|--------|----------------|
| Toggle | Header (desktop), Burger menu (mobile) |
| Class | `dark` on `<html>` |
| CSS vars | `--color-app-bg`, `--color-card` override in `.dark` |
| Consistency | Primary/secondary/tertiary have dark variants (`dark:text-*`, `dark:bg-*`) |

### Inconsistencies

- Some pages use `purple-600` for CTAs (Reviews, Profile, OrderTracking) instead of primary
- Checkout and Orders use orange (`orange-600`) in places
- Mixed use of `gray-*` vs `secondary-*`

---

## D. SPANISH CONTENT ONLY

### Verification

| Source | Status |
|--------|--------|
| Nav labels | Spanish in nav.config.ts |
| Page titles/copy | Mostly hardcoded Spanish |
| es.json | 800+ keys |
| en.json | Present but app targets Spanish |
| i18n usage | Partial – some components use `$t()`, many use hardcoded Spanish |

### Hardcoded Spanish (No i18n)

- HomePage: "Restaurantes", "Categorías destacadas", "Restaurantes destacados", "Ver todo", "Imagen no disponible"
- RestaurantDetailView: "Volver", "Añadir al carrito"
- CartPanel: "Mi carrito", "Seguir comprando", "Resumen del pedido", etc.
- OrderTrackingPage: "Pedido Recibido", "En Preparación", "Listo para Entrega", etc.
- ReviewsPage: "Reseñas", "Escribir Reseña", "Publicar Reseña"
- ProfilePage: "Mi Perfil", "Información Personal", "Mis Direcciones"

### Translation Key Gaps

- Many customer pages do not use `$t()` consistently
- Order status labels, payment labels often hardcoded

### Regional Variations (MX vs ES)

- `toLocaleDateString('es-MX', ...)` used for dates
- Currency: MXN in formatCurrency
- No explicit MX vs ES locale switching

---

## E. FEATURE LIST PER PAGE

### 1. Inicio (Home) – `/home`

| Category | Details |
|----------|---------|
| **Core functionality** | Browse restaurants, search, filter by category |
| **User flow** | Land → Search/filter → Tap restaurant → Restaurant detail |
| **Business logic** | Filter by name/description; category filter |
| **Edge cases** | Empty result (none); "Imagen no disponible" fallback |
| **Performance** | Lazy loading images; local data (no API) |
| **Data source** | `@/shared/data/restaurants` (static) |

### 2. Restaurantes – `/restaurants`

| Category | Details |
|----------|---------|
| **Core functionality** | List restaurants, search, category filter, sort (name/rating/deliveryTime), price filter |
| **User flow** | Open → Filter/sort → Tap card → Detail; Cart icon → Cart |
| **Business logic** | Sort options; price radio ($/$$/$$$); category chips |
| **Edge cases** | Empty list; mobile menu; scroll indicators on categories |
| **Performance** | `useFilteredRestaurants`; API or local fallback |
| **Data source** | `getRestaurants()` API or `restaurants.ts` |

### 3. Restaurante Detalle – `/restaurants/:id`

| Category | Details |
|----------|---------|
| **Core functionality** | View menu, add to cart (quantity), view cart |
| **User flow** | Open → Add items → Adjust quantity → Go to cart |
| **Business logic** | Max qty 20; stock check; cart local state (not persisted to API) |
| **Edge cases** | Restaurant not found; stock = 0; back navigation |
| **Performance** | Local cart in component; restaurant from shared data |
| **Data source** | `restaurants` (shared); cart in `ref` |

### 4. Mi Carrito – `/cart`

| Category | Details |
|----------|---------|
| **Core functionality** | View items, change quantity, remove, see totals, go to checkout |
| **User flow** | View cart → Adjust → Checkout |
| **Business logic** | Delivery: $50 if total < $250, free otherwise; Tax 8% |
| **Edge cases** | Empty cart (CTA "Ver menú"); free delivery progress bar |
| **Performance** | TransitionGroup for list; hardcoded cart (no API) |
| **Data source** | `CartPanel` – hardcoded `cart` ref (no persistence) |

**Critical gap:** Cart is hardcoded in CartPanel, not shared with RestaurantDetailView. Cart state is not unified across app.

### 5. Checkout – `/checkout`

| Category | Details |
|----------|---------|
| **Core functionality** | Select address, special instructions, payment method, place order |
| **User flow** | Select address → Instructions → Payment → Confirm |
| **Business logic** | Requires address; payment: cash/card/online (UI only, no real payment) |
| **Edge cases** | No addresses (add new); loading state |
| **Performance** | Loads profile/addresses from API |
| **Data source** | `getCustomerProfile()`, `createOrder()` |

### 6. Mis Pedidos – `/orders`

| Category | Details |
|----------|---------|
| **Core functionality** | List orders, search, category filter, refresh, open tracking |
| **User flow** | View list → Search/filter → Tap order → Track |
| **Business logic** | Categories from i18n; search by ID/customer/items |
| **Edge cases** | No orders; offline (refresh disabled); load error with retry |
| **Performance** | Skeleton loading; `useOnline`; refresh button |
| **Data source** | `getCustomerOrders()` |

### 7. Rastreo Pedido – `/orders/:id/track`

| Category | Details |
|----------|---------|
| **Core functionality** | View order status, timeline, details, delivery info; "Dejar Reseña" when delivered |
| **User flow** | View status → Poll for updates → Delivered → Leave review |
| **Business logic** | Status timeline (5 steps); polling every 10s until delivered/cancelled |
| **Edge cases** | Order not found; stop polling on unmount |
| **Performance** | Polling `trackOrder()` every 10s |
| **Data source** | `getOrder()`, `trackOrder()` |

### 8. Reseñas – `/reviews`

| Category | Details |
|----------|---------|
| **Core functionality** | View reviews, create review (restaurant, rating, comment), mark helpful |
| **User flow** | View list → "Nueva Reseña" → Select restaurant, rate, comment → Publish |
| **Business logic** | Validation: restaurant + rating + comment required |
| **Edge cases** | No reviews; `orderId` from query for post-delivery review |
| **Performance** | Load reviews for first restaurant; `toggleHelpful` is client-only (no API) |
| **Data source** | `getRestaurantReviews()`, `createReview()`, `getRestaurants()` |

### 9. Perfil – `/profile`

| Category | Details |
|----------|---------|
| **Core functionality** | View/edit name, email, phone; CRUD addresses |
| **User flow** | View → Edit → Save; Add/Edit/Delete address via modal |
| **Business logic** | Address: label, street required; default address flag |
| **Edge cases** | No addresses; confirm before delete |
| **Performance** | Loading skeleton; modal for address form |
| **Data source** | `getCustomerProfile()`, `updateCustomerProfile()`, `addAddress()`, `updateAddress()`, `deleteAddress()` |

---

## F. DELIVERY-SPECIFIC FEATURES

| Feature | Status | Notes |
|---------|--------|-------|
| **Real-time order tracking** | Polling | 10s interval on OrderTrackingPage |
| **Driver location / map** | Not implemented | No map component |
| **Estimated delivery time** | Not shown | Backend has `estimated_delivery_time`; not displayed to customer |
| **Delivery fee calculation** | Implemented | Cart: $50 if total < $250, else free |
| **Payment processing** | UI only | Cash/card/online selection; no gateway |
| **Rating/review system** | Implemented | Create review; star rating; helpful count (client-only) |
| **Order modification** | Not implemented | No edit/cancel from customer |
| **Order cancellation rules** | Backend only | Owner/driver can cancel; customer UI missing |

---

## G. ACCESSIBILITY

| Aspect | Status | Notes |
|--------|--------|-------|
| **Skip link** | ✅ | "Saltar al contenido principal" in layout |
| **Focus visible** | ✅ | `focus-visible:ring-2` on main, buttons |
| **ARIA labels** | Partial | Some buttons have `aria-label`; many lack |
| **Keyboard nav** | Partial | Forms focusable; modal trap not verified |
| **Color contrast** | Not audited | Primary on white likely OK; no WCAG audit |
| **Font scalability** | Partial | `clamp()` on hero/h1; no explicit user scaling |
| **Screen reader** | Partial | Semantic HTML; some images missing alt |

---

## FEATURE MATRIX SUMMARY

| Page | Real API | Responsive | Touch 44px | Spanish | Dark mode | Loading | Empty | Error |
|------|----------|------------|------------|---------|-----------|---------|-------|-------|
| Inicio | ❌ Local | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Restaurantes | ✅/⚠️ | ✅ | ⚠️ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Rest. Detalle | ❌ Local | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Carrito | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Checkout | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| Mis Pedidos | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Rastreo | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reseñas | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Perfil | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | ❌ |

---

## RECOMMENDATIONS

### High Priority

1. **Unify cart state** – Cart from RestaurantDetailView is not shared with CartPanel; implement global cart (Pinia/store or composable).
2. **Verify customer API routes** – Ensure backend exposes `/api/customer/*` or align frontend with actual routes (`/api/orders` for customer orders).
3. **Reviews/menu API** – Confirm `GET /restaurants/:id/reviews`, `GET /restaurants/:id/menu` (or menu-items) and implement if missing.

### Medium Priority

4. **Touch targets** – Audit filter/refresh and small icon buttons; enforce 44×44px minimum.
5. **i18n consistency** – Replace hardcoded strings with `$t()` for easier maintenance.
6. **CTA color consistency** – Prefer primary (orange) over purple for main actions.

### Lower Priority

7. **Driver map** – Add optional map for order tracking.
8. **Offline cart** – Persist cart in localStorage for refresh/offline.
9. **Accessibility audit** – WCAG 2.1 check; improve ARIA and keyboard nav.
