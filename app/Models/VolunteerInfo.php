<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class VolunteerInfo extends Model
{
    use HasFactory, HasApiTokens;
    protected $table = 'volunteer_infos';
    protected $primaryKey = "volunteer_id"; // Define the primary key
    public $incrementing = false; // Disable auto-increment
    protected $keyType = "bigInteger"; // Ensure it's treated as an integer

    protected $fillable = [
        'volunteer_id',
        'name',
        'email',
        'phone',
        'address',
        'skills',
        'availability',
        'password',
        'profile_pic',
        'approved',
    ];
    protected $hidden = [
        'password',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($volunteer) {
            do {
                $randomId = mt_rand(1000000000, 9999999999); // Generate 10-digit random ID
            } while (self::where("volunteer_id", $randomId)->exists()); // Ensure uniqueness

            $volunteer->volunteer_id = $randomId; // Assign random ID
        });
    }
}
