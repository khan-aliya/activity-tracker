<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Activity extends Eloquent
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'activities';

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'type',
        'duration',
        'date',
        'status',
    ];

    protected $casts = [
        'duration' => 'integer',
        'date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
