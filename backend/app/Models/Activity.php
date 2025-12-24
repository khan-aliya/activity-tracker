<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Activity extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'activities';

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'type',
        'duration',
        'calories_burned',
        'date',
        'status'
    ];

    protected $casts = [
        'date' => 'datetime',
        'duration' => 'integer',
        'calories_burned' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Remove getIdAttribute() method since it's already in parent class
}