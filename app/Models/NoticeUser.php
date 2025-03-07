<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NoticeUser extends Model
{
    use HasFactory;
    protected $table = 'notice_users'; // Specify table name if different from Laravel's naming convention

    protected $fillable = [
        'notice_id',
        'user_id',
        'joined_at',
    ];

    public $timestamps = false; // Since we are using 'joined_at' instead of default timestamps

    // Define relationships
    public function notice()
    {
        return $this->belongsTo(Notice::class, 'notice_id', 'notice_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
