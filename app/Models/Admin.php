<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Model
{
    use HasFactory, HasApiTokens;
    protected $table = "admins";

    protected $primaryKey = "admin_id"; // Define the primary key
    public $incrementing = false; // Disable auto-increment
    protected $keyType = "bigInteger"; // Ensure it's treated as an integer
    protected $fillable = [
        "admin_id",
        "name",
        "email",
        "phone",
        "password",
    ];
    protected $hidden = [
        "password",
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($admin) {
            do {
                $randomId = mt_rand(1000000000, 9999999999); // Generate 10-digit random ID
            } while (self::where("admin_id", $randomId)->exists()); // Ensure uniqueness

            $admin->admin_id = $randomId; // Assign random ID
        });
    }
}
