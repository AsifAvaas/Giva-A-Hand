<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class BloodDonors extends Model
{
    use HasFactory, HasApiTokens;
    protected $table = "blood_donors";

    protected $primaryKey = "blood_donor_id"; // Define the primary key
    public $incrementing = false; // Disable auto-increment
    protected $keyType = "bigInteger"; // Ensure it's treated as an integer



    protected $fillable = [
        "blood_donor_id",
        "name",
        "email",
        "phone",
        "blood_group",
        "last_donation",
        "address",
        "password",
        "profile_pic",
        "approved",

    ];
    protected $hidden = [
        "password",
    ];
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($blood_donor) {
            do {
                $randomId = mt_rand(1000000000, 9999999999); // Generate 10-digit random ID
            } while (self::where("blood_donor_id", $randomId)->exists()); // Ensure uniqueness

            $blood_donor->blood_donor_id = $randomId; // Assign random ID
        });
    }
}
