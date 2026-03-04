# Phase 6 — Local SEO Strategy (Ciudad Jiménez, Chihuahua, México)

**Objective:** Dominance in local search for "entrega a domicilio", "comida a domicilio", "restaurantes", "Kechow" in Ciudad Jiménez, Chihuahua, México. All SEO-facing content in Spanish.

---

## 1. Target and Audience

- **Primary:** Usuarios en Ciudad Jiménez, Chihuahua, que buscan pedir comida a domicilio o recoger en restaurantes.
- **Secondary:** Restaurantes y repartidores de la zona que quieren unirse a la plataforma.
- **Keywords (Spanish):** comida a domicilio Jiménez, pedidos en línea Jiménez Chihuahua, restaurantes Jiménez, entrega a domicilio Jiménez, Kechow Jiménez.

---

## 2. On-Page SEO

### 2.1 Meta Titles and Descriptions (Spanish)

- **Home / Landing:**  
  - Title: `Kechow – Comida a domicilio en Ciudad Jiménez, Chihuahua`  
  - Description: `Pide comida de tus restaurantes favoritos en Jiménez, Chihuahua. Entrega a domicilio y recogida en local. Pedidos en línea fáciles y seguros.`

- **Restaurantes:**  
  - Title: `Restaurantes en Jiménez | Kechow`  
  - Description: `Descubre restaurantes y pede en línea en Ciudad Jiménez. Menús, precios y entrega a domicilio.`

- **Login / Register:** No index (meta robots noindex) or minimal indexing; title in Spanish.

- **Delivery / Owner / Customer dashboards:** No index (área privada).

### 2.2 HTML Lang and Default Locale

- `index.html`: `<html lang="es">` (primary market Spanish).
- Meta charset UTF-8; viewport; canonical when applicable.

### 2.3 URLs

- **SEO-friendly:** `/restaurantes`, `/restaurantes/:slug`, `/inicio`, `/pedidos`. Avoid `/page?id=1`. Use slugs for restaurants.
- **Canonical:** Emit `<link rel="canonical" href="...">` for listing and detail pages (absolute URL, preferred domain).

---

## 3. Structured Data (JSON-LD)

### 3.1 LocalBusiness (Organization / Brand)

- **Type:** `LocalBusiness` or `Organization`.
- **Name:** Kechow.
- **Description:** Plataforma de pedidos y entrega a domicilio en Ciudad Jiménez, Chihuahua, México.
- **Area served:** Ciudad Jiménez, Chihuahua, México.
- **URL:** URL oficial del sitio.
- **Same As:** Redes sociales si aplica.
- **Geo:** No aplica sede física única; puede omitirse o usar centro de Jiménez para “area served”.

