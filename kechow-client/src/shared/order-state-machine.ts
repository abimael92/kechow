/**
 * Centralized order state machine (shared across customer, owner, delivery).
 * Mirrors server OrderStateMachine; use to validate transitions before API calls
 * and to block invalid state jumps in the UI.
 *
 * @see Docs/ORDER_STATE_MACHINE.md for the state transition table.
 */

export const ORDER_STATUS = {
	PENDING: 'pending',
	ACCEPTED: 'accepted',
	PREPARING: 'preparing',
	READY: 'ready',
	OUT_FOR_DELIVERY: 'out_for_delivery',
	DELIVERED: 'delivered',
	CANCELLED: 'cancelled',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export type OrderRole = 'owner' | 'delivery' | 'admin';

/** [fromStatus] -> [toStatus] -> allowed roles */
const TRANSITIONS: Record<string, Record<string, OrderRole[]>> = {
	[ORDER_STATUS.PENDING]: {
		[ORDER_STATUS.ACCEPTED]: ['owner', 'admin'],
		[ORDER_STATUS.PREPARING]: ['owner', 'admin'],
		[ORDER_STATUS.CANCELLED]: ['owner', 'admin'],
	},
	[ORDER_STATUS.ACCEPTED]: {
		[ORDER_STATUS.PREPARING]: ['owner', 'admin'],
		[ORDER_STATUS.CANCELLED]: ['owner', 'admin'],
	},
	[ORDER_STATUS.PREPARING]: {
		[ORDER_STATUS.READY]: ['owner', 'admin'],
	},
	[ORDER_STATUS.READY]: {
		[ORDER_STATUS.OUT_FOR_DELIVERY]: ['owner', 'admin'],
		[ORDER_STATUS.DELIVERED]: ['owner', 'admin'],
	},
	[ORDER_STATUS.OUT_FOR_DELIVERY]: {
		[ORDER_STATUS.DELIVERED]: ['delivery', 'owner', 'admin'],
	},
	[ORDER_STATUS.DELIVERED]: {},
	[ORDER_STATUS.CANCELLED]: {},
};

export function canTransition(
	fromStatus: string,
	toStatus: string,
	role?: OrderRole | null
): boolean {
	if (fromStatus === toStatus) return true;
	const toMap = TRANSITIONS[fromStatus];
	if (!toMap) return false;
	const allowedRoles = toMap[toStatus];
	if (!allowedRoles) return false;
	if (role == null) return true;
	return allowedRoles.includes(role);
}

export function getAllowedTransitions(
	fromStatus: string,
	role?: OrderRole | null
): OrderStatus[] {
	const toMap = TRANSITIONS[fromStatus];
	if (!toMap) return [];
	const result: OrderStatus[] = [];
	for (const toStatus of Object.keys(toMap) as OrderStatus[]) {
		if (role == null || (TRANSITIONS[fromStatus][toStatus] as OrderRole[]).includes(role)) {
			result.push(toStatus);
		}
	}
	return result;
}

export function isTerminal(status: string): boolean {
	return status === ORDER_STATUS.DELIVERED || status === ORDER_STATUS.CANCELLED;
}

/** Map owner UI status "new" / "declined" to canonical status */
export function normalizeOwnerStatus(status: string): OrderStatus {
	if (status === 'new') return ORDER_STATUS.PENDING;
	if (status === 'declined') return ORDER_STATUS.CANCELLED;
	return status as OrderStatus;
}
