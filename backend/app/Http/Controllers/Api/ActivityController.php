<?php

namespace App\Http\Controllers\Api;

use App\Models\Activity;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $activities = Activity::where('user_id', $request->user()->id)
            ->orderBy('date', 'desc')
            ->get();
            
        return response()->json($activities);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string',
            'duration' => 'required|integer|min:1',
            'date' => 'required|date',
            'priority' => 'required|in:low,medium,high',
        ]);

        $activity = Activity::create([
            'user_id' => $request->user()->id,
            ...$validated,
            'status' => 'pending'
        ]);

        return response()->json($activity, 201);
    }

    public function show(Request $request, $id)
    {
        $activity = Activity::where('user_id', $request->user()->id)
            ->where('_id', $id)
            ->firstOrFail();
            
        return response()->json($activity);
    }

    public function update(Request $request, $id)
    {
        $activity = Activity::where('user_id', $request->user()->id)
            ->where('_id', $id)
            ->firstOrFail();
        
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|string',
            'duration' => 'sometimes|integer|min:1',
            'date' => 'sometimes|date',
            'status' => 'sometimes|in:pending,in_progress,completed',
            'priority' => 'sometimes|in:low,medium,high',
        ]);

        $activity->update($validated);
        return response()->json($activity);
    }

    public function destroy(Request $request, $id)
    {
        $activity = Activity::where('user_id', $request->user()->id)
            ->where('_id', $id)
            ->firstOrFail();
            
        $activity->delete();
        return response()->json(['message' => 'Activity deleted successfully']);
    }
}
