# Route Security Audit - Role Isolation

## Overview
Complete audit of route guards and role isolation enforcement. All protected routes are validated with strict role-based access control to prevent cross-role data or action leakage.

## Centralized Role Checking

**Location:** `src/shared/utils/role.utils.ts`

**Functions:**
- `getDashboardRouteForRole(role)` - Returns dashboard route for role
- `hasRequiredRole(userRole, requiredRole)` - Validates role match
- `requiresAuthentication(meta)` - Checks if route requires auth
- `requiresRole(meta)` - Extracts required role from route meta
- `isValidRole(role)` - Validates role is in allowed set

**Valid Roles:** `'owner' | 'delivery' | 'customer'`

## Route Guard Implementation

**Location:** `src/app/router/guards.ts`

**Guard Logic:**
1. ✅ Redirects authenticated users away from public pages
2. ✅ Blocks unauthenticated access to protected routes
3. ✅ Enforces strict role matching (exact role required)
4. ✅ Prevents cross-role access via URL manipulation
5. ✅ Redirects unauthorized users to their role dashboard

## Guarded Routes

### Public Routes (No Authentication Required)
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

### Customer Routes (22 routes - All Protected)

| Route | Name | Meta | Status |
|-------|------|------|--------|
| `/home` | Home | `{ requiresAuth: true, role: 'customer' }` | ✅ Guarded |
| `/restaurants` | RestaurantList | `{ requiresAuth: true, role: 'customer' }` | ✅ Guarded |
| `/restaurants/:id` | RestaurantDetail | `{ requiresAuth: true, role: 'customer' }` | ✅ Guarded |
| `/cart` | CartPage | `{ requiresAuth: true, role: 'customer' }` | ✅ Guarded |
| `/checkout` | CheckoutPage | `{ requiresAuth: true, role: 'customer' }` | ✅ Guarded |
| `/orders` | OrdersPage | `{ requiresAuth: true, role: 'customer' }` | ✅ Guarded |
| `/orders/:id/track` | OrderTracking | `{ requiresAuth: true, role: 'customer' }` | ✅ Guarded |
| `/reviews` | ReviewPage | `{ requiresAuth: true, role: 'customer' }` | ✅ Guarded |
| `/profile` | ProfilePage | `{ requiresAuth: true, role: 'customer' }` | ✅ Guarded |

### Owner Routes (7 routes - All Protected)

| Route | Name | Meta | Status |
|-------|------|------|--------|
| `/owner/dashboard` | OwnerDashboard | `{ requiresAuth: true, role: 'owner' }` | ✅ Guarded |
| `/owner/menu` | OwnerMenu | `{ requiresAuth: true, role: 'owner' }` | ✅ Guarded |
| `/owner/menu-items/edit/:id?` | OwnerEditMenuItem | `{ requiresAuth: true, role: 'owner' }` | ✅ Guarded |
| `/owner/analytics` | OwnerAnalytics | `{ requiresAuth: true, role: 'owner' }` | ✅ Guarded |
| `/owner/orders` | OwnerOrders | `{ requiresAuth: true, role: 'owner' }` | ✅ Guarded |
| `/owner/reviews` | ReviewsPage | `{ requiresAuth: true, role: 'owner' }` | ✅ Guarded |
| `/owner/settings` | OwnerSettings | `{ requiresAuth: true, role: 'owner' }` | ✅ Guarded |

### Delivery Routes (6 routes - All Protected)

| Route | Name | Meta | Status |
|-------|------|------|--------|
| `/delivery/dashboard` | DeliveryDashboard | `{ requiresAuth: true, role: 'delivery' }` | ✅ Guarded |
| `/delivery/order/:id` | DeliveryOrderDetail | `{ requiresAuth: true, role: 'delivery' }` | ✅ Guarded |
| `/delivery/live/:id` | LiveDelivery | `{ requiresAuth: true, role: 'delivery' }` | ✅ Guarded |
| `/delivery/profile` | DeliveryProfile | `{ requiresAuth: true, role: 'delivery' }` | ✅ Guarded |
| `/delivery/earnings` | DeliveryEarnings | `{ requiresAuth: true, role: 'delivery' }` | ✅ Guarded |
| `/delivery/orders` | DeliveryOrders | `{ requiresAuth: true, role: 'delivery' }` | ✅ Guarded |

**Total Protected Routes:** 22 routes (9 customer + 7 owner + 6 delivery)

## Cross-Role Access Prevention

### Test Cases - All Blocked ✅

#### Customer attempting Owner routes:
- Customer → `/owner/dashboard` → Redirected to `/home`
- Customer → `/owner/menu` → Redirected to `/home`
- Customer → `/owner/analytics` → Redirected to `/home`
- Customer → `/owner/orders` → Redirected to `/home`
- Customer → `/owner/reviews` → Redirected to `/home`
- Customer → `/owner/settings` → Redirected to `/home`

