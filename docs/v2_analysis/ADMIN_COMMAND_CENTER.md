# Admin Command Center — Real-Time Maintenance Dashboard Design

**Version:** v2 Analysis  
**Date:** February 2026  
**Context:** Vue app; no AdminShell.tsx. The “admin/owner shell” is **OwnerLayout.vue**; the main dashboard is **DashboardOverview.vue** (owner). This document designs a **Real-Time Maintenance Dashboard** that can extend the current owner area or live under a dedicated admin route.

---

## 1. Current Architecture

| Component | Path | Role |
|-----------|------|------|
| OwnerLayout | `src/shared/layout/OwnerLayout.vue` | Shell: Header + RoleNavigation + main slot; Spanish “Kechow - Propietario”. |
| OwnerDashboard (page) | `src/pages/owner/OwnerDashboardPage.vue` | Wraps the dashboard view. |
| DashboardOverview | `src/features/business-owner/components/DashboardOverview.vue` | Tablero: today stats, active orders (polling), peak hours. |

There is no separate React AdminShell; the owner layout is the logical “command center” for restaurant owners. Admin-only features (full CRUD, system logs, financials) can be added to the same layout with role checks or a separate admin layout.

---

## 2. Design: Real-Time Maintenance Dashboard

The following four blocks are designed to be added as **sections** to the owner dashboard or as a **dedicated “Mantenimiento” / “Centro de control”** view (e.g. `/owner/command-center` or `/owner/maintenance`) for owners and, where noted, admins only.

### 2.1 Connectivity Monitor

**Purpose:** Visual indicator of Socket/API health so staff know if real-time updates and API are working.

**Behavior:**

- **API health:** Periodic GET to a health endpoint (e.g. `/up` or `/api/v1/health`). Green = last check OK, red = failed, yellow = pending or degraded.
- **Socket health:** Use Laravel Echo connection state (e.g. `echo.connector.pusher.connection.state`). Green = connected, red = disconnected/error, yellow = connecting.

**UI (Spanish unchanged):**

- Small status strip or card: “Estado del sistema” with two indicators: “API” and “Tiempo real”. Icons or colored dots; optional “Última comprobación: HH:mm”.
- No new English strings in UI; keep labels in Spanish.

**Implementation:**

- Composable `useConnectivityMonitor()` that returns `{ apiOk, socketOk, lastCheck }`. Poll API every 30–60 s; subscribe to Echo `connected` / `error` / `disconnected`.
- Component: `ConnectivityMonitor.vue` in `features/business-owner/components/` or `shared/ui/`.

---

### 2.2 Revenue Engine

**Purpose:** Live chart of daily/weekly earnings with “Projected vs Actual.”

**Behavior:**

- **Actual:** From existing order stats API (today/week revenue). Use same data as current “Estadísticas de hoy” and extend to weekly.
- **Projected:** Optional. Simple rule (e.g. same revenue as last week, or linear extrapolation from today so far). Backend can add a small “projections” endpoint or compute in frontend.
- Chart: e.g. Chart.js (already in stack) or Vue Chart with two series: “Real” and “Proyectado” (Spanish labels).

**UI:**

- Section “Motor de ingresos” or “Ingresos en tiempo real”. Tabs or buttons: “Hoy” / “Esta semana”. Chart + optional summary cards (total real, total proyectado, diferencia).
- All copy in Spanish.

**Implementation:**

- Reuse existing `getOrderStats()` (or Vue Query). Add optional projection in frontend or new endpoint `GET /owner/stats/projection`.
- Real-time: when Echo receives `order.created` or `order.status.updated` (delivered), invalidate revenue query or push a delta so the chart updates without full refetch.

---

### 2.3 Error Logger

**Purpose:** Admin (or owner) view of the last 50 backend exceptions so support can triage.

**Behavior:**

- Backend: Store last N exceptions (in memory, Redis, or DB). Expose `GET /admin/logs/exceptions?limit=50` (admin-only). Optionally integrate Sentry and show “last N” from Sentry API or a local buffer.
- Frontend: Table or list: timestamp, message, file:line, optional request ID. No sensitive data (no tokens, no full payloads). Spanish column headers: “Fecha”, “Mensaje”, “Origen”.

