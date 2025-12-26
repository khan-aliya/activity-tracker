<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ActivityController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:sanctum');
    }

    // In ActivityController.php, update the index method:
public function index(Request $request)
{
    $query = Activity::where('user_id', auth()->user()->id);

    // Filter by date range
    if ($request->has('start_date') && $request->has('end_date')) {
        $query->whereBetween('date', [
            Carbon::parse($request->start_date)->startOfDay(),
            Carbon::parse($request->end_date)->endOfDay()
        ]);
    }

    // Filter by category
    if ($request->has('category') && $request->category !== 'all') {
        $query->where('category', $request->category);
    }

    // Filter by sub_category
    if ($request->has('sub_category') && $request->sub_category !== 'all') {
        $query->where('sub_category', $request->sub_category);
    }

    // Filter by feeling range
    if ($request->has('min_feeling')) {
        $query->where('feeling', '>=', $request->min_feeling);
    }
    if ($request->has('max_feeling')) {
        $query->where('feeling', '<=', $request->max_feeling);
    }

    // Filter by duration range
    if ($request->has('min_duration')) {
        $query->where('duration', '>=', $request->min_duration);
    }
    if ($request->has('max_duration')) {
        $query->where('duration', '<=', $request->max_duration);
    }

    // Search by title
    if ($request->has('search')) {
        $query->where('title', 'like', '%' . $request->search . '%');
    }

    // Sorting
    $sortBy = $request->get('sort_by', 'date');
    $sortOrder = $request->get('sort_order', 'desc');
    $query->orderBy($sortBy, $sortOrder);

    $perPage = $request->get('per_page', 10);
    return response()->json($query->paginate($perPage));
}
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|in:Self-care,Productivity,Reward',
            'sub_category' => 'required|string',
            'duration' => 'required|integer|min:1|max:1440',
            'date' => 'required|date',
            'feeling' => 'required|integer|min:1|max:10',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
                'message' => 'Validation failed'
            ], 422);
        }

        $activity = Activity::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'category' => $request->category,
            'sub_category' => $request->sub_category,
            'duration' => $request->duration,
            'date' => $request->date,
            'feeling' => $request->feeling,
            'notes' => $request->notes,
            'status' => 'completed'
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
            return response()->json([
                'message' => 'Activity not found'
            ], 404);
        }

        if ($activity->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }
        
        return response()->json($activity);
    }

    public function update(Request $request, $id)
    {
        $activity = Activity::find($id);
        
        if (!$activity) {
            return response()->json([
                'message' => 'Activity not found'
            ], 404);
        }

        if ($activity->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|in:Self-care,Productivity,Reward',
            'sub_category' => 'sometimes|required|string',
            'duration' => 'sometimes|required|integer|min:1|max:1440',
            'date' => 'sometimes|required|date',
            'feeling' => 'sometimes|required|integer|min:1|max:10',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
                'message' => 'Validation failed'
            ], 422);
        }

        $activity->update($request->all());

        return response()->json([
            'activity' => $activity,
            'message' => 'Activity updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $activity = Activity::find($id);
        
        if (!$activity) {
            return response()->json([
                'message' => 'Activity not found'
            ], 404);
        }

        if ($activity->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }
        
        $activity->delete();

        return response()->json([
            'message' => 'Activity deleted successfully'
        ]);
    }

    // public function stats(Request $request)
    // {
    //     $user = $request->user();
        
    //     $totalActivities = Activity::where('user_id', $user->id)->count();
    //     $totalDuration = Activity::where('user_id', $user->id)->sum('duration');
    //     $averageFeeling = Activity::where('user_id', $user->id)->avg('feeling');

    //     $byCategory = Activity::where('user_id', $user->id)
    //         ->select('category')
    //         ->selectRaw('count(*) as count, sum(duration) as total_duration')
    //         ->groupBy('category')
    //         ->get();

    //     $recentActivities = Activity::where('user_id', $user->id)
    //         ->orderBy('date', 'desc')
    //         ->orderBy('created_at', 'desc')
    //         ->limit(5)
    //         ->get();

    //     $weeklySummary = Activity::where('user_id', $user->id)
    //         ->where('date', '>=', Carbon::now()->subDays(7))
    //         ->selectRaw('DATE(date) as day, category, count(*) as count')
    //         ->groupBy('day', 'category')
    //         ->orderBy('day', 'desc')
    //         ->get();

    //     return response()->json([
    //         'total_activities' => $totalActivities,
    //         'total_duration' => $totalDuration,
    //         'average_feeling' => round($averageFeeling, 2),
    //         'by_category' => $byCategory,
    //         'recent_activities' => $recentActivities,
    //         'weekly_summary' => $weeklySummary
    //     ]);
    // }

    public function categories()
{
    return response()->json([
        'categories' => \App\Models\Activity::CATEGORIES,
        'sub_categories' => \App\Models\Activity::SUB_CATEGORIES
    ]);
}
}