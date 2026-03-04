import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { useDeliveryStore } from './delivery.store';

describe('delivery store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('has initial state', () => {
    const store = useDeliveryStore();
    expect(store.isOnline).toBe(false);
    expect(store.activeOrder).toBeNull();
    expect(store.hasActiveOrder).toBe(false);
    expect(store.availableJobs).toEqual([]);
    expect(store.earningsSummary).toBeNull();
  });

  it('deliveryProgress is null when no active order', () => {
    const store = useDeliveryStore();
    expect(store.deliveryProgress).toBeNull();
  });
});
