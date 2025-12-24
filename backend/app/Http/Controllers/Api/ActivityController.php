<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ActivityController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $activities = Activity::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json(['activities' => $activities]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|max:100',
            'duration' => 'required|integer|min:1',
            'calories_burned' => 'required|integer|min:0',
            'date' => 'required|date',
            'status' => 'required|string|in:pending,completed,in_progress'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $activity = Activity::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'duration' => $request->duration,
            'calories_burned' => $request->calories_burned,
            'date' => $request->date,
            'status' => $request->status
        ]);

        return response()->json([
            'activity' => $activity,
            'message' => 'Activity created successfully'
        ], 201);
    }

    public function show($id)
    {
        $activity = Activity::find($id);
        
        if (!$activity) {
            return response()->json(['error' => 'Activity not found'], 404);
        }

        return response()->json(['activity' => $activity]);
    }

    public function update(Request $request, $id)
    {
        $activity = Activity::find($id);
        
        if (!$activity) {
            return response()->json(['error' => 'Activity not found'], 404);
        }

        $user = $request->user();
        if ($activity->user_id != $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|string|max:100',
            'duration' => 'sometimes|integer|min:1',
            'calories_burned' => 'sometimes|integer|min:0',
            'date' => 'sometimes|date',
            'status' => 'sometimes|string|in:pending,completed,in_progress'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $activity->update($request->all());

        return response()->json([
            'activity' => $activity,
            'message' => 'Activity updated successfully'
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $activity = Activity::find($id);
        
        if (!$activity) {
            return response()->json(['error' => 'Activity not found'], 404);
        }

        $user = $request->user();
        if ($activity->user_id != $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $activity->delete();

        return response()->json(['message' => 'Activity deleted successfully']);
    }

    public function stats(Request $request)
    {
        $user = $request->user();
        $totalActivities = Activity::where('user_id', $user->id)->count();
        $totalCalories = Activity::where('user_id', $user->id)->sum('calories_burned');
        $totalDuration = Activity::where('user_id', $user->id)->sum('duration');
        
        $activitiesByType = Activity::where('user_id', $user->id)
            ->groupBy('type')
            ->selectRaw('type, count(*) as count, sum(calories_burned) as total_calories, sum(duration) as total_duration')
            ->get();

        return response()->json([
            'total_activities' => $totalActivities,
            'total_calories' => $totalCalories,
            'total_duration' => $totalDuration,
            'activities_by_type' => $activitiesByType
        ]);
    }
}