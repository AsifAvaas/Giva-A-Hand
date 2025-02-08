<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class BloodDonor extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'blood_donors';
    protected $primaryKey = "blood_donor_id";
    public $incrementing = false;
    protected $keyType = "bigInteger";

    protected $fillable = [
        'blood_donor_id',
        'user_id',
        'blood_group',
        'last_donation',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    protected static function boot()
    {
        parent::boot();
        static::creating(function ($bloodDonor) {
            do {
                $randomId = mt_rand(1000000000, 9999999999); // Generate 10-digit random ID
            } while (self::where("blood_donor_id", $randomId)->exists()); // Ensure uniqueness

            $bloodDonor->blood_donor_id = $randomId; // Assign random ID
        });
    }
}
