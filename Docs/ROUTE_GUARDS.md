# Route Guards Documentation

## Overview
All routes are protected by strict role-based access control enforced in `src/app/router/guards.ts`. The guard prevents cross-role access and URL manipulation.

## Guarded Routes by Role

### Public Routes (No Authentication Required)
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

### Customer Routes (Requires: `role: 'customer'`)
All customer routes require authentication and the `customer` role:

1. `/home` - Customer home page
   - Meta: `{ requiresAuth: true, role: 'customer' }`

2. `/restaurants` - Restaurant list
   - Meta: `{ requiresAuth: true, role: 'customer' }`

3. `/restaurants/:id` - Restaurant detail
   - Meta: `{ requiresAuth: true, role: 'customer' }`

4. `/cart` - Shopping cart
   - Meta: `{ requiresAuth: true, role: 'customer' }`

5. `/orders` - Customer orders
   - Meta: `{ requiresAuth: true, role: 'customer' }`

### Owner Routes (Requires: `role: 'owner'`)
All owner routes require authentication and the `owner` role:

1. `/owner/dashboard` - Owner dashboard
   - Meta: `{ requiresAuth: true, role: 'owner' }`

2. `/owner/menu` - Menu management
   - Meta: `{ requiresAuth: true, role: 'owner' }`

3. `/owner/menu-items/edit/:id?` - Edit menu item
   - Meta: `{ requiresAuth: true, role: 'owner' }`

4. `/owner/analytics` - Analytics page
   - Meta: `{ requiresAuth: true, role: 'owner' }`

5. `/owner/orders` - Orders list
   - Meta: `{ requiresAuth: true, role: 'owner' }`

6. `/owner/reviews` - Reviews page
   - Meta: `{ requiresAuth: true, role: 'owner' }`

7. `/owner/settings` - Owner settings
   - Meta: `{ requiresAuth: true, role: 'owner' }`

### Delivery Routes (Requires: `role: 'delivery'`)
All delivery routes require authentication and the `delivery` role:

1. `/delivery/dashboard` - Delivery dashboard
   - Meta: `{ requiresAuth: true, role: 'delivery' }`

2. `/delivery/order/:id` - Order detail
   - Meta: `{ requiresAuth: true, role: 'delivery' }`

3. `/delivery/live/:id` - Live delivery tracking
   - Meta: `{ requiresAuth: true, role: 'delivery' }`

4. `/delivery/profile` - Delivery profile
   - Meta: `{ requiresAuth: true, role: 'delivery' }`

5. `/delivery/earnings` - Earnings page
   - Meta: `{ requiresAuth: true, role: 'delivery' }`

6. `/delivery/orders` - Orders list
   - Meta: `{ requiresAuth: true, role: 'delivery' }`

## Cross-Role Access Prevention

### How It Works
1. **Route Guard**: The `authGuard` in `src/app/router/guards.ts` runs on every route navigation
2. **Role Validation**: If a route requires a role, the user's role must exactly match
3. **Automatic Redirect**: If role doesn't match, user is redirected to their role's dashboard
4. **URL Manipulation Protection**: Direct URL access to other role routes is blocked

### Examples of Blocked Access

#### Customer trying to access Owner routes:
- Customer navigates to `/owner/dashboard` → Redirected to `/home`
- Customer navigates to `/owner/menu` → Redirected to `/home`
- Customer navigates to `/delivery/dashboard` → Redirected to `/home`

#### Owner trying to access Customer/Delivery routes:
- Owner navigates to `/home` → Redirected to `/owner/dashboard`
- Owner navigates to `/cart` → Redirected to `/owner/dashboard`
- Owner navigates to `/delivery/dashboard` → Redirected to `/owner/dashboard`

#### Delivery trying to access Customer/Owner routes:
- Delivery navigates to `/home` → Redirected to `/delivery/dashboard`
- Delivery navigates to `/owner/dashboard` → Redirected to `/delivery/dashboard`
- Delivery navigates to `/cart` → Redirected to `/delivery/dashboard`

## Centralized Role Utilities

Role checking logic is centralized in `src/shared/utils/role.utils.ts`:
- `getDashboardRouteForRole(role)` - Returns dashboard route for a role
- `hasRequiredRole(userRole, requiredRole)` - Checks if user role matches required role
- `requiresAuthentication(meta)` - Checks if route requires auth
- `requiresRole(meta)` - Gets required role from route meta

## Logout Behavior

On logout, the following is cleared:
- Auth store state (user, token, error)
- All Pinia stores (cart, user, menu)
- All localStorage items:
  - `user`
  - `token`
  - `theme`
  - `preferredLanguage`
  - `darkMode`
  - `deliverySettings`
- Axios authorization headers
- Redirect to `/login`

## Security Notes

⚠️ **Important**: Frontend route guards provide UX protection only. Backend APIs must enforce authorization for all protected data and actions. Never trust client-side state for security decisions.
