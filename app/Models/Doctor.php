<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Doctor extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'doctors';
    protected $primaryKey = "doctor_id";
    public $incrementing = false;
    protected $keyType = "bigInteger";

    protected $fillable = [
        'doctor_id',
        'user_id',
        'specialization',
        'freeTime',
        'chamber_Location',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    protected static function boot()
    {
        parent::boot();
        static::creating(function ($doctor) {
            do {
                $randomId = mt_rand(1000000000, 9999999999); // Generate 10-digit random ID
            } while (self::where("doctor_id", $randomId)->exists()); // Ensure uniqueness

            $doctor->doctor_id = $randomId; // Assign random ID
        });
    }

}
