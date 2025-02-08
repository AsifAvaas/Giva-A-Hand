<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Volunteer extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'volunteers';
    protected $primaryKey = "volunteer_id";
    public $incrementing = false;
    protected $keyType = "bigInteger";
    protected $fillable = [
        'volunteer_id',
        'user_id',
        'skills',
        'availability',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

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
