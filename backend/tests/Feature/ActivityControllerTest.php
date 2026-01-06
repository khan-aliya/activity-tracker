<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Activity;


class ActivityControllerTest extends TestCase
{
    public function setUp(): void
{
    parent::setUp();

    \App\Models\User::truncate();
    \App\Models\Activity::truncate();
}


    private function authHeaders($user)
    {
        return ['Authorization' => 'Bearer ' . $user->api_token];
    }

    public function test_index_requires_authentication()
    {
        $response = $this->getJson('/api/activities');
        $response->assertStatus(401);
    }

    public function test_index_filters_by_date_range()
    {
        $user = User::factory()->create(['api_token' => 'abc123']);

        Activity::factory()->create([
            'user_id' => $user->_id,
            'date' => '2024-01-01'
        ]);

        Activity::factory()->create([
            'user_id' => $user->_id,
            'date' => '2024-02-01'
        ]);

        $response = $this->getJson('/api/activities?start_date=2024-01-01&end_date=2024-01-31', $this->authHeaders($user));

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_store_validation_fails()
    {
        $user = User::factory()->create(['api_token' => 'abc123']);

        $response = $this->postJson('/api/activities', [], $this->authHeaders($user));

        $response->assertStatus(422);
        $response->assertJsonStructure(['errors']);
    }

    public function test_store_creates_activity()
    {
        $user = User::factory()->create(['api_token' => 'abc123']);

        $payload = [
            'title' => 'Test Activity',
            'category' => 'Self-care',
            'sub_category' => 'Workout',
            'duration' => 30,
            'date' => '2024-01-01',
            'feeling' => 5,
        ];

        $response = $this->postJson('/api/activities', $payload, $this->authHeaders($user));

        $response->assertStatus(201);
        $response->assertJsonStructure(['activity']);
    }

    public function test_show_returns_404_for_missing_activity()
    {
        $user = User::factory()->create(['api_token' => 'abc123']);

        $response = $this->getJson('/api/activities/999', $this->authHeaders($user));

        $response->assertStatus(404);
    }

    public function test_show_returns_403_for_wrong_user()
    {
        $user1 = User::factory()->create(['api_token' => 'abc123']);
        $user2 = User::factory()->create(['api_token' => 'xyz789']);

        $activity = Activity::factory()->create(['user_id' => $user1->_id]);

        $response = $this->getJson('/api/activities/' . $activity->_id, $this->authHeaders($user2));

        $response->assertStatus(403);
    }

    public function test_update_validation_fails()
    {
        $user = User::factory()->create(['api_token' => 'abc123']);
        $activity = Activity::factory()->create(['user_id' => $user->_id]);

        $response = $this->putJson('/api/activities/' . $activity->_id, [
            'duration' => -10
        ], $this->authHeaders($user));

        $response->assertStatus(422);
    }

    public function test_update_works()
    {
        $user = User::factory()->create(['api_token' => 'abc123']);
        $activity = Activity::factory()->create(['user_id' => $user->_id]);

        $response = $this->putJson('/api/activities/' . $activity->_id, [
            'title' => 'Updated Title'
        ], $this->authHeaders($user));

        $response->assertStatus(200);
        $this->assertEquals('Updated Title', $response->json('activity.title'));
    }

    public function test_destroy_works()
    {
        $user = User::factory()->create(['api_token' => 'abc123']);
        $activity = Activity::factory()->create(['user_id' => $user->_id]);

        $response = $this->deleteJson('/api/activities/' . $activity->_id, [], $this->authHeaders($user));

        $response->assertStatus(200);
    }
}
