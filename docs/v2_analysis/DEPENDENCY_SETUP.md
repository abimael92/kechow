# Kechow — Dependency Setup & API Keys

**Version:** v2 Analysis  
**Date:** February 2026  
**Purpose:** List every new install, required config, and step-by-step for adding your own API keys. Spanish UI unchanged.

---

## 1. New Installs

### 1.1 Frontend (kechow-client)

| Package | Version | Purpose |
|---------|---------|---------|
| **zod** | ^3.23.0 | Schema validation (forms, API contracts). Already added to package.json. |
| **@tanstack/vue-query** | ^5.60.0 | Caching, loading states, mutations. Install: `npm install @tanstack/vue-query`. |

**Install:**

```bash
cd kechow-client
npm install zod @tanstack/vue-query
```

**Vue Query setup:** In `main.ts` (or app entry), add:

```ts
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(VueQueryPlugin);
// ... rest of app setup
```

### 1.2 Backend (kechow-server)

| Package | Version | Purpose |
|---------|---------|---------|
| **spatie/laravel-activitylog** | ^4.0 | Audit trails (who changed what). Install: `composer require spatie/laravel-activitylog`. |

**Install:**

```bash
cd kechow-server
composer require spatie/laravel-activitylog
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-migrations"
php artisan migrate
```

**Config:** Publish config (optional): `php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-config"`. Then use `activity()->causedBy($user)->performedOn($model)->log('description')` in your code.

---

## 2. API Keys & External Services (TODO: [USER] Add API Key here)

All code that depends on external API keys is commented or gated with a `// TODO: [USER] Add API Key here` tag. Do **not** commit real keys; use `.env` and `.env.example` (with placeholders).

### 2.1 Google Maps (Active Dispatch Map)

- **Where:** Frontend map component for “Mapa de despacho” (in-transit drivers).
- **Key:** Create an API key in Google Cloud Console (Maps JavaScript API, optionally Directions/Geocoding).
- **Setup:**
  1. Add to `kechow-client/.env`: `VITE_GOOGLE_MAPS_API_KEY=your_key_here`
  2. In the map component, use `import.meta.env.VITE_GOOGLE_MAPS_API_KEY` and load the Maps script only when the key is set.
- **Code tag:** `// TODO: [USER] Add API Key here — Google Maps (or Mapbox) API key for Active Dispatch Map` (see `ActiveDispatchMap.vue`).

### 2.2 Pusher / Reverb (WebSocket)

- **Where:** Laravel Echo (real-time order updates, driver location, admin notifications).
- **Backend:** Set in `kechow-server/.env`:
  - Reverb: `REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET`, `REVERB_HOST`, `REVERB_PORT`, `BROADCAST_CONNECTION=reverb`
  - Or Pusher: `PUSHER_APP_ID`, `PUSHER_APP_KEY`, `PUSHER_APP_SECRET`, `PUSHER_APP_CLUSTER`, `BROADCAST_CONNECTION=pusher`
- **Frontend:** Set in `kechow-client/.env`:
  - Reverb: `VITE_REVERB_APP_KEY`, `VITE_REVERB_HOST`, `VITE_REVERB_PORT`
  - Or Pusher: `VITE_PUSHER_APP_KEY`, `VITE_PUSHER_APP_CLUSTER`
- **Code tag:** `// TODO: [USER] Add API Key here — WebSocket (Pusher/Reverb) connection status` (see `ConnectivityMonitor.vue` and Echo setup).

### 2.3 Sentry (Error tracking)

- **Where:** Backend and frontend error reporting.
- **Setup:**
  1. Create a project at sentry.io and get the DSN.
  2. Backend: `composer require sentry/sentry-laravel`; in `.env`: `SENTRY_DSN=your_dsn`
  3. Frontend: `npm install @sentry/vue`; in `.env`: `VITE_SENTRY_DSN=your_dsn`; init in `main.ts` only when `import.meta.env.VITE_SENTRY_DSN` is set.
- **Code tag:** Any Sentry init or capture code should be behind an env check; tag with `// TODO: [USER] Add API Key here — Sentry DSN`.

---

## 3. Step-by-Step: Add Your API Keys

1. **Copy env example**
   - Client: `cp .env.example .env` (if not exists) in `kechow-client`.
   - Server: same in `kechow-server`.

2. **Reverb/Pusher**
   - Run Reverb: `php artisan reverb:start` (or use Soketi/Pusher Cloud).
   - Fill `REVERB_*` or `PUSHER_*` in server `.env` and `VITE_REVERB_*` / `VITE_PUSHER_*` in client `.env`.
   - Restart frontend dev server so Vite picks up env.

3. **Google Maps**
   - Add `VITE_GOOGLE_MAPS_API_KEY` to client `.env`.
   - Uncomment or enable the map component in `ActiveDispatchMap.vue` and load the Maps script with the key.

4. **Sentry**
   - Add `SENTRY_DSN` (server) and `VITE_SENTRY_DSN` (client).
   - Initialize Sentry in app entry only when the DSN is present.

5. **Never commit** `.env` or real keys; keep `.env.example` with placeholder values only.

---

## 4. Summary

| Dependency | Where | Config / Key |
|------------|--------|---------------|
| zod | Client | Already in package.json; no key. |
| @tanstack/vue-query | Client | Install; register VueQueryPlugin in main.ts. |
| spatie/laravel-activitylog | Server | composer require; migrate; use activity()->log(). |
| Google Maps | Client | VITE_GOOGLE_MAPS_API_KEY in .env; TODO in ActiveDispatchMap. |
| Pusher/Reverb | Client + Server | REVERB_* / PUSHER_* and VITE_* in .env; TODO in ConnectivityMonitor/Echo. |
| Sentry | Client + Server | SENTRY_DSN, VITE_SENTRY_DSN; TODO for init. |
