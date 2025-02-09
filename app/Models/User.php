<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class User extends Model
{
    use HasFactory, HasApiTokens;
    protected $table = 'users';
    protected $primaryKey = "user_id";
    public $incrementing = false;
    protected $keyType = "bigInteger";

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'password',
        'phone',
        'address',
        'profile_pic',
        'role',
        'approved',
    ];
    protected $hidden = [
        'password',
    ];

    public function doctor()
    {
        return $this->hasOne(Doctor::class);
    }
    public function volunteer()
    {
        return $this->hasOne(Volunteer::class);
    }
    public function bloodDonor()
    {
        return $this->hasOne(BloodDonor::class);
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($user) {
            do {
                $randomId = mt_rand(1000000000, 9999999999); // Generate 10-digit random ID
            } while (self::where("user_id", $randomId)->exists()); // Ensure uniqueness

            $user->user_id = $randomId; // Assign random ID
        });
    }




}
