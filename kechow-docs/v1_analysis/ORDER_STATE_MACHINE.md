# Order State Machine

Centralized order state machine for data integrity. Valid transitions are enforced on the server and validated on the client before API calls. Invalid state jumps are blocked.

## State transition table

| From             | To                | Allowed roles   |
|------------------|-------------------|-----------------|
| `pending`        | `accepted`        | owner, admin    |
| `pending`        | `preparing`       | owner, admin    |
| `pending`        | `cancelled`       | owner, admin    |
| `accepted`       | `preparing`       | owner, admin    |
| `accepted`       | `cancelled`       | owner, admin    |
| `preparing`      | `ready`           | owner, admin    |
| `ready`          | `out_for_delivery`| owner, admin    |
| `ready`          | `delivered`       | owner, admin    |
| `out_for_delivery` | `delivered`     | delivery, owner, admin |
| `delivered`      | *(terminal)*      | —               |
| `cancelled`      | *(terminal)*      | —               |

## Canonical states

- **pending** – Order placed, not yet accepted.
- **accepted** – Restaurant accepted the order.
- **preparing** – Kitchen is preparing the order.
- **ready** – Order ready for pickup or assignment to driver.
- **out_for_delivery** – Driver has the order (en route).
- **delivered** – Order delivered to customer.
- **cancelled** – Order cancelled.

## Where it is enforced

- **Server:** `App\Modules\Order\OrderStateMachine` and `OrderService::updateOrderStatus()` validate every status change. Invalid transitions throw `InvalidArgumentException`.
- **Client:** `@shared/order-state-machine` exposes `canTransition(from, to, role)` and `getAllowedTransitions(from, role)`. Owner OrdersPanel validates before calling `updateOrderStatus`. Same rules apply across customer (read-only), owner, and delivery roles.

## Role mapping

- **Owner:** Can perform pending → accepted/preparing/cancelled; accepted → preparing/cancelled; preparing → ready; ready → out_for_delivery or delivered.
- **Delivery:** Can perform out_for_delivery → delivered (and optionally ready → out_for_delivery when accepting assignment).
- **Admin:** Can perform any transition allowed for owner or delivery.

## Client status aliases

- Owner UI may use **new** for `pending` and **declined** for `cancelled`. Use `normalizeOwnerStatus()` from the shared state machine before validating.
