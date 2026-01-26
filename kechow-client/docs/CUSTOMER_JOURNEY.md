# Customer Journey Documentation

## Overview
Complete end-to-end customer journey implementation with API abstraction and mock fallbacks. All customer-facing features are implemented with Spanish content only.

## Screens Implemented

### 1. Restaurant List & Search
**Route:** `/restaurants`  
**Component:** `RestaurantListPage.vue`  
**Features:**
- Restaurant grid/list view
- Search functionality
- Category filters
- Sort options (name, rating, delivery time)
- Price range filters
- Mobile-responsive design

**Service:** `getRestaurants(filters?)` - Uses API with mock fallback

### 2. Menu View & Cart
**Route:** `/restaurants/:id`  
**Component:** `RestaurantDetailView.vue`  
**Features:**
- Restaurant menu display
- Add items to cart
- Cart quantity management
- Cart store integration

**Route:** `/cart`  
**Component:** `CartPage.vue` → `CartView.vue`  
**Features:**
- View cart items
- Update quantities
- Remove items
- Navigate to checkout

**Service:** Cart managed via `useCartStore` (Pinia)

### 3. Checkout (State-Only, No Payments)
**Route:** `/checkout`  
**Component:** `CheckoutPage.vue`  
**Features:**
- Address selection/management
- Special instructions input
- Payment method selection (state-only, no actual payment processing)
- Order summary
- Order creation via service

**Service:** 
- `getCustomerProfile()` - Load addresses
- `addAddress()` - Add new address
- `createOrder()` - Create order (state-only)

### 4. Order Tracking
**Route:** `/orders/:id/track`  
**Component:** `OrderTrackingPage.vue`  
**Features:**
- Real-time order status timeline
- Order details display
- Delivery information
- Payment information
- Auto-refresh every 10 seconds for active orders
- Navigation to reviews after delivery

**Service:**
- `getOrder(orderId)` - Get order details
- `trackOrder(orderId)` - Track order status

### 5. Order History
**Route:** `/orders`  
**Component:** `OrdersPage.vue` → `OrdersPanel.vue`  
**Features:**
- List all customer orders
- Filter by status
- Search orders
- Pagination
- Order status badges
- Quick actions (track, reorder)

**Service:** `getCustomerOrders()` - Fetch all customer orders

### 6. Reviews
**Route:** `/reviews`  
**Component:** `ReviewsPage.vue`  
**Features:**
- View all restaurant reviews
- Create new review
- Star rating system
- Review comments
- Helpful votes
- Restaurant selection

**Service:**
- `getRestaurantReviews(restaurantId)` - Get reviews
- `createReview(reviewData)` - Create review
- `getRestaurants()` - Get restaurant list

### 7. Profile & Addresses
**Route:** `/profile`  
**Component:** `ProfilePage.vue`  
**Features:**
- View/edit profile information
- Manage addresses (add, edit, delete)
- Set default address
- Profile update

**Service:**
- `getCustomerProfile()` - Get profile
- `updateCustomerProfile()` - Update profile
- `addAddress()` - Add address
- `updateAddress()` - Update address
- `deleteAddress()` - Delete address

## Order Flow Validation

### Complete Flow:
1. **Browse Restaurants** (`/restaurants`)
   - ✅ Search and filter restaurants
   - ✅ View restaurant details

2. **View Menu** (`/restaurants/:id`)
   - ✅ Browse menu items
   - ✅ Add items to cart

3. **Cart** (`/cart`)
   - ✅ Review cart items
   - ✅ Update quantities
   - ✅ Navigate to checkout

4. **Checkout** (`/checkout`)
   - ✅ Select delivery address
   - ✅ Add special instructions
   - ✅ Select payment method (state-only)
   - ✅ Review order summary
   - ✅ Create order

5. **Order Tracking** (`/orders/:id/track`)
   - ✅ View order status timeline
   - ✅ Real-time status updates
   - ✅ Order details
   - ✅ Delivery information

6. **Order History** (`/orders`)
   - ✅ View all orders
   - ✅ Filter and search
   - ✅ Track orders
   - ✅ Reorder functionality

7. **Reviews** (`/reviews`)
   - ✅ View reviews
   - ✅ Create reviews
   - ✅ Rate restaurants

8. **Profile** (`/profile`)
   - ✅ Manage profile
   - ✅ Manage addresses

## API Abstraction

All API calls go through `customer.service.ts` with:
- **API Integration:** Uses `@app/lib/axios` for HTTP requests
- **Mock Fallbacks:** Automatically falls back to mock data on:
  - Development mode
  - API errors
  - Network failures
- **Error Handling:** Graceful degradation with user notifications

## Service Layer Structure

```
src/features/customer/services/
├── customer.service.ts  # Main service with all API methods
└── (exported via services.ts)
```

### Service Methods:
- `getRestaurants(filters?)` - Get restaurants with filters
- `getRestaurant(id)` - Get restaurant details
- `getRestaurantMenu(restaurantId)` - Get menu items
- `getCustomerOrders()` - Get all orders
- `getOrder(orderId)` - Get order details
- `createOrder(orderData)` - Create new order
- `trackOrder(orderId)` - Track order status
- `getRestaurantReviews(restaurantId)` - Get reviews
- `createReview(reviewData)` - Create review
- `getCustomerProfile()` - Get profile
- `updateCustomerProfile(profile)` - Update profile
- `addAddress(address)` - Add address
- `updateAddress(addressId, address)` - Update address
- `deleteAddress(addressId)` - Delete address

## Mock Data

Mock data is provided in:
- `src/features/customer/data/sampleOrders.ts`
- `src/features/customer/data/sampleReviews.ts`
- `src/shared/data/restaurants.ts`

## Spanish Content

All user-facing text is in Spanish:
- Navigation labels
- Form labels
- Button text
- Error messages
- Status labels
- Placeholders

## Navigation Integration

All customer routes are integrated into `RoleNavigation`:
- Inicio (`/home`)
- Restaurantes (`/restaurants`)
- Mi Carrito (`/cart`)
- Mis Pedidos (`/orders`)
- Reseñas (`/reviews`)
- Perfil (`/profile`)

## Testing the Flow

1. Start at `/restaurants`
2. Select a restaurant → View menu
3. Add items to cart
4. Go to cart → Review items
5. Proceed to checkout
6. Select address and payment method
7. Place order → Redirected to tracking
8. View order status updates
9. After delivery → Leave review
10. Manage profile and addresses

All screens are fully functional with API abstraction and mock fallbacks.
