# Orders Tab (OrdersPanel) – Complete Feature Audit

**Document Purpose:** Master list of all Orders Tab features for comparison with Dashboard and identification of workflow gaps.

---

## 1. Data Display Features

### 1.1 Order Details Shown (per OrderCard)

| Field | Location | Notes |
|-------|----------|-------|
| **Order ID** | Header (#order.id) | Primary identifier |
| **Status** | Badge (new, preparing, ready, out_for_delivery, delivered, declined, cancelled) | Color-coded badge |
| **Type** | Badge | Delivery (bike) vs Pickup (store) |
| **Customer Name** | With user icon | |
| **Created At** | Relative time | "Just now", "5 min ago", "2 hours ago", "3 days ago" |
| **Phone** | Formatted | (123) 456-7890 |
| **Special Instructions** | Yellow alert box | Only if present |
| **Total Amount** | Prominent, with currency | $XX.XX MXN |
| **Payment Status** | Badge | paid, pending, failed, refunded |
| **Payment Method** | Below total | cash, card, online |
| **Order Items** | List with name, qty, price | Show 4 by default, expand to show all |
| **Item Special Requests** | Per item, italic | If present |
| **Item "Ready" indicator** | Green dot | Per item when prepared |
| **Preparation Checklist** | When preparing/ready | Per-item checkboxes (X/Y prepared) |
| **Driver Info** | When ready/out_for_delivery | Name, status, phone, rating, vehicle |
| **Delivery Code** | When present | With copy button |
| **QR Code placeholder** | For pickup verification | Shows order # |
| **Estimated Delivery** | When out_for_delivery | Time + driver rating + vehicle |
| **Estimated Completion** | When order has estimatedTime | With "Update time" button |

### 1.2 Grouping/Filtering

| Feature | How it works |
|---------|--------------|
| **Status tabs** | All, New, Preparing, Ready, Delivered, Cancelled – click to filter |
| **Filter dropdown** | Multi-select by status (Nuevos, En Preparación, Listos, Entregados, Cancelado) |
| **Search** | Searches order ID, customer name, item names (instant filter, no debounce) |
| **Sort** | Newest first, Oldest first, Amount highest – in filter dropdown |
| **Active tab + selected statuses** | Tab and dropdown filters can overlap; both applied |
| **Date range** | ❌ Not implemented |

### 1.3 Statistics at Top

| Stat | Source | Notes |
|------|--------|-------|
| **Pedidos Totales** | orders.length | Total count, highlighted card |
| **Pendiente** | new + preparing count | |
| **Ingresos** | Today's delivered orders revenue | `$X.XX` |
| **Pedido Promedio** | Average of all orders | `$X.XX` |

### 1.4 Visual Indicators

| Indicator | Where | Purpose |
|-----------|-------|---------|
| **Status badge** | Order header | Color by status |
| **Type badge** | Delivery (blue) / Pickup (green) | |
| **Urgent order flash** | Red pulsing icon on order card | When new + >15 min old |
| **Progress bar** | 5 steps (or 4 for pickup) | Placed → Preparing → Ready → On Route → Completed |
| **Status icon** | Large colored icon | Timer, restaurant, checkbox, bike, etc. |
| **Payment status badge** | Paid (green), Pending (yellow), Failed (red) | |
| **Driver status** | "Active" green dot | When driver assigned |
| **Filter count badges** | Per status in filter dropdown | Live counts |

---

## 2. Order Actions

### 2.1 Status Transition Buttons (Backend API)

| Button | When visible | Transition | API |
|--------|--------------|------------|-----|
| **Decline** | status === 'new' | new → cancelled | `PATCH /api/owner/orders/{id}/status` |
| **Accept & Start** | status === 'new' | new → preparing | Same |
| **Mark Ready** | status === 'preparing' | preparing → ready | Same |
| **Out for Delivery** | status === 'ready' && isDelivery | ready → out_for_delivery | Same |
| **Pickup Complete** | status === 'ready' && !isDelivery | ready → delivered | Same |
| **Mark Delivered** | status === 'out_for_delivery' | out_for_delivery → delivered | Same |

All status changes validated with `canTransition()` from order-state-machine before API call.

### 2.2 Utility Buttons (Frontend vs Backend)

| Button | When visible | Action | Backend? |
|--------|--------------|--------|----------|
| **Call** | Always | `window.open('tel:...')` | ❌ No |
| **Message** | Always | `window.open('sms:...')` | ❌ No |
| **Print** | Always | Emits `print-order` | ❌ Not implemented in OrdersPanel |
| **Assign Driver** | When isDelivery | Emits `assign-driver` | ❌ Not implemented in OrdersPanel |
| **Update Time** | When order.estimatedTime | Emits `update-time` | ❌ Not implemented in OrdersPanel |
| **Copy Delivery Code** | When order.deliveryCode | `navigator.clipboard.writeText()` | ❌ No |

### 2.3 Preparation Checklist (Frontend-Only)

| Action | When | Handler in OrdersPanel |
|--------|------|------------------------|
| **Toggle item prepared** | preparing/ready | ❌ Not implemented |
| **Check all / Uncheck all** | preparing/ready | ❌ Not implemented |

OrderCard emits `toggle-item-prepared` and `toggle-all-items`, but OrdersPanel does not listen. Data would need backend persistence for item-level preparation state.

### 2.4 Summary: Implemented vs Unimplemented

| Action | Implemented | Notes |
|--------|-------------|-------|
| Status transitions | ✅ | Full flow, API-backed |
| Call customer | ✅ | External link |
| Message customer | ✅ | External link |
| Copy delivery code | ✅ | Clipboard |
| Print order | ❌ | Emit only, no handler |
| Assign driver | ❌ | Emit only, no handler |
| Update time | ❌ | Emit only, no handler |
| Toggle item prepared | ❌ | Emit only, no handler |
| Check all items | ❌ | Emit only, no handler |

---

## 3. Filtering / Search Capabilities

| Feature | Exists | Details |
|---------|--------|---------|
| **Search field** | ✅ | Placeholder: "Buscar comida, restaurantes, categorías…" (generic) |
| **Search targets** | ✅ | order.id, order.customerName, item.name |
| **Clear search** | ✅ | X button when query present |
| **Status tabs** | ✅ | 6 tabs with counts |
| **Filter dropdown** | ✅ | Multi-select status + sort |
| **Reset filters** | ✅ | "Restablecer filtros" |
| **Apply filters** | ✅ | Applies + closes dropdown |
| **Date range** | ❌ | None |
| **Sort options** | ✅ | Newest, Oldest, Amount |
| **Refresh** | ✅ | Manual, disabled when offline |
| **Auto-refresh** | ❌ | None |
| **Debounced search** | ❌ | Filters on every keystroke |

---

## 4. UI/UX Components

### 4.1 Modals / Dialogs

| Trigger | Exists | Notes |
|---------|--------|-------|
| Confirmation before status change | ❌ | Direct action |
| Assign driver modal | ❌ | Button emits, no UI |
| Update time modal | ❌ | Button emits, no UI |
| Print preview | ❌ | Not implemented |

### 4.2 Popups / Overlays

| Component | Purpose |
|-----------|---------|
| **Filter dropdown** | Status + sort; click-outside to close |
| **Dropdown overlay** | Full-screen when filter open; click closes |

### 4.3 Loading States

| State | UI |
|-------|-----|
| **Initial load** | Skeleton cards (3 placeholders) |
| **Refresh** | Spinning icon + "Actualizando..." |
| **No loading overlay** | Per-card loading not used |

### 4.4 Error Handling

| Scenario | Current behavior |
|----------|------------------|
| API failure | `console.error` only; no toast/alert |
| Invalid transition | `console.error`; no user feedback |
| Offline | Refresh button disabled; no banner |

### 4.5 Empty States

| Condition | Message | CTA |
|-----------|---------|-----|
| No orders | "No hay pedidos aún" | "Ordenar Ahora" (no @click) |
| No search results | "No se encontraron resultados" | "Intenta con un término..." (no CTA) |

---

## 5. Integration Points

### 5.1 Backend API Endpoints

| Endpoint | Method | Used for |
|----------|--------|----------|
| `/api/owner/orders` | GET | fetchOrders (list) |
| `/api/owner/orders/{order}/status` | PATCH | updateOrderStatus |

### 5.2 WebSocket / Realtime

| Feature | Exists |
|---------|--------|
| WebSocket | ❌ |
| Polling | ❌ |
| Push notifications | ❌ |

### 5.3 Navigation

| Link | Target |
|------|--------|
| None from OrdersPanel | — |
| "Ver todos" (Dashboard) | `/owner/orders` |

### 5.4 External Links

| Action | URL / Behavior |
|--------|----------------|
| Call customer | `tel:{phone}` |
| Message customer | `sms:{phone}` |
| Call driver | `tel:{driver.phone}` |
| Message driver | `sms:{driver.phone}` |
| Maps | `openMap()` exists in OrderCard but not wired to any button |

---

## 6. Mobile vs Desktop

### 6.1 Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| **< 480px** | Smaller header, stats 1-col, reduced font |
| **< 768px** | Header controls stack; filter dropdown centered modal; status tabs horizontal scroll |
| **≥ 768px** | Stats 2-col |
| **≥ 1024px** | Stats 4-col; OrderCard layout flex-row |

### 6.2 Hidden / Visible by Breakpoint

| Element | Mobile | Desktop |
|---------|--------|---------|
| "Accept and Start" full text | "Aceptar" only | "Aceptar y empezar" |
| Order total block | Full width | Fixed min-width right |
| Delivery info | Stacked | Side-by-side |
| Action buttons | Wrap, full-width on xs | Inline |

### 6.3 Touch

| Feature | Notes |
|---------|-------|
| Min touch target | 44px on buttons (OrderCard) |
| Filter dropdown | Full-screen overlay on mobile |
| Status tabs | Horizontal scroll, hide scrollbar |

---

## 7. Performance Features

| Feature | Exists | Details |
|---------|--------|---------|
| **Pagination** | ✅ | 10 per page; Prev/Next |
| **Infinite scroll** | ❌ | Pagination only |
| **Caching** | ❌ | Refetch on load and after status update |
| **Lazy loading** | ❌ | All orders fetched at once |
| **Debounced search** | ❌ | Filters on every input |
| **Virtual list** | ❌ | Renders full page of cards |
| **Print styles** | ✅ | Hides controls, stats, pagination when printing |

---

## 8. Orders Tab vs Dashboard – Feature Matrix

### 8.1 What Orders Tab HAS That Dashboard LACKS

| Category | Feature | Impact |
|----------|---------|--------|
| **Actions** | Accept / Decline order | Critical – Dashboard cannot accept orders |
| **Actions** | Mark Ready | Critical |
| **Actions** | Out for Delivery / Pickup Complete | Critical |
| **Actions** | Mark Delivered | Critical |
| **Actions** | Call / Message customer | High |
| **Actions** | Copy delivery code | Medium |
| **Data** | Full order details (items, payment, driver, etc.) | Critical |
| **Data** | Progress bar | Medium |
| **Data** | Preparation checklist | Medium |
| **Data** | Driver info, delivery code, ETA | High for delivery |
| **Filtering** | Search (ID, customer, items) | High |
| **Filtering** | Status tabs + filter dropdown | High |
| **Filtering** | Sort (newest, oldest, amount) | Medium |
| **Filtering** | Pagination | Medium |
| **Stats** | Pending count, today revenue, avg order | Different granularity |
| **UI** | Empty state, loading skeleton | Medium |
| **UI** | Refresh button | Medium |
| **Integration** | Status update API | Critical |

### 8.2 What Dashboard HAS That Orders Tab LACKS

| Category | Feature | Notes |
|----------|---------|-------|
| **Data** | Today's stats from API | getOrderStats – may differ from OrdersPanel client-side stats |
| **Data** | Driver availability | Hardcoded 3 online, 2 offline |
| **Data** | Peak hours alert | Time-based messaging |
| **Navigation** | "Ver todos" to Orders | Direct link |
| **Scope** | Active orders only | new, preparing, ready, out_for_delivery |

### 8.3 Gaps and Opportunities

#### High Priority – Add to Dashboard

1. **Accept / Decline on active orders** – Allow accepting orders without opening Orders tab.
2. **Click-through to order** – Each active order row links to full order in Orders tab (e.g. `/owner/orders?order=123` or expand inline).
3. **Status quick action** – Optional "Mark Ready" or similar for ready orders.

#### Medium Priority – Orders Tab Improvements

1. **Assign Driver** – Implement handler + modal + API.
2. **Print Order** – Implement handler (e.g. window.print on order section).
3. **Update Time** – Implement handler + API if backend supports it.
4. **Toast notifications** – For success/error on status updates.
5. **Offline banner** – When `!isOnline`.
6. **Empty state CTA** – "Ordenar Ahora" should navigate (e.g. home or restaurant list).

#### Lower Priority

1. **Preparation checklist** – Backend support + handler if needed.
2. **Auto-refresh** – Polling every N seconds.
3. **Debounced search** – Reduce re-renders on typing.
4. **Date range filter** – For historical orders.

---

## 9. Summary: "What Can Users DO in Orders Tab That They CAN'T in Dashboard?"

| Action | Orders Tab | Dashboard |
|--------|------------|-----------|
| Accept order | ✅ | ❌ |
| Decline order | ✅ | ❌ |
| Mark Ready | ✅ | ❌ |
| Out for Delivery | ✅ | ❌ |
| Mark Delivered | ✅ | ❌ |
| Pickup Complete | ✅ | ❌ |
| Call customer | ✅ | ❌ |
| Message customer | ✅ | ❌ |
| View full order details | ✅ | ❌ |
| Search orders | ✅ | ❌ |
| Filter by status | ✅ | ❌ |
| Sort orders | ✅ | ❌ |
| View items, payment, driver | ✅ | ❌ |
| Use preparation checklist | ✅ (UI only) | ❌ |
| Copy delivery code | ✅ | ❌ |
| Print (button exists) | ⚠️ Not wired | ❌ |
| Assign driver (button exists) | ⚠️ Not wired | ❌ |

**Bottom line:** The Dashboard is read-only. All order lifecycle actions and detailed management happen only in the Orders Tab. Adding Accept/Decline (and optionally Mark Ready) to the Dashboard would reduce context-switching for owners during busy periods.
