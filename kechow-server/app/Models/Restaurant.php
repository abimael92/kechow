<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\MenuItem;
use OpenApi\Annotations as OA;


/**
 * @OA\Schema(
 *     schema="Restaurant",
 *     required={"name", "location"},
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="location", type="string"),
 *     @OA\Property(property="description", type="string")
 * )
 */


class Restaurant extends Model
{
    protected $fillable = [
        'name',
        'description',
        'address',
        'city',
        'state',
        'zip_code',
        'phone',
        'email',
        'website',
        'opening_time',
        'closing_time',
        'logo_url',
        'is_active',
    ];

    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }
}
