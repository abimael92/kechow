# v1 → v2 Summary: Changes to Apply to v1 Docs

**Purpose:** When maintaining existing v1 documents (in `kechow-docs/` and `kechow-client/docs/`), apply the following corrections and alignments from the v2 analysis. No code was changed; this is documentation and understanding only.

---

## Architecture and Stack

- **Backend:** Laravel 12, PHP 8.2+. **Frontend:** Vue 3, Vite 6, Pinia, Vue Router, Tailwind. There is **no Next.js** in this repo.
- **Database:** Laravel migrations + Eloquent only. **No Prisma.** **No Neon** in codebase (Neon can be used as PostgreSQL host via Laravel `DB_*` env).
- **Delivery API in use:** All driver-facing flows use **`/api/v1/delivery/*`** (DeliveryController). The Order module’s **`/driver/*`** routes (e.g. orders/available, accept, start-delivery, complete-delivery) are a second path; frontend uses only `/delivery/*`. Document or deprecate `/driver/*` to avoid confusion.

---

## Delivery vs Order Flow

- **DeliveryController:** Drivers see **pending** orders with no `deliveries` row; on accept, a `deliveries` record is created and order status → accepted. Delivery status: assigned → picked_up → in_transit → delivered.
- **Order module driver:** Uses `Order::STATUS_READY` and `orders.driver_id`. Two sources of “available for driver” exist. Prefer one (e.g. deliveries table + DeliveryController) and document the other as legacy or remove.

---

## Naming and UI

- **OwnerLayout** is the owner/admin shell (no separate “AdminShell” component name).
- **Sidebar:** Used in settings/delivery UI where needed; main nav is **RoleNavigation** (top nav by role). No single “Sidebar” component in layout.
- **Spanish-first:** Default locale `es`, fallback `es`; all user-facing guides should state that the UI is in Spanish.

---

## Security and Health (from SYSTEM_HEALTH_REPORT)

- **CRITICAL:** Token and user in localStorage (XSS risk); console.log of token/auth state in several files. Remove or guard logs; consider httpOnly cookies or short-lived tokens for production.
- **CRUCIAL:** Ensure every sensitive route has correct role/ownership middleware and policies; CORS and pagination for list endpoints.
- When updating security or architecture docs, reference `docs/v2_analysis/SYSTEM_HEALTH_REPORT.md` for the full ranked list.

---

## New v2 Documents to Use as Reference

| Need | Use |
|------|-----|
| Architecture and strategy | `docs/v2_analysis/CORE_MAP.md` |
| Customer flow (Spanish UI) | `docs/v2_analysis/USER_GUIDE_CLIENT.md` |
| Owner operations | `docs/v2_analysis/BUSINESS_OWNER_MANUAL.md` |
| Driver workflow and earnings | `docs/v2_analysis/DRIVER_HANDBOOK.md` |
| Tech deep-dive | `docs/v2_analysis/TECHNICAL_AUDIT.md` |
| Business value | `docs/v2_analysis/SALES_PITCH.md` |
| Prioritized issues | `docs/v2_analysis/SYSTEM_HEALTH_REPORT.md` |

---

## Suggested Edits to Existing v1 Docs

- **kechow-docs/ARCHITECTURE.md, 03_BACKEND_FINAL_STRUCTURE.md:** Add note that delivery API is under `/delivery/*`; Order driver routes are alternate/deprecated.
- **kechow-docs/05_DATABASE_FINAL_DESIGN.md:** State that implementation uses Laravel migrations only (no Prisma/Neon in repo).
- **kechow-docs/10_PRODUCTION_READINESS_REPORT.md:** Align with SYSTEM_HEALTH_REPORT (CRITICAL/CRUCIAL items) and reference `docs/v2_analysis/`.
- **kechow-client/docs/ARCHITECTURE.md, DELIVERY_LIFECYCLE.md:** Confirm that delivery uses `/delivery/*` and DeliveryController; mention Order.driver_id vs Delivery.driver_id if relevant.
- **kechow-docs/08_FULL_DOCUMENTATION_INDEX.md:** Add section pointing to `docs/v1_analysis/` and `docs/v2_analysis/` and this summary.

Applying these points keeps v1 docs consistent with the v2 analysis and the current codebase.
