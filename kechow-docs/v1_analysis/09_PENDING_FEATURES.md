# Phase 9 — Pending Features and Improvements

**Project:** Kechow  
**Purpose:** Structured backlog of missing features, performance and security improvements, UX and scalability. All estimates are relative (S/M/L) and priorities are suggested.

---

## 1. Missing Features

| ID | Feature | Description | Complexity | Priority | Dependencies |
|----|---------|-------------|------------|----------|--------------|
| F1 | Real-time order updates (broadcasting) | WebSocket or Pusher for new orders to driver, status updates to customer/owner | L | High | Backend broadcasting config; frontend Echo; delivery store subscribe |
| F2 | Push notifications (mobile) | FCM/APNs for order status, new delivery job | M | High | Device token storage; backend send job; mobile app |
| F3 | In-app chat or support | Customer–driver or customer–restaurant messaging | L | Medium | New messages table; real-time or polling; UI |
| F4 | Promotions and discounts | Coupons, % or fixed discount per order | M | Medium | Backend rules; cart/checkout apply; owner UI |
| F5 | Reviews and ratings | Customer rates order/restaurant; driver rating | M | Medium | Schema; API; customer and owner UI |
| F6 | Scheduled orders | Order for future date/time | M | Medium | Order schema; checkout slot selection; kitchen flow |
| F7 | Multi-address and map | Customer selects address on map; driver navigation link | M | Medium | Geo fields; map widget; deep link to maps app |
| F8 | Earnings payout history (real) | Replace mock payouts with real payout records and status | S | High | Backend payout table or integration; delivery earnings API |
| F9 | Order detail for delivery (full) | Backend GET delivery/orders/:id; frontend detail page with full order and status | S | High | Delivery module (Phase 2) |
| F10 | Reject order (full flow) | Backend persist reject; frontend remove from list and optional reason | S | High | Delivery module (Phase 2) |
| F11 | Owner dashboard/analytics (from routes_owner) | Register routes_owner; dashboard and analytics endpoints | M | Medium | Owner module |
| F12 | Sitemap and robots (dynamic) | Generate sitemap.xml and robots.txt from backend or build | S | High | SEO (Phase 6) |

---

## 2. Performance Improvements

| ID | Item | Description | Complexity | Priority |
|----|------|-------------|------------|----------|
| P1 | DB indexes | Add missing indexes on orders, deliveries, drivers (see 05_DATABASE_FINAL_DESIGN) | S | High |
| P2 | Pagination | All list endpoints (orders, completed deliveries, earnings history) paginated | S | High |
| P3 | Eager loading audit | Ensure all list APIs use with() to avoid N+1 | S | High |
| P4 | Frontend lazy loading | Lazy load all role-specific and heavy routes | S | Medium |
| P5 | Image optimization | Resize/compress uploads; CDN or optimized URLs for logos and menu images | M | Medium |
| P6 | Caching | Cache restaurant list or menu for short TTL where appropriate | M | Low |
| P7 | Core Web Vitals | LCP, FID/INP, CLS optimization (see SEO doc) | M | High |

---

## 3. Security Enhancements

| ID | Item | Description | Complexity | Priority |
|----|------|-------------|------------|----------|
| S1 | Delivery role middleware | Restrict api/delivery/* to role delivery | S | High |
| S2 | Order/delivery policy | Only assigned driver can update delivery status | S | High |
| S3 | Validate delivery status | Form Request whitelist for status values | S | High |
| S4 | Rate limiting | Throttle api and auth routes | S | High |
| S5 | CORS from config | Remove hardcoded origin; use config/cors.php | S | High |
| S6 | Audit logging | Log sensitive actions (order accept, status change, owner CRUD) | M | Medium |
| S7 | Input sanitization | Ensure all user input validated and escaped | S | High |

---

## 4. UX Improvements

| ID | Item | Description | Complexity | Priority |
|----|------|-------------|------------|----------|
| U1 | Loading states | Skeleton or spinner on all delivery panels and lists | S | High |
| U2 | Empty states | Clear copy when no orders, no earnings, no jobs | S | High |
| U3 | Error states | Retry or message when API fails; no white screen | S | High |
| U4 | i18n for delivery | All delivery UI strings in locale files (Spanish) | S | High |
| U5 | Order detail modal vs page | Consistent pattern: modal from list or dedicated page | S | Medium |
| U6 | Offline indication | Show offline banner and disable actions when no network | M | Low |
| U7 | Accessibility | ARIA, focus, keyboard nav for critical flows | M | Medium |

---

## 5. Scalability Upgrades

| ID | Item | Description | Complexity | Priority |
|----|------|-------------|------------|----------|
| X1 | API versioning | All routes under /api/v1 | S | High |
| X2 | Central API response format | Envelope (data, message, errors) for all endpoints | M | Medium |
| X3 | Queue for heavy tasks | Order confirmation email, push notification, reports via queue | M | Medium |
| X4 | Multi-city / multi-region | Support more cities; filter by city or region | L | Low |
| X5 | Multi-language (full) | Complete i18n for customer and owner; delivery already Spanish | M | Low |
| X6 | Feature flags | Toggle features by env or DB for gradual rollout | M | Low |

---

## 6. Priority Summary

- **P0 / Critical:** F8, F9, F10, F12, P1, P2, P3, P7, S1–S5, S7, U1–U4, X1.
- **P1 / High:** F1, F2, F11, P4, P5, S6, U5, X2, X3.
- **P2 / Medium:** F3–F7, P6, U6, U7, X4–X6.

Dependencies: Delivery module completion (Phase 2) unblocks F9, F10, F8 (earnings). SEO (Phase 6) and F12 go together. Security items S1–S5 and S7 should be done before production launch.
