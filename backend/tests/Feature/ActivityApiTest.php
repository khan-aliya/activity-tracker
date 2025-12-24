<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Activity;

class ActivityApiTest extends TestCase
{
    protected $user;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'api_token' => 'test_token_' . time(),
        ]);
        
        $this->token = $this->user->api_token;
    }

    /** @test */
    public function authenticated_user_can_create_activity()
    {
        $activityData = [
            'title' => 'Morning Run',
            'description' => '30 minute run in the park',
            'type' => 'Running',
            'duration' => 30,
            'calories_burned' => 300,
            'date' => '2024-01-15 08:00:00',
            'status' => 'completed'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/activities', $activityData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'activity' => ['id', 'title', 'description', 'type', 'duration', 'calories_burned', 'date', 'status'],
                'message'
            ])
            ->assertJson([
                'activity' => [
                    'title' => 'Morning Run',
                    'type' => 'Running',
                    'duration' => 30,
                    'calories_burned' => 300,
                    'status' => 'completed'
                ],
                'message' => 'Activity created successfully'
            ]);
    }

    /** @test */
    public function user_can_retrieve_their_activities()
    {
        // Create activities for the user
        Activity::create([
            'user_id' => $this->user->id,
            'title' => 'Activity 1',
            'type' => 'Running',
            'duration' => 30,
            'calories_burned' => 300,
            'date' => now(),
            'status' => 'completed'
        ]);

        Activity::create([
            'user_id' => $this->user->id,
            'title' => 'Activity 2',
            'type' => 'Cycling',
            'duration' => 45,
            'calories_burned' => 500,
            'date' => now()->subDay(),
            'status' => 'completed'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/activities');

        $response->assertStatus(200)
            ->assertJsonStructure(['activities'])
            ->assertJsonCount(2, 'activities');
    }

    /** @test */
    public function user_can_get_activity_stats()
    {
        // Create activities
        Activity::create([
            'user_id' => $this->user->id,
            'title' => 'Run',
            'type' => 'Running',
            'duration' => 30,
            'calories_burned' => 300,
            'date' => now(),
            'status' => 'completed'
        ]);

        Activity::create([
            'user_id' => $this->user->id,
            'title' => 'Cycle',
            'type' => 'Cycling',
            'duration' => 45,
            'calories_burned' => 500,
            'date' => now(),
            'status' => 'completed'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/activities/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'total_activities',
                'total_calories',
                'total_duration',
                'activities_by_type'
            ])
            ->assertJson([
                'total_activities' => 2,
                'total_calories' => 800,
                'total_duration' => 75
            ]);
    }

    /** @test */
    public function user_can_update_their_activity()
    {
        $activity = Activity::create([
            'user_id' => $this->user->id,
            'title' => 'Original Title',
            'type' => 'Running',
            'duration' => 30,
            'calories_burned' => 300,
            'date' => now(),
            'status' => 'pending'
        ]);

        $updateData = [
            'title' => 'Updated Title',
            'status' => 'completed',
            'duration' => 35
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/activities/{$activity->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'activity' => [
                    'title' => 'Updated Title',
                    'status' => 'completed',
                    'duration' => 35
                ],
                'message' => 'Activity updated successfully'
            ]);
    }

    /** @test */
    public function user_can_delete_their_activity()
    {
        $activity = Activity::create([
            'user_id' => $this->user->id,
            'title' => 'To Delete',
            'type' => 'Running',
            'duration' => 30,
            'calories_burned' => 300,
            'date' => now(),
            'status' => 'completed'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson("/api/activities/{$activity->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Activity deleted successfully']);

        // Verify activity is deleted
        $this->assertNull(Activity::find($activity->id));
    }

    /** @test */
    public function user_cannot_access_other_users_activities()
    {
        $otherUser = User::create([
            'name' => 'Other User',
            'email' => 'other@example.com',
            'password' => bcrypt('password123'),
            'api_token' => 'other_token',
        ]);

        $otherUserActivity = Activity::create([
            'user_id' => $otherUser->id,
            'title' => 'Other User Activity',
            'type' => 'Running',
            'duration' => 30,
            'calories_burned' => 300,
            'date' => now(),
            'status' => 'completed'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/activities/{$otherUserActivity->id}");

        $response->assertStatus(403);
    }
}