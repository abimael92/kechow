<?php

declare(strict_types=1);

namespace App\Modules\Order;

use App\Modules\Order\Models\Order;

/**
 * Centralized order state machine.
 * Single source of truth for valid transitions; shared across roles (owner, delivery, admin).
 * Invalid state jumps are blocked.
 *
 * STATE TRANSITION TABLE
 * ----------------------
 * | From             | To                | Allowed roles |
 * |------------------|-------------------|---------------|
 * | pending         | accepted          | owner, admin  |
 * | pending         | preparing         | owner, admin  |
 * | pending         | cancelled         | owner, admin  |
 * | accepted        | preparing         | owner, admin  |
 * | accepted        | cancelled        | owner, admin  |
 * | preparing       | ready             | owner, admin  |
 * | ready           | out_for_delivery  | owner, admin  |
 * | ready           | delivered         | owner, admin  |
 * | out_for_delivery| delivered         | delivery, owner, admin |
 * | delivered       | (terminal)        | —             |
 * | cancelled       | (terminal)        | —             |
 */
final class OrderStateMachine
{
    /** @var array<string, array<string, list<string>>> [from => [to => [roles]]] */
    private static array $transitions = [
        Order::STATUS_PENDING => [
            Order::STATUS_ACCEPTED => ['owner', 'admin'],
            Order::STATUS_PREPARING => ['owner', 'admin'], // Accept and start
            Order::STATUS_CANCELLED => ['owner', 'admin'],
        ],
        Order::STATUS_ACCEPTED => [
            Order::STATUS_PREPARING => ['owner', 'admin'],
            Order::STATUS_CANCELLED => ['owner', 'admin'],
        ],
        Order::STATUS_PREPARING => [
            Order::STATUS_READY => ['owner', 'admin'],
        ],
        Order::STATUS_READY => [
            Order::STATUS_OUT_FOR_DELIVERY => ['owner', 'admin'],
            Order::STATUS_DELIVERED => ['owner', 'admin'],
        ],
        Order::STATUS_OUT_FOR_DELIVERY => [
            Order::STATUS_DELIVERED => ['delivery', 'owner', 'admin'],
        ],
        Order::STATUS_DELIVERED => [],
        Order::STATUS_CANCELLED => [],
    ];

    public static function canTransition(string $fromStatus, string $toStatus, ?string $role = null): bool
    {
        if ($fromStatus === $toStatus) {
            return true;
        }

        $allowed = self::$transitions[$fromStatus][$toStatus] ?? null;
        if ($allowed === null) {
            return false;
        }

        if ($role === null) {
            return true;
        }

        return in_array($role, $allowed, true);
    }

    /** @return list<string> */
    public static function getAllowedTransitions(string $fromStatus, ?string $role = null): array
    {
        $fromTransitions = self::$transitions[$fromStatus] ?? [];
        $result = [];
        foreach ($fromTransitions as $toStatus => $roles) {
            if ($role === null || in_array($role, $roles, true)) {
                $result[] = $toStatus;
            }
        }
        return $result;
    }

    public static function isTerminal(string $status): bool
    {
        return in_array($status, [Order::STATUS_DELIVERED, Order::STATUS_CANCELLED], true);
    }
}
