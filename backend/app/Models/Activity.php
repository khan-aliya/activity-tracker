<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'duration',
        'date',
        'status',
        'priority'
    ];

    protected $casts = [
        'date' => 'datetime',
        'duration' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