**UI:**

- Section or page “Registro de errores” (admin-only). Table with pagination or “Cargar más”. Optional filter by date.
- Spanish UI only.

**Implementation:**

- Backend: Custom middleware or Sentry `before_send` that pushes to a circular buffer; or use Spatie Activity Log for “exception” type. New route under `role:admin`.
- Frontend: `useQuery(['admin', 'exceptions'], fetchExceptions)` with Vue Query; optional real-time via Echo channel `admin.exceptions` if backend pushes new exceptions.

---

### 2.4 Active Job Map

**Purpose:** Specialized view for tracking “In-Transit” deliveries in real-time on a map.

**Behavior:**

- **Data:** Backend exposes “active deliveries” with driver location (e.g. from `driver_locations` or `drivers.current_latitude/longitude`). Endpoint e.g. `GET /owner/deliveries/in-transit` or `GET /admin/deliveries/in-transit` (owner sees own restaurants; admin sees all).
- **Map:** Integrate a map (e.g. Google Maps, Mapbox, Leaflet). One marker per in-transit delivery; optional polyline for “path so far.” Optional: Google Maps API for optimized routing (see ROADMAP_2026).
- **Real-time:** Echo channel per restaurant or admin channel; event `delivery.location.updated` (throttled) and `order.status.updated` so the map updates without polling.

**UI:**

- View “Mapa de entregas” or “Entregas en curso”. Map + sidebar list of in-transit orders; click order to focus map. Spanish labels.
- Owners see only their restaurants’ deliveries; admins see all.

**Implementation:**

- Backend: Endpoint for in-transit deliveries with driver location; broadcast `delivery.location.updated` (throttle to every 10–30 s per driver). Authorize private channel `restaurant.{id}.deliveries` or `admin.deliveries`.
- Frontend: Map component (new dependency or Google Maps); `useQuery` for in-transit list; Echo subscription to update markers in real time.

---

## 3. Placement in the App

| Option | Description |
|--------|-------------|
| **A. Same dashboard** | Add the four sections (Connectivity, Revenue chart, Error Logger link, Map link) to the existing `DashboardOverview.vue` for owners; Error Logger and full map for admin only. |
| **B. Dedicated route** | New route e.g. `/owner/command-center` with a single view that hosts the four blocks. Nav: “Centro de control” or “Mantenimiento” in RoleNavigation for owner. |
| **C. Hybrid** | Connectivity + Revenue in DashboardOverview; “Registro de errores” and “Mapa de entregas” as separate pages under `/owner/` (or `/admin/` for errors). |

Recommendation: **B** or **C** to keep the main dashboard simple and group maintenance/observability in one place.

---

## 4. Dependencies and Reuse

- **Charts:** Existing Chart.js + vue-chartjs for Revenue Engine.
- **Real-time:** Laravel Echo + Reverb (or Soketi); existing `OrderCreated` / `OrderStatusUpdated`; add `DeliveryLocationUpdated` and optional `AdminExceptionLogged`.
- **Observability:** Sentry for errors; Spatie Activity Log for audit; Error Logger can consume a local exception buffer or Sentry.
- **Maps:** Not in package.json today; ROADMAP_2026 proposes Google Maps API for routing and can be used here for the Active Job Map.

---

## 5. Summary

| Block | Purpose | Data source | Real-time |
|-------|---------|-------------|-----------|
| Connectivity Monitor | API + Socket status | Health endpoint + Echo state | Echo events |
| Revenue Engine | Daily/weekly earnings, projected vs actual | Order stats API + optional projection | Echo order events |
| Error Logger | Last 50 backend exceptions | Admin API (buffer or Sentry) | Optional Echo |
| Active Job Map | In-transit deliveries on map | In-transit API + driver location | Echo location/status |

All UI copy remains in Spanish; no removal of existing logic—only new components and endpoints.
