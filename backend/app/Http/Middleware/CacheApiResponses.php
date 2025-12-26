<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CacheApiResponses
{
    public function handle(Request $request, Closure $next, $ttl = 300): Response
    {
        // Only cache GET requests
        if (!$request->isMethod('get')) {
            return $next($request);
        }
        
        // Generate cache key
        $key = 'api_' . md5($request->fullUrl());
        
        // Check cache
        if (Cache::has($key)) {
            return response()->json(Cache::get($key))->header('X-Cache', 'HIT');
        }
        
        // Process request
        $response = $next($request);
        
        // Cache successful JSON responses
        if ($response->getStatusCode() === 200) {
            $data = json_decode($response->getContent(), true);
            Cache::put($key, $data, $ttl); // Cache for 5 minutes
            $response->header('X-Cache', 'MISS');
        }
        
        return $response;
    }
}
