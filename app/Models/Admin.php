<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = "admins";

    protected $primaryKey = "admin_id"; // Define primary key
    public $incrementing = true; // ✅ Enable auto-increment
    protected $keyType = "int"; // ✅ Ensure it's an integer

    protected $fillable = [
        "name",
        "email",
        "phone",
        "password",
    ];

    protected $hidden = [
        "password",
    ];
}
