<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Recievers extends Model
{
    use HasFactory, HasApiTokens;
    protected $table = "recievers";
    protected $primaryKey = "reciever_id"; // Define the primary key
    public $incrementing = false; // Disable auto-increment
    protected $keyType = "bigInteger"; // Ensure it's treated as an integer

    protected $fillable = [
        'reciever_id',
        "name",
        "email",
        "phone",
        "reason",
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
        static::creating(function ($reciever) {
            do {
                $randomId = mt_rand(1000000000, 9999999999); // Generate 10-digit random ID
            } while (self::where("reciever_id", $randomId)->exists()); // Ensure uniqueness

            $reciever->reciever_id = $randomId; // Assign random ID
        });
    }
}
