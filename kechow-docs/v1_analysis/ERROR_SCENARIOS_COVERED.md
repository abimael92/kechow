# Error Scenarios Covered

Resilience features: global error boundaries, network failure UI, retry mechanisms, empty states, and disabled unsafe actions when offline.

## Global error boundaries

- **Component:** `@/shared/ui/ErrorBoundary.vue` — catches render-time errors from child components via `onErrorCaptured`, shows a fallback card with "Try again" (clears error) and "Reload page".
- **App:** `App.vue` wraps `<router-view />` in `<ErrorBoundary>` so any uncaught component error in the tree shows the fallback instead of a blank screen.
- **Global handler:** `main.ts` sets `app.config.errorHandler` to log async/unhandled errors (ErrorBoundary does not catch those; they are logged for debugging).

## Network failure UI

- **Composable:** `@/shared/composables/useOnline.ts` — reactive `isOnline` from `navigator.onLine` and `online` / `offline` events.
- **Banner:** `@/shared/ui/NetworkBanner.vue` — sticky top banner when offline: "You're offline. Some actions are unavailable." Shown globally in `App.vue` above the main content.

## Retry mechanisms

- **Composable:** `@/shared/composables/useRetry.ts` — wraps an async function, exposes `execute`, `retry`, `error`, `loading`, `clearError`, `canRetry`. Optional `maxRetries`.
- **Usage:** Customer Orders panel uses local `loadError` state and `refreshOrders()` as retry. On load failure, an empty state with "Could not load orders" and a "Retry" button is shown; retry calls `refreshOrders` again. Retry button is disabled when offline.

## Empty states

- **Component:** `@/shared/ui/EmptyState.vue` — props: `title`, optional `description`, optional `icon`. Slot `#action` for primary button/link.
- **Usage:**
  - Customer Orders panel: empty orders list (title + description + "Browse restaurants"); empty favorites (title + description + "Browse restaurants"); error state (title + description + "Retry").
  - Can be reused elsewhere (e.g. delivery OrdersPanel, owner panels) for consistent empty and error UX.

## Disabled unsafe actions offline

- **Rule:** Actions that require the network are disabled when `!isOnline`, with clear feedback (title/aria-label or button text).
- **Where:**
  - **Checkout — Place order:** Button disabled when offline; label shows "Offline" when `!isOnline`. `canPlaceOrder` includes `isOnline`.
  - **Customer Orders panel — Refresh:** Refresh button disabled when offline; title/aria-label shows "Offline" when `!isOnline`.
  - **Owner Orders panel — Refresh:** Refresh button disabled when offline; aria-label shows "Offline" when `!isOnline`.
- **Composable:** `useOnline()` is used in CheckoutPage, customer OrdersPanel, and owner OrdersPanel; NetworkBanner uses it for the global banner.

## Summary table

| Scenario              | Coverage                                                                 |
|-----------------------|--------------------------------------------------------------------------|
| Component crash       | ErrorBoundary catches and shows fallback; "Try again" / "Reload page".  |
| Offline               | NetworkBanner + disabled Place order / Refresh; useOnline() where needed.|
| Load failure (orders) | Customer Orders: error state + Retry button calling refreshOrders.       |
| Empty data            | EmptyState for no orders, no favorites; reusable for other panels.      |
| Async errors          | Logged via app.config.errorHandler; UI can show toasts (existing).       |

## Locale keys added

- `offline` — "Offline" / "Sin conexión"
- `retry` — "Retry" / "Reintentar"
- `errorLoadingOrders` — "Could not load orders" / "No se pudieron cargar los pedidos"
- `errorLoadingOrdersDescription` — "Check your connection and try again." / "Revisa tu conexión e intenta de nuevo."
