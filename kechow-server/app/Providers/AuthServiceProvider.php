<?php

namespace App\Providers;

use App\Models\Delivery;
use App\Models\User;
use App\Policies\DeliveryPolicy;
use App\Modules\Owner\Policies\OwnerPolicy;
use App\Modules\Owner\Policies\RestaurantPolicy;
use App\Modules\Restaurant\Models\Restaurant;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => OwnerPolicy::class,
        Restaurant::class => RestaurantPolicy::class,
        Delivery::class => DeliveryPolicy::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
