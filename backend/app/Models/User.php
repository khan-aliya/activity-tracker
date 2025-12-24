<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use MongoDB\Laravel\Eloquent\Model;

class User extends Authenticatable
{
    use Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'api_token'
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'api_token'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Automatically hash passwords
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    public function generateToken()
    {
        $this->api_token = bin2hex(random_bytes(32));
        $this->save();
        return $this->api_token;
    }

    public function clearToken()
    {
        $this->api_token = null;
        $this->save();
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    // Helper method to convert MongoDB ID to string
    public function getIdAttribute()
    {
        if (isset($this->attributes['_id'])) {
            return (string) $this->attributes['_id'];
        }
        if (isset($this->attributes['id'])) {
            return (string) $this->attributes['id'];
        }
        return null;
    }

    // For testing - FIXED truncate method for MongoDB
    public static function truncate()
    {
        // For MongoDB, we delete all documents
        try {
            self::query()->delete();
        } catch (\Exception $e) {
            // Alternative method
            \Illuminate\Support\Facades\DB::connection('mongodb')
                ->collection((new static)->getTable())
                ->deleteMany([]);
        }
    }
}