#### Customer attempting Delivery routes:
- Customer → `/delivery/dashboard` → Redirected to `/home`
- Customer → `/delivery/orders` → Redirected to `/home`
- Customer → `/delivery/earnings` → Redirected to `/home`
- Customer → `/delivery/profile` → Redirected to `/home`

#### Owner attempting Customer routes:
- Owner → `/home` → Redirected to `/owner/dashboard`
- Owner → `/restaurants` → Redirected to `/owner/dashboard`
- Owner → `/cart` → Redirected to `/owner/dashboard`
- Owner → `/orders` → Redirected to `/owner/dashboard`
- Owner → `/checkout` → Redirected to `/owner/dashboard`
- Owner → `/reviews` → Redirected to `/owner/dashboard`
- Owner → `/profile` → Redirected to `/owner/dashboard`

#### Owner attempting Delivery routes:
- Owner → `/delivery/dashboard` → Redirected to `/owner/dashboard`
- Owner → `/delivery/orders` → Redirected to `/owner/dashboard`
- Owner → `/delivery/earnings` → Redirected to `/owner/dashboard`

#### Delivery attempting Customer routes:
- Delivery → `/home` → Redirected to `/delivery/dashboard`
- Delivery → `/restaurants` → Redirected to `/delivery/dashboard`
- Delivery → `/cart` → Redirected to `/delivery/dashboard`
- Delivery → `/orders` → Redirected to `/delivery/dashboard`
- Delivery → `/checkout` → Redirected to `/delivery/dashboard`

#### Delivery attempting Owner routes:
- Delivery → `/owner/dashboard` → Redirected to `/delivery/dashboard`
- Delivery → `/owner/menu` → Redirected to `/delivery/dashboard`
- Delivery → `/owner/orders` → Redirected to `/delivery/dashboard`

## Logout Data Clearing

**Location:** `src/app/store/auth/auth.store.ts` - `logout()` function

### Cleared on Logout:

#### Auth Store State:
- ✅ `user` → `null`
- ✅ `token` → `null`
- ✅ `error` → `null`

#### Pinia Stores:
- ✅ Cart Store → `clearCart()`
- ✅ User Store (legacy) → `logout()`
- ✅ Menu Store → `$reset()`

#### localStorage Items:
- ✅ `user` - Auth user data
- ✅ `token` - Auth token
- ✅ `theme` - UI theme preference
- ✅ `preferredLanguage` - Language preference
- ✅ `darkMode` - Dark mode setting
- ✅ `deliverySettings` - Role-specific settings

#### API Headers:
- ✅ Axios Authorization header → Removed

#### Navigation:
- ✅ Redirects to `/login`

## Security Validation

### Route Guard Checks:
1. ✅ **Public Page Protection:** Authenticated users redirected away from login/register
2. ✅ **Authentication Check:** Unauthenticated users blocked from protected routes
3. ✅ **Role Validation:** Exact role match required for role-protected routes
4. ✅ **Cross-Role Blocking:** URL manipulation attempts redirected to user's dashboard
5. ✅ **Fallback Safety:** Multiple validation layers prevent bypass

### Logout Security:
1. ✅ **Complete State Clear:** All auth state cleared
2. ✅ **Store Reset:** All Pinia stores cleared/reset
3. ✅ **Storage Cleanup:** All localStorage items removed
4. ✅ **API Header Reset:** Authorization headers removed
5. ✅ **Navigation Reset:** Redirected to login

## Implementation Details

### Guard Execution Order:
1. Initialize auth store
2. Check if authenticated user accessing public page → Redirect
3. Check if route requires auth → Block if not authenticated
4. Check if route requires specific role → Block if role mismatch
5. Allow navigation if all checks pass

### Role Validation:
- Uses centralized `hasRequiredRole()` function
- Validates role is in allowed set (`VALID_ROLES`)
- Requires exact match (no partial matches)
- Falls back to customer home for invalid roles

### Redirect Behavior:
- Unauthenticated → `/login`
- Wrong role → User's role dashboard
- Invalid role → Customer home (`/home`)

## Confirmation

✅ **All 22 protected routes have role guards**  
✅ **Cross-role access is blocked via URL manipulation**  
✅ **Role checking logic is centralized**  
✅ **Logout clears all auth, role, and cached data**  
✅ **No routes are missing protection**  
✅ **Guard implementation is strict and comprehensive**

## Security Notes

⚠️ **Important:** Frontend route guards provide UX protection only. Backend APIs must enforce authorization for all protected data and actions. Never trust client-side state for security decisions.
