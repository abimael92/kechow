# Kechow — Business Owner Manual

**Version:** v2 Analysis  
**Audience:** Restaurant owners and operators who manage their business on the platform  
**Note:** The owner interface is **Spanish-first** (Panel de Control, Menú, Pedidos, etc.).

---

## 1. Role and Access

As a **business owner** (propietario), you have access to the **owner dashboard** after logging in with an account that has the **owner** role. The platform uses **OwnerLayout** (header + navigation + main content). All navigation labels are in Spanish.

---

## 2. Owner Navigation (Spanish)

- **Panel de Control** — Dashboard (overview, stats, quick actions)  
- **Pedidos** — Order management (accept, reject, update status)  
- **Menú** — Menu items (add, edit, categories, availability, stock)  
- **Analíticas** — Analytics (revenue, trends, popular items)  
- **Reseñas** — Customer reviews  
- **Configuración** — Settings (general, hours, delivery, payments, notifications, etc.)

---

## 3. Dashboard (Panel de Control)

- **Overview** of today’s and period metrics (orders, revenue, averages).  
- Data comes from the API (e.g. order stats by restaurant).  
- Use it to monitor daily performance and trends.

---

## 4. Order Management (Pedidos)

- View orders for **your restaurant(s)**.  
- Filter by status (e.g. new/pending, accepted, preparing, ready, out for delivery, delivered, cancelled).  
- **Actions:**  
  - Accept or reject new orders.  
  - Update status along the workflow: **pending → accepted → preparing → ready → out_for_delivery → delivered** (or cancelled).  
- Only orders belonging to restaurants you own are visible; the backend enforces ownership.

---

## 5. Menu Management (Menú)

- **CRUD** for menu items: name, description, price, image, category, preparation time, stock, availability.  
- **Categories** can be used to group items (if supported by the API).  
- **Toggle availability** so items can be hidden without deleting.  
- **Stock:** When stock is set, the system can prevent adding more than available (e.g. in cart and at checkout).  
- **Edit** from the menu list or from the dedicated edit page (e.g. `/owner/menu-items/edit/:id`).

---

## 6. Analytics (Analíticas)

- **Revenue and sales** over time (e.g. today, week, month).  
- **Charts** for revenue and possibly top-selling items.  
- Use this to adjust menu and promotions.

---

## 7. Reviews (Reseñas)

- View **customer reviews** and ratings for your restaurant.  
- Helps you monitor quality and respond to feedback.

---

## 8. Settings (Configuración)

- **General:** Restaurant name, description, contact, logo.  
- **Operating hours:** Schedule (e.g. schedule_json and exceptional closed dates); override for “closed today” if supported.  
- **Delivery:** Delivery radius, prep time (avg_prep_time_minutes), etc.  
- **Payments / Notifications:** Configure payment and notification preferences as implemented.  

Settings are saved via the API; changes affect how your restaurant appears and operates on the platform.

---

## 9. Financials and Operations

- **Revenue** is derived from orders (order total).  
- Dashboard and analytics show revenue by period.  
- There is no separate “payment gateway” or “payout” flow documented in the current codebase; financial reporting is based on order data.  
- For **staff:** Only the owner (and optionally admin) can manage the restaurant; there is no separate “staff” role in the current design.  
- **Delivery** is handled by drivers; owners move orders to **ready** and then to **out_for_delivery** when a driver is assigned (or the system assigns one).

---

## 10. Best Practices

- Keep **menu items** and **availability** up to date to avoid failed orders.  
- Use **operating hours** and **closed dates** so customers see accurate open/closed status.  
- Process **orders** promptly (accept/reject and status updates) to keep delivery flow smooth.  
- Monitor **reviews** and **analytics** to improve offer and operations.

---

## 11. Summary

| Area | Purpose |
|------|--------|
| Panel de Control | Overview and KPIs |
| Pedidos | Accept, reject, and update order status |
| Menú | Add/edit items, categories, stock, availability |
| Analíticas | Revenue and sales trends |
| Reseñas | Customer feedback |
| Configuración | General, hours, delivery, payments, notifications |

All owner-facing UI is **Spanish-first**. Backend enforces that you only see and manage orders and menus for restaurants you own.
