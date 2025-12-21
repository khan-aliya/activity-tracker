<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
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
}
