<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    protected $connection = 'mongodb';
    protected $collection = 'personal_access_tokens';
    
    // Add these if you want to use MongoDB's _id
    protected $primaryKey = '_id';
    protected $keyType = 'string';
    public $incrementing = false;
}