# Kechow — Super Admin Command Center (Manual de uso)

**Version:** v2 Analysis  
**Date:** February 2026  
**Audience:** Super Admin (dueño de la aplicación), no el propietario del restaurante (Business Owner).

---

## 1. Rol: Super Admin vs Propietario

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **Super Admin** | Dueño de la plataforma Kechow. Gestiona toda la app, finanzas globales, soporte y despacho. | Centro de control en `/admin/*`. |
| **Propietario (owner)** | Dueño de un restaurante. Gestiona su local, menú, pedidos y analíticas. | Panel en `/owner/*`. |

Solo usuarios con `role: admin` en la base de datos pueden acceder al Centro de control. El registro público no permite crear cuentas admin; se crean manualmente o por seed.

---

## 2. Cómo acceder al Centro de control

1. Iniciar sesión con una cuenta que tenga rol **admin**.
2. Serás redirigido a **Centro de control** (`/admin/dashboard`).
3. La barra de navegación muestra: Centro de control, Estado de conexión, Libro de finanzas, Soporte e incidencias, Mapa de despacho.

---

## 3. Secciones del Centro de control

### 3.1 Centro de control (Dashboard)

- **Resumen de la plataforma:** Ingresos totales del período (hoy), número de entregas activas, estado del sistema (Correcto / Degradado).
- **Estado de conexión:** Indicadores de API y WebSocket (ver siguiente sección).
- Los datos provienen de `GET /api/v1/admin/stats` (protegido con `role:admin`).

### 3.2 Estado de conexión

- **API:** Comprobación periódica de conectividad con el backend (verde = OK, rojo = error).
- **WebSocket:** Estado de Reverb/Pusher. Si no está configurado, se muestra “Configurar Reverb/Pusher”.
- **TODO:** Añadir API Key / URL de Reverb o Pusher en el frontend para que el indicador WebSocket refleje el estado real.

### 3.3 Libro de finanzas

- **Repartidores:** Saldo pendiente y pagado (agregado de entregas completadas).
- **Propietarios:** Saldo pendiente y pagado (agregado de pedidos entregados).
- Datos desde `GET /api/v1/admin/ledger`. La lógica de “pendiente” puede expandirse cuando exista un flujo de pagos.

### 3.4 Soporte e incidencias

- **Últimas excepciones del sistema:** Tabla con fecha, mensaje y origen (últimas 50). Se rellenan cuando el backend expone `GET /api/v1/admin/exceptions` (por ejemplo con Spatie Activity Log o un buffer de Sentry).
- **Tickets de soporte:** Placeholder para tickets enviados por usuarios cuando exista el flujo y el endpoint (p. ej. `GET /admin/tickets`).

### 3.5 Mapa de despacho

- Vista para seguir en tiempo real las entregas “En tránsito”.
- **Placeholder:** El mapa no se muestra hasta configurar una API de mapas (Google Maps o Mapbox).
- **TODO:** Añadir API Key en `.env` (p. ej. `VITE_GOOGLE_MAPS_API_KEY`) y conectar con `GET /api/v1/admin/deliveries/in-transit` para mostrar repartidores activos.

---

## 4. Rutas de la API Admin (backend)

Todas están bajo `auth:sanctum` y `role:admin`:

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/admin/stats` | Ingresos plataforma, entregas activas, estado del sistema. |
| GET | `/api/v1/admin/ledger` | Libro de finanzas (repartidores y propietarios). |
| GET | `/api/v1/admin/exceptions` | Últimas excepciones (lista vacía hasta integrar Activity Log/Sentry). |
| GET | `/api/v1/admin/deliveries/in-transit` | Entregas en tránsito para el mapa de despacho. |

---

## 5. Resumen

- **Super Admin** usa el Centro de control (`/admin/*`) para ver la plataforma, conexión, finanzas, excepciones y despacho.
- **Propietario** usa el panel de restaurante (`/owner/*`) para pedidos, menú y analíticas de su negocio.
- Las cadenas de la interfaz se mantienen en español; los TODOs para API keys (mapas, Pusher/Reverb, Sentry) están indicados en el código y en DEPENDENCY_SETUP.md.
