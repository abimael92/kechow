# Kechow Cart System

Sistema de carrito de compras para la app de delivery Kechow.

## Stack

- **Frontend:** Vue 3 + Pinia + TypeScript
- **Backend:** Laravel (API REST)
- **UI:** Tailwind CSS, modo claro/oscuro

## Archivos Principales

### Frontend

| Archivo | Descripción |
|---------|-------------|
| `kechow-client/src/features/customer/cart/cart.store.ts` | Pinia store con addItem, removeItem, updateQuantity, clearCart, getCartTotal |
| `kechow-client/src/features/customer/cart/cart.service.ts` | Cliente API para `/api/carts` |
| `kechow-client/src/features/customer/cart/CartPanel.vue` | Panel de carrito con items, totales, barra de envío gratis |
| `kechow-client/src/features/customer/cart/CartBadge.vue` | Badge flotante con contador |
| `kechow-client/src/features/customer/cart/CartButton.vue` | Botón "Añadir al carrito" |
| `kechow-client/src/features/customer/cart/CartOverlay.vue` | Overlay responsive (mobile: bottom sheet, desktop: modal) |
| `kechow-client/src/features/customer/cart/useCartPanel.ts` | Composable para abrir/cerrar panel |

### Backend

| Archivo | Descripción |
|---------|-------------|
| `kechow-server/database/migrations/2026_02_04_000001_add_stock_to_menu_items_table.php` | Campo `stock` en menu_items |
| `kechow-server/database/migrations/2026_02_04_000002_create_carts_table.php` | Tabla carts |
| `kechow-server/database/migrations/2026_02_04_000003_create_cart_items_table.php` | Tabla cart_items |
| `kechow-server/app/Modules/Cart/Models/Cart.php` | Modelo Cart |
| `kechow-server/app/Modules/Cart/Models/CartItem.php` | Modelo CartItem |
| `kechow-server/app/Modules/Cart/Controllers/CartController.php` | Controlador API |
| `kechow-server/app/Modules/Cart/routes.php` | Rutas `/api/carts` |

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/carts` | Crear/obtener carrito (`restaurant_id`) |
| GET | `/api/carts/current` | Obtener carrito actual del usuario |
| PUT | `/api/carts/{cart}/items` | Agregar/actualizar item (`menu_item_id`, `quantity`, `notes`) |
| DELETE | `/api/carts/{cart}/items/{cartItem}` | Eliminar item |

## Reglas de Negocio

- **Un carrito por restaurante:** no se mezclan restaurantes
- **Cantidad máxima por artículo:** 20
- **Validación de stock:** contra `menu_item.stock` (null = ilimitado)
- **Expiración:** 30 minutos desde última actualización
- **IVA:** 8%
- **Envío:** $50 MXN si subtotal < $250; gratis si ≥ $250

## Colores

- **Primary:** #FF6B00 (CTAs, estados activos)
- **Secondary:** Escala de grises
- **Accent:** #0EA5E9 (destacados, barra de envío)

## Migración

```bash
cd kechow-server
php artisan migrate
php artisan db:seed --class=CartSeeder  # Opcional
```

## Notas

- El carrito persiste en `localStorage` para offline
- Sincronización entre pestañas vía evento `storage`
- En modo offline se usa solo estado local hasta reconexión
