<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class SimpleTokenAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        // Get token from Authorization header
        $token = $request->bearerToken();
        
        if (!$token) {
            // Also check for token in query string (for testing)
            $token = $request->query('api_token');
        }
        
        \Log::info("TokenAuth: Token received: " . ($token ?: 'none'));
        
        if (!$token) {
            \Log::warning("TokenAuth: No token provided");
            return response()->json([
                'message' => 'Authentication token required'
            ], 401);
        }
        
        // Find user by token
        $user = User::where('api_token', $token)->first();
        
        \Log::info("TokenAuth: User found: " . ($user ? 'Yes' : 'No'));
        if ($user) {
            \Log::info("TokenAuth: User ID: " . $user->_id);
        }
        
        if (!$user) {
            \Log::warning("TokenAuth: Invalid token: $token");
            return response()->json([
                'message' => 'Invalid authentication token'
            ], 401);
        }
        
        // Manually authenticate the user
        auth()->setUser($user);
        
        return $next($request);
    }
}