# Kechow — Driver Handbook

**Version:** v2 Analysis  
**Audience:** Delivery personnel (repartidores) who earn money by completing deliveries  
**Note:** The delivery app interface is **Spanish-first** (Panel de Control, Pedidos, Ganancias, Perfil).

---

## 1. Role and Access

As a **delivery driver** (repartidor), you log in with an account that has the **delivery** role. You use the **DeliveryLayout** (header + navigation + main content). All navigation labels are in Spanish. The backend ensures only users with role **delivery** can access delivery APIs.

---

## 2. Driver Navigation (Spanish)

- **Panel de Control** — Dashboard (availability, active order, quick stats)  
- **Pedidos** — List of available and completed orders  
- **Ganancias** — Earnings (today, week, month, total)  
- **Perfil** — Profile and vehicle/settings  

---

## 3. Workflow to Earn Money

### 3.1 Go Online

1. Open **Panel de Control**.  
2. Use the **availability toggle** to go **online** (disponible).  
3. Your status is sent to the server; you appear as available for new orders.  
4. You cannot turn off availability while you have an **active delivery**; complete or cancel it first.

### 3.2 See Available Jobs

- **Available jobs** are orders that are **pending** and not yet assigned to any driver.  
- The app loads them from the API (e.g. `/delivery/jobs/available`).  
- Each job shows: pickup (restaurant address), dropoff (customer address), amount (order total), restaurant name, and items.  
- You can accept or reject jobs from the list.

### 3.3 Accept an Order

1. Choose a job and tap **Accept** (Aceptar).  
2. The system creates a **delivery** record and assigns the order to you; the order status becomes **accepted**.  
3. You are taken to the **order detail** or **live delivery** view.  
4. Only one **active** delivery at a time; you must finish or cancel before accepting another.

### 3.4 Complete the Delivery Steps

1. **Assigned** — You have accepted; go to the restaurant.  
2. **Picked up** — At the restaurant; mark “Picked up” (Recogido).  
3. **In transit** — On the way to the customer; mark “On the way” (En camino).  
4. **Delivered** — At the customer; mark “Delivered” (Entregado).  

Each step is sent to the server via **PATCH /delivery/orders/{id}/status**. When you mark **Delivered**:

- The order is marked **delivered** and **actual_delivery_time** is set.  
- Your **total_deliveries** count increases.  
- The order is included in your **earnings**.

### 3.5 Reject an Order

- If you do not want a job, use **Reject** (Rechazar).  
- The job stays available for other drivers; your list updates.

### 3.6 Go Offline

- When you have no active delivery, you can switch the availability toggle to **offline**.  
- You will no longer receive new job offers until you go online again.

---

## 4. Earnings (Ganancias)

- **Earnings** are calculated from **completed deliveries** (order total).  
- The app shows:  
  - **Today** — Earnings from deliveries completed today.  
  - **This week** — Week-to-date.  
  - **This month** — Month-to-date.  
  - **Total** — All-time.  
- Data is loaded from the API (e.g. `/delivery/earnings`).  
- There is no separate “delivery fee” or “tip” table in the current schema; earnings are based on order totals for delivered orders.  
- Use **Ganancias** to track your income and completed orders.

---

## 5. Active and Completed Orders

- **Active order:** One order at a time in status **assigned**, **picked_up**, or **in_transit**. Shown on the dashboard and in **Pedidos**.  
- **Order detail** shows: pickup, dropoff, amount, restaurant, items, delivery notes, and timestamps.  
- **Live delivery** view is used to update status step-by-step (and may show simulated GPS if available).  
- **Completed orders** list shows past deliveries with delivered_at; you can review them in **Pedidos** or **Ganancias**.

---

## 6. Profile and Settings

- **Perfil** lets you manage your profile and, if implemented, **vehicle** type (e.g. motorcycle, car).  
- **Settings** (e.g. language) can be changed if the app exposes them; default language is Spanish.

---

## 7. Offline and Sync

- The app may cache **availability** and **active order** in localStorage for offline resilience.  
- When back online, it syncs with the server.  
- Always try to update status when you have connectivity so the customer and restaurant see the correct state.

---

## 8. Summary: How You Earn

| Step | Action |
|------|--------|
| 1 | Go **online** in Panel de Control. |
| 2 | Open **Pedidos** and see **available jobs**. |
| 3 | **Accept** a job; it becomes your active delivery. |
| 4 | Go to restaurant → mark **Picked up**. |
| 5 | Go to customer → mark **In transit** then **Delivered**. |
| 6 | Earnings for that order count in **Ganancias** (today/week/month/total). |
| 7 | When you have no active delivery, you can go **offline** or accept another job. |

All driver-facing UI is **Spanish-first**. The backend only allows users with role **delivery** to access delivery endpoints and only the assigned driver can update that delivery’s status.