Example (Spanish description):

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Kechow",
  "description": "Plataforma de pedidos y entrega a domicilio en Ciudad Jiménez, Chihuahua, México.",
  "url": "https://tu-dominio.com",
  "areaServed": {
    "@type": "City",
    "name": "Ciudad Jiménez",
    "containedInPlace": {
      "@type": "State",
      "name": "Chihuahua"
    }
  }
}
```

### 3.2 WebSite + SearchAction

- **Type:** `WebSite`.
- **url:** Home URL.
- **potentialAction:** SearchAction (buscar restaurantes) si hay buscador.

### 3.3 Restaurant Pages (por restaurante)

- **Type:** `Restaurant`.
- **name,** **description,** **address** (Ciudad Jiménez, Chihuahua), **servesCuisine,** **url** (enlace al detalle en tu sitio).
- Inyectar en la página de detalle de cada restaurante (SSR o inyectado en el cliente con cuidado de no duplicar).

### 3.4 BreadcrumbList

- En listado y detalle: Inicio > Restaurantes > [Nombre restaurante]. Ayuda a Google a entender la jerarquía.

---

## 4. Geo and Local Signals

- **Meta geo (opcional):** `<meta name="geo.region" content="MX-CH">` (Chihuahua).  
- **Content:** Texto visible en landing: “Servimos en Ciudad Jiménez, Chihuahua” y variantes.  
- **Footer:** “Kechow – Comida a domicilio en Jiménez, Chihuahua, México.”  
- **Títulos H1:** Incluir “Jiménez” o “Ciudad Jiménez” donde sea natural (ej. “Pedidos en Jiménez”).

---

## 5. Sitemap Strategy

- **URLset:** Incluir:
  - Landing / home.
  - Listado de restaurantes (`/restaurantes`).
  - URLs de detalle de restaurantes (`/restaurantes/:slug`).
- **Excluir:** `/login`, `/register`, `/owner/*`, `/delivery/*`, `/home`, `/cart`, `/checkout`, `/orders`, etc. (áreas privadas).
- **Frecuencia:** `weekly` para listado; `weekly` o `daily` para restaurantes según actualización.
- **Generación:** Dinámica (backend) o estática (build) según stack. Entregar en `/sitemap.xml` (o `/sitemap_index.xml` si hay varios).

---

## 6. Robots Configuration

- **Production:**  
  - `User-agent: *`  
  - `Allow: /`  
  - `Allow: /restaurantes`  
  - `Allow: /restaurantes/`  
  - `Disallow: /owner/`  
  - `Disallow: /delivery/`  
  - `Disallow: /cart`  
  - `Disallow: /checkout`  
  - `Disallow: /orders`  
  - `Disallow: /login`  
  - `Disallow: /register`  
  - `Sitemap: https://tu-dominio.com/sitemap.xml`

- **Staging/Dev:** `Disallow: /` si no quieres indexación.

---

## 7. Core Web Vitals and Performance

- **LCP:** Optimizar imágenes (formato, tamaño, lazy load); reducir bloqueo de render (critical CSS, defer non-critical JS).
- **FID/INP:** Reducir trabajo en main thread; evitar handlers pesados en clics.
- **CLS:** Dimensiones explícitas en imágenes y reserva de espacio para contenido dinámico.
- **Preconnect/preload:** Para dominio API y recursos críticos (fonts, hero image).
- **Lazy loading:** Rutas y componentes bajo demanda; imágenes below the fold.

---

## 8. Server-Side Rendering (SSR) or Pre-rendering

- **SPA limitation:** Contenido generado en cliente puede ser indexado con retraso. Para máxima SEO en listado y detalle de restaurantes:
  - **Option A:** SSR (Nuxt o Vue SSR) para rutas públicas (landing, restaurantes, detalle).
  - **Option B:** Pre-rendering (prerender-spa-plugin o servicio) para rutas estáticas o con datos de build.
  - **Option C:** Mantener SPA y asegurar meta + JSON-LD inyectados pronto; sitemap con URLs correctas; Google puede ejecutar JS (menos predecible).
- Recomendación a medio plazo: SSR o pre-render para `/`, `/restaurantes`, `/restaurantes/:slug` para garantizar contenido y structured data en primera respuesta.

---

## 9. Location-Based Landing (Optional)

- **Página “Zona de cobertura” o “Ciudades”:** Una página que liste “Servimos en Ciudad Jiménez, Chihuahua” con breve texto y enlace a restaurantes. URL ej. `/cobertura` o `/jimenez-chihuahua`.  
- **Título/description:** Incluir “Jiménez”, “Chihuahua”, “comida a domicilio”.  
- Útil para long-tail y futuras expansiones (varias ciudades).

---

## 10. Checklist (Resumen)

| Elemento | Acción |
|----------|--------|
| Meta title/description | Español; incluir Jiménez, Chihuahua, comida a domicilio |
| html lang | `es` |
| JSON-LD | LocalBusiness, WebSite, Restaurant (páginas detalle), BreadcrumbList |
| Geo | area served Ciudad Jiménez; meta geo.region opcional |
| URLs | Amigables; canonical en listado y detalle |
| Sitemap | Públicas; excluir áreas privadas |
| Robots | Allow público; Disallow owner, delivery, cart, checkout, login, register |
| Core Web Vitals | LCP, FID/INP, CLS optimizados |
| SSR/Pre-render | Considerar para landing y restaurantes |
| Contenido visible | Frases con “Jiménez”, “Chihuahua”, “entrega a domicilio” |

Todo el texto orientado a búsqueda y usuario debe estar en español y alineado con búsquedas locales en Jiménez, Chihuahua.
