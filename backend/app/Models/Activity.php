<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;

class Activity extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'activities';
    
    protected $fillable = [
        'user_id',
        'title',
        'category',
        'sub_category',
        'duration',
        'date',
        'feeling',
        'notes',
        'status'
    ];
    
    protected $casts = [
        'duration' => 'integer',
        'feeling' => 'integer',
        'date' => 'date'
    ];
    
    // Constants for categories (update based on your needs)
    public const CATEGORIES = ['Self-care', 'Productivity', 'Reward'];
    public const SUB_CATEGORIES = [
        'Self-care' => ['Workout', 'Meditation', 'Reading', 'Sleep'],
        'Productivity' => ['Work', 'Study', 'Cleaning', 'Projects'],
        'Reward' => ['Gaming', 'Shopping', 'Social', 'Entertainment']
    ];
}