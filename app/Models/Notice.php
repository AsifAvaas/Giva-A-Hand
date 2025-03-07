<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    use HasFactory;

    protected $table = 'notices';
    protected $primaryKey = 'notice_id';
    public $timestamps = true; 

    protected $fillable = [
        'notice_title',
        'notice_message',
        'notice_pic',
        'admin_id'
    ];

    
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }
}
