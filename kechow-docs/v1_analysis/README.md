# Kechow — v1 Documentation Index (Current Documents)

**Purpose:** Index of all current (v1) documentation across the repo, plus updates reflecting the v2 analysis.  
**v2 suite:** See `docs/v2_analysis/` for the new analysis and generated docs (CORE_MAP, USER_GUIDE_CLIENT, BUSINESS_OWNER_MANUAL, DRIVER_HANDBOOK, TECHNICAL_AUDIT, SALES_PITCH, SYSTEM_HEALTH_REPORT).

---

## 1. Current Document Locations

### 1.1 kechow-docs/ (project-level)

| Document | Description |
|----------|-------------|
| 01_AUDIT_REPORT.md | Full system audit (post-refactor); resolved issues and architecture. |
| 02_REFACTOR_PLAN.md | Refactoring plan. |
| 03_BACKEND_FINAL_STRUCTURE.md | Backend structure. |
| 04_FRONTEND_FINAL_STRUCTURE.md | Frontend structure. |
| 05_DATABASE_FINAL_DESIGN.md | Database design (tables, indexes, relationships). |
| 06_SEO_STRATEGY_JIMENEZ_CHIHUAHUA.md | SEO strategy for Jiménez. |
| 07_MOBILE_INTEGRATION_PLAN.md | Mobile integration plan. |
| 08_FULL_DOCUMENTATION_INDEX.md | Full documentation index. |
| 09_PENDING_FEATURES.md | Pending features. |
| 10_PRODUCTION_READINESS_REPORT.md | Production readiness and launch blockers. |
| ARCHITECTURE.md | High-level architecture. |
| BACKEND_FRONTEND_INTEGRATION_GUIDE.md | API and frontend integration. |
| BACKEND_OWNER_CRUD_SETUP.md | Owner CRUD setup. |
| CART_SYSTEM_README.md | Cart system. |
| CLIENT_APP_FEATURE_ANALYSIS.md | Client app feature analysis. |
| DELIVERY_DASHBOARD_README.md | Delivery dashboard. |
| ERROR_SCENARIOS_COVERED.md | Error scenarios. |
| KECHOW_PROJECT_OVERVIEW.md | Project overview (user types, screens, tech). |
| ORDER_STATE_MACHINE.md | Order state machine. |
| ORDERS_TAB_AUDIT.md | Orders tab audit. |
| OWNER_* (multiple) | Owner API, schema, policy, seeders, tests, validation. |
| ROUTE_GUARDS.md | Route guards. |
| SECURITY_CHECKLIST.md | Security checklist. |
| UX_ENHANCEMENTS.md | UX enhancements. |
| VALIDATION_OWNER.md | Owner validation. |

### 1.2 kechow-client/docs/ (client-specific)

| Document | Description |
|----------|-------------|
| ARCHITECTURE.md | Client architecture (features, pages, shared, aliases, guards, API). |
| ADDRESSES_FEATURE.md | Addresses feature. |
| CART_TESTING.md | Cart testing. |
| CUSTOMER_JOURNEY.md | Customer journey. |
| DELIVERY_LIFECYCLE.md | Delivery lifecycle (availability, jobs, accept, progress, GPS, earnings). |
| LAYOUTS.md | Layouts (Main, Customer, Owner, Delivery). |
| OWNER_DASHBOARD_FEATURES.md | Owner dashboard features. |
| README.md | Client docs readme. |
| ROUTE_SECURITY_AUDIT.md | Route security audit. |
| UI_TEXT_INVENTORY.md | UI text inventory (i18n, Spanish). |
| translation-usage-report.md | Translation usage report (generated). |

---

## 2. Updates from v2 Analysis (Applied to v1 Understanding)

The v2 analysis (in `docs/v2_analysis/`) does **not** change any code or move files. The following updates should be reflected when maintaining v1 docs:

- **Architecture:** Single delivery API in use is `/api/v1/delivery/*` (DeliveryController). Order module still has driver routes under `/driver/*`; consider them deprecated or secondary until unified (see SYSTEM_HEALTH_REPORT).
- **Database:** No Prisma/Neon; Laravel migrations and Eloquent only. DB can be MySQL, PostgreSQL (e.g. Neon), or SQLite via env.
- **Stack:** Backend Laravel 12 (PHP 8.2+); frontend Vue 3 + Vite 6 + Pinia + Tailwind. No Next.js.
- **Layouts:** OwnerLayout = “owner shell” (no separate “AdminShell” name). RoleNavigation provides nav; no separate “Sidebar” component name (sidebar appears in settings/delivery UI as needed).
- **Scope:** Platform is food delivery (restaurants, menus, orders, drivers). “Landscaping” in scope was noted; no landscaping-specific features in codebase.
- **Health:** SYSTEM_HEALTH_REPORT ranks issues (CRITICAL: token in localStorage, console logging of token, two delivery flows). Use it to prioritize fixes and refactors.
- **New reference docs:** For a single place to understand the system, prefer `docs/v2_analysis/CORE_MAP.md` and `docs/v2_analysis/TECHNICAL_AUDIT.md`; for user/owner/driver guides use USER_GUIDE_CLIENT, BUSINESS_OWNER_MANUAL, DRIVER_HANDBOOK; for business use SALES_PITCH; for prioritized issues use SYSTEM_HEALTH_REPORT.

---

## 3. Quick Reference

- **v2 analysis (new):** `docs/v2_analysis/`  
- **v1 project docs:** `kechow-docs/`  
- **v1 client docs:** `kechow-client/docs/`  
- **This index:** `docs/v1_analysis/README.md`

When updating v1 docs, align with v2 findings (especially delivery flow, auth storage, and API surface) and keep this README in sync with any new or retired documents.
