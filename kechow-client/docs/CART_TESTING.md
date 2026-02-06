# Pruebas del carrito (Shopping Cart)

Instrucciones para verificar el flujo completo del carrito sin romper funcionalidad existente.

## Requisitos previos

- Backend Laravel corriendo (`php artisan serve` o `npm run start` desde raíz).
- Frontend Vue corriendo (`npm run dev` en `kechow-client`).
- Usuario cliente logueado (rol `customer`) para probar sincronización con API.

---

## 1. Agregar y quitar ítems

1. Ir a **Restaurantes** y abrir un restaurante.
2. Agregar varios ítems con el botón **"Añadir al carrito"** (o controles +/-).
3. Comprobar que el badge del carrito (flotante y/o navbar) muestra la cantidad correcta.
4. Abrir el carrito (clic en el ícono de carrito o en **"Mi Carrito"** en la barra de navegación).
5. En el panel/drawer:
   - **Aumentar cantidad** con el botón **+** (máximo 20 o stock).
   - **Disminuir cantidad** con el botón **-** (mínimo 1; a 0 se elimina).
   - **Eliminar**: clic en **"Eliminar"** / ícono de papelera; el ítem debe desaparecer.
6. Cerrar el panel y volver a abrirlo: los ítems deben seguir igual (persistencia).

---

## 2. LocalStorage (persistencia entre sesiones)

1. Con ítems en el carrito, cerrar el panel.
2. Recargar la página (F5): el carrito debe conservar ítems, cantidades y subtotal.
3. Cerrar el navegador y volver a abrir la misma URL (sin cerrar sesión): el carrito debe seguir ahí.
4. Si el usuario está logueado, al cargar la app se llama `syncFromBackend()`: el carrito del servidor puede sobrescribir el local (un carrito por usuario en backend).

---

## 3. Resumen: subtotal, envío, IVA, total

1. Con ítems en el carrito, abrir el panel.
2. Comprobar en **"Resumen del pedido"**:
   - **Subtotal** = suma (precio × cantidad) de todos los ítems.
   - **Envío**: 50 MXN si subtotal < 250 MXN; **Gratis** si subtotal ≥ 250 MXN.
   - **IVA (8%)** sobre el subtotal.
   - **Total** = subtotal + envío + IVA.
3. Comprobar la barra de progreso **"Agrega $X MXN más para envío gratis"** cuando el subtotal es menor a 250 MXN.

---

## 4. Navbar y resumen visual

1. Con rol **customer**, en escritorio (md+):
   - En la barra de navegación debe aparecer **"Mi Carrito"** con badge de cantidad y, en lg+, subtotal (ej. **· $120.00 MXN**).
   - Clic en **"Mi Carrito"** debe abrir el **drawer/modal del carrito**, no ir a la página `/cart`.
2. El **botón flotante** (esquina inferior derecha):
   - Muestra cantidad en el badge.
   - En pantallas grandes (lg+), puede mostrar **"X artículos"** y **"$X.XX MXN"** (subtotal).
   - Clic abre el mismo drawer del carrito.

---

## 5. Responsive (drawer/modal)

1. **Móvil**: al abrir el carrito, el panel debe aparecer desde abajo (bottom sheet), con alto máximo ~90vh, y el fondo oscurecido. Cerrar con **"Cerrar"** o tocando el fondo.
2. **Tablet (md)**: panel desde la derecha (slide-in), ancho máximo ~md.
3. **Escritorio (lg)**: modal centrado, ancho máximo ~lg, bordes redondeados.
4. En todos los tamaños, el contenido del carrito debe ser scrolleable si hay muchos ítems.

---

## 6. Un restaurante a la vez

1. Añadir ítems de **Restaurante A**.
2. Ir a **Restaurante B** e intentar agregar un ítem.
3. Debe mostrarse un mensaje tipo: **"Solo puedes tener un restaurante a la vez. Vacía el carrito para cambiar."**
4. Vaciar el carrito (eliminar todos los ítems) y luego poder agregar ítems del Restaurante B.

---

## 7. Sincronización con Laravel (usuario logueado)

1. Iniciar sesión como **customer**.
2. Agregar ítems al carrito: las peticiones deben ir a `POST /api/carts` y `PUT /api/carts/{id}/items`.
3. Recargar la página: el carrito debe cargarse desde `GET /api/carts/current` (syncFromBackend).
4. Cambiar cantidad o eliminar ítem: debe actualizarse en backend y reflejarse en la UI y en localStorage.

---

## 8. Pago y checkout

1. Con ítems en el carrito, en el panel pulsar **"Pagar $X.XX MXN"** (o **"Ir a pagar"** si aplica).
2. Debe navegar a la página de **Checkout** sin romper navegación ni tema.
3. Si no hay conexión, el botón puede mostrarse deshabilitado con texto **"Sin conexión"**.

---

## 9. Tema y texto en español

- Colores: tonos **ámbar/primary** (#FF6B00) en botones, badges y acentos.
- Textos visibles en español: **Carrito**, **Cantidad**, **Eliminar**, **Resumen del pedido**, **Subtotal**, **Envío**, **IVA**, **Total**, **Cerrar**, **Ver restaurantes**, **Tu carrito está vacío**, etc.
- Sin uso de i18n en los componentes del carrito: contenido directo en español.

---

## Resumen de archivos tocados

- **Store:** `src/features/customer/cart/cart.store.ts` (lógica, localStorage, sync API).
- **Servicio API:** `src/features/customer/cart/cart.service.ts`.
- **UI:** `src/features/customer/containers/CartPanel.vue`, `CartOverlay.vue`, `CartBadge.vue`.
- **Navbar:** `src/shared/layout/RoleNavigation.vue` (resumen carrito para customer).
- **Composable:** `src/features/customer/cart/useCartPanel.ts` (abrir/cerrar panel).

Si algo falla, revisar consola del navegador y respuestas de red (API carts). Asegurarse de que las rutas de cart en Laravel estén bajo `auth:sanctum` y que el frontend envíe el token Bearer.
