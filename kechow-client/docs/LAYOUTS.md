# Layouts Documentation

## Overview
The application uses role-specific layouts with mobile-first responsive navigation. Each role has its own dedicated layout component that provides consistent navigation and structure.

## Layout Components

### 1. CustomerLayout
**Path:** `src/shared/layout/CustomerLayout.vue`

**Purpose:** Layout for customer-facing screens

**Components:**
- `Header` - Shared header component
- `RoleNavigation` - Role-specific navigation (customer)
- `Footer` - Shared footer component
- `router-view` - Main content area

**Features:**
- Mobile-first responsive design
- Active route highlighting
- Spanish text only

### 2. OwnerLayout
**Path:** `src/shared/layout/OwnerLayout.vue`

**Purpose:** Layout for restaurant owner screens

**Components:**
- `Header` - Shared header component
- `RoleNavigation` - Role-specific navigation (owner)
- `Footer` - Shared footer component
- `router-view` - Main content area

**Features:**
- Mobile-first responsive design
- Active route highlighting
- Spanish text only

### 3. DeliveryLayout
**Path:** `src/shared/layout/DeliveryLayout.vue`

**Purpose:** Layout for delivery driver screens

**Components:**
- `Header` - Shared header component
- `RoleNavigation` - Role-specific navigation (delivery)
- `Footer` - Shared footer component
- `router-view` - Main content area

**Features:**
- Mobile-first responsive design
- Active route highlighting
- Spanish text only

### 4. MainLayout
**Path:** `src/shared/layout/MainLayout.vue`

**Purpose:** Layout for public/unauthenticated screens

**Components:**
- `Header` - Shared header component
- `Footer` - Shared footer component
- `router-view` - Main content area

**Used for:**
- Landing page
- Login page
- Registration page

## Shared Components

### RoleNavigation
**Path:** `src/shared/layout/RoleNavigation.vue`

**Purpose:** Responsive navigation component that adapts to user role

**Features:**
- **Desktop:** Horizontal navigation bar with active route highlighting
- **Mobile:** Collapsible dropdown menu with current route indicator
- Active route visual indicators (underline on desktop, checkmark on mobile)
- Smooth transitions and animations
- Spanish labels only

**Props:**
- `role: 'customer' | 'owner' | 'delivery'` - User role to determine navigation items

**Navigation Items by Role:**

#### Customer Navigation
- Inicio (`/home`)
- Restaurantes (`/restaurants`)
- Mi Carrito (`/cart`)
- Mis Pedidos (`/orders`)

#### Owner Navigation
- Panel de Control (`/owner/dashboard`)
- Pedidos (`/owner/orders`)
- Menú (`/owner/menu`)
- Analíticas (`/owner/analytics`)
- Reseñas (`/owner/reviews`)
- Configuración (`/owner/settings`)

#### Delivery Navigation
- Panel de Control (`/delivery/dashboard`)
- Pedidos (`/delivery/orders`)
- Ganancias (`/delivery/earnings`)
- Perfil (`/delivery/profile`)

## Screen Mappings

### Customer Screens (CustomerLayout)

| Route | Screen Name | Component |
|-------|-------------|-----------|
| `/home` | Inicio | `HomePage.vue` |
| `/restaurants` | Restaurantes | `RestaurantListPage.vue` |
| `/restaurants/:id` | Detalle de Restaurante | `RestaurantDetailView.vue` |
| `/cart` | Mi Carrito | `CartPage.vue` |
| `/orders` | Mis Pedidos | `OrdersPage.vue` |

### Owner Screens (OwnerLayout)

| Route | Screen Name | Component |
|-------|-------------|-----------|
| `/owner/dashboard` | Panel de Control | `OwnerDashboardPage.vue` |
| `/owner/orders` | Pedidos | `OrdersListPage.vue` |
| `/owner/menu` | Menú | `MenuPage.vue` |
| `/owner/menu-items/edit/:id?` | Editar Elemento | `EditMenuItemPage.vue` |
| `/owner/analytics` | Analíticas | `AnalyticsPage.vue` |
| `/owner/reviews` | Reseñas | `ReviewsPage.vue` |
| `/owner/settings` | Configuración | `OwnerSettingsPage.vue` |

### Delivery Screens (DeliveryLayout)

| Route | Screen Name | Component |
|-------|-------------|-----------|
| `/delivery/dashboard` | Panel de Control | `DeliveryDashboard.vue` |
| `/delivery/orders` | Pedidos | `OrderDetailPage.vue` |
| `/delivery/order/:id` | Detalle de Pedido | `DeliveryOrderDetail.vue` |
| `/delivery/live/:id` | Entrega en Vivo | `LiveDelivery.vue` |
| `/delivery/earnings` | Ganancias | `EarningsPage.vue` |
| `/delivery/profile` | Perfil | `ProfilePage.vue` |

### Public Screens (MainLayout)

| Route | Screen Name | Component |
|-------|-------------|-----------|
| `/` | Página de Inicio | `LandingPage.vue` |
| `/login` | Iniciar Sesión | `LoginForm.vue` |
| `/register` | Registrarse | `RegisterView.vue` |

## Responsive Design

### Mobile (< 768px)
- Collapsible navigation menu
- Dropdown shows current active route
- Touch-friendly button sizes (min 44px)
- Full-width navigation items
- Smooth slide-down animation

### Desktop (≥ 768px)
- Horizontal navigation bar
- Active route highlighted with underline
- Hover effects on navigation items
- Centered navigation layout

## Active Route Highlighting

### Desktop
- Active route: White text, semi-transparent background (`bg-white/15`)
- Active indicator: Purple underline (`border-purple-400`)
- Font weight: Semibold for active route

### Mobile
- Active route: White text, semi-transparent background
- Active indicator: Purple checkmark icon
- Font weight: Semibold for active route

## Styling

All layouts use consistent styling:
- Background gradient: `from-[#734ce8] via-[#a98dd4] via-50% to-[#6b4476]`
- Navigation bar: `bg-[#2a1a40]/90 backdrop-blur-md`
- Text colors: White with opacity variations
- Transitions: Smooth 200ms transitions
- Spacing: Responsive padding (px-4 py-6 on mobile, px-12 py-8 on desktop)

## Implementation Notes

1. **No Business Logic Changes:** Layouts are purely presentational and don't contain business logic
2. **Spanish Text Only:** All navigation labels are in Spanish
3. **Mobile-First:** Navigation is designed for mobile devices first, then enhanced for desktop
4. **Shared Components:** Header and Footer are shared across all layouts
5. **Router Integration:** Layouts are assigned in `src/app/router/index.ts` based on route meta roles
