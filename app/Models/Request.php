<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;

    protected $table = 'requests';
    protected $primaryKey = "request_id";
    public $incrementing = true; // ✅ Enable auto-increment
    protected $keyType = "int"; // ✅ Ensure it's an integer

    protected $fillable = [
        'seeker_id',
        'helper_id',
        'helper_type',
        'message',
        'status'
    ];

    // Relationships
    public function seeker()
    {
        return $this->belongsTo(User::class, 'seeker_id', 'user_id');
    }

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
}
