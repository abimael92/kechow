<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Driver commission rate (0 to 1)
    |--------------------------------------------------------------------------
    | Fraction of order total paid to driver as earnings. 1.0 = 100% (full amount).
    | Use e.g. 0.15 for 15% commission. Order total is unchanged; only driver-facing
    | earnings (stats, earnings endpoint) are multiplied by this rate.
    */
    'driver_commission_rate' => (float) env('DELIVERY_DRIVER_COMMISSION_RATE', 1.0),

    /*
    |--------------------------------------------------------------------------
    | Fixed delivery fee per order (driver share)
    |--------------------------------------------------------------------------
    | Optional fixed amount added to driver earnings per delivery (in same currency
    | as order total). Applied in addition to commission when calculating driver earnings.
    */
    'delivery_fee_fixed' => (float) env('DELIVERY_FEE_FIXED', 0),

];
