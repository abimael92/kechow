# Direcciones guardadas (Saved Addresses)

## Backend

### Migración

Ejecuta la migración para crear la tabla `user_addresses`:

```bash
cd kechow-server
php artisan migrate
```

### Endpoints (API)

- `GET /api/customer/profile` — Perfil con direcciones
- `PUT /api/customer/profile` — Actualizar nombre, email, teléfono
- `GET /api/customer/addresses` — Listar direcciones
- `POST /api/customer/addresses` — Crear dirección
- `PUT /api/customer/addresses/{id}` — Actualizar dirección
- `DELETE /api/customer/addresses/{id}` — Eliminar dirección
- `PATCH /api/customer/addresses/{id}/default` — Marcar como predeterminada

Todos requieren `Authorization: Bearer <token>` (auth:sanctum).

## Frontend

### Google Places (opcional)

Para autocompletado de direcciones en el formulario, configura en `kechow-client/.env`:

```env
VITE_GOOGLE_PLACES_API_KEY=tu_api_key_aqui
```

Obtén una API key en [Google Cloud Console](https://console.cloud.google.com/) (APIs & Services → Credentials). Habilita **Places API** (y Maps JavaScript API si se indica). El tier gratuito incluye crédito mensual.

Si no configuras la clave, el formulario sigue funcionando; solo no se mostrará el campo "Buscar dirección" con autocompletado.

### Dónde se usa

- **Perfil** (`/profile`): sección "Direcciones" con lista, agregar, editar, eliminar y marcar predeterminada.
- **Checkout** (`/checkout`): selección de dirección de entrega (usa las mismas direcciones del perfil).

### Componentes

- `AddressForm.vue` — Formulario con validación y opcional Google Places.
- `AddressList.vue` — Lista de direcciones con acciones (editar, eliminar, predeterminada).
- `useGooglePlaces.ts` — Composable para cargar el script y enlazar autocompletado.

Todo el texto de la funcionalidad está en español (sin i18n).
