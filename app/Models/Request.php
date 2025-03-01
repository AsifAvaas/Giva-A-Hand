<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;
    protected $table = 'requests';
    protected $primaryKey = "request_id";
    public $incrementing = false;
    protected $keyType = "int";
    protected $fillable = [
        'seeker_id',
        'helper_id',
        'helper_type',
        'message',
        'status'
    ];

    // Relationship with User (Seeker)
    public function seeker()
    {
        return $this->belongsTo(User::class, 'seeker_id', 'user_id');
    }

    // Polymorphic Relationship: Helper (Volunteer, Doctor, Blood Donor)
    // public function helper()
    // {
    //     switch ($this->helper_type) {
    //         case 'volunteers':
    //             return $this->belongsTo(Volunteer::class, 'helper_id', 'volunteer_id');
    //         case 'doctors':
    //             return $this->belongsTo(Doctor::class, 'helper_id', 'doctor_id');
    //         case 'blood_donors':
    //             return $this->belongsTo(BloodDonor::class, 'helper_id', 'blood_donor_id');
    //         default:
    //             return null;
    //     }
    // }
    public function volunteer()
    {
        return $this->belongsTo(Volunteer::class, 'helper_id', 'volunteer_id');
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'helper_id', 'doctor_id');
    }

    public function bloodDonor()
    {
        return $this->belongsTo(BloodDonor::class, 'helper_id', 'blood_donor_id');
    }
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($request) {
            do {
                $randomId = mt_rand(1000000000, 9999999999); // Generate 10-digit random ID
            } while (self::where("request_id", $randomId)->exists()); // Ensure uniqueness

            $request->request_id = $randomId; // Assign random ID
        });
    }

}
