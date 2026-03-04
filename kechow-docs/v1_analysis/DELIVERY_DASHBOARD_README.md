# Kechow Delivery Driver Dashboard

Tablero de repartidor para la app de delivery Kechow.

## Stack

- **Frontend:** Vue 3 + Pinia + TypeScript
- **Backend:** Laravel (API REST)
- **Colores:** Azul (#3B82F6), Verde (#10B981), Ámbar (#F59E0B), Rojo (#EF4444)

## Archivos principales

### Frontend

| Archivo | Descripción |
|---------|-------------|
| `driver.service.ts` | API: available-orders, current-order, accept, start, complete, location, stats |
| `useDriverStore.ts` | Pinia store con estado y acciones del repartidor |
| `DriverDashboard.vue` | Dashboard principal con toggle online/offline |
| `AvailableOrders.vue` | Lista de pedidos listos para aceptar |
| `CurrentDelivery.vue` | Pedido activo con Maps, llamada, completar |
| `DriverStats.vue` | Ganancias y métricas del día/semana/mes |
| `useDriverLocation.ts` | Actualización GPS cada 30s con pedido activo |

### Backend

| Archivo | Descripción |
|---------|-------------|
| `database/migrations/2026_02_04_100001_create_drivers_table.php` | Tabla drivers |
| `database/migrations/2026_02_04_100002_create_driver_locations_table.php` | Tabla driver_locations |
| `app/Modules/Driver/Models/Driver.php` | Modelo Driver |
| `app/Modules/Driver/Controllers/DriverController.php` | Controlador API |

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/driver/available-orders` | Pedidos con status=ready |
| GET | `/api/driver/current-order` | Pedido activo del repartidor |
| GET | `/api/driver/stats` | Ganancias, entregas, calificación |
| PUT | `/api/driver/location` | Actualizar GPS (lat, lng) |
| PATCH | `/api/driver/status` | Toggle online/offline |
| POST | `/api/orders/{id}/accept` | Aceptar pedido |
| POST | `/api/orders/{id}/start-delivery` | Iniciar entrega |
| POST | `/api/orders/{id}/complete-delivery` | Marcar como entregado |

## Migración

```bash
cd kechow-server
php artisan migrate
php artisan db:seed --class=DriverSeeder
```

## Flujo

1. Repartidor activa disponibilidad (toggle online)
2. Ve pedidos disponibles (status=ready, sin driver)
3. Acepta pedido → se asigna como driver, status=out_for_delivery
4. Inicia entrega (opcional, mismo status)
5. Abre Maps para navegar a la dirección
6. Marca como entregado → status=delivered

## Ubicación GPS

- Se envía cada 30 segundos cuando hay pedido activo
- Usa `navigator.geolocation.getCurrentPosition`
- Falla silenciosa si GPS deshabilitado

## WebSocket

Pendiente de implementación (Laravel Echo, Pusher, etc.) para:
- `order.assigned` - Nuevo pedido asignado
- `order.updated` - Cambio de estado
- `driver.location.update` - Posición en tiempo real
