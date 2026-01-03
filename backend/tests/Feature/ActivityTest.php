<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Activity;
use Illuminate\Support\Str;

class ActivityTest extends TestCase
{
    private function actingAsUser()
    {
        $user = User::create([
            'name' => 'Aliya',
            'email' => 'aliya@example.com',
            'password' => 'password123',
        ]);

        $token = Str::random(60);
        $user->api_token = $token;
        $user->save();

        return [$user, $token];
    }

    public function test_user_can_create_activity()
    {
        [$user, $token] = $this->actingAsUser();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/activities', [
            'title' => 'Morning Run',
            'category' => 'Self-care',
            'sub_category' => 'Workout',
            'duration' => 30,
            'date' => '2024-01-15',
            'feeling' => 7,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('activities', ['title' => 'Morning Run']);
    }

    public function test_user_can_fetch_activities()
    {
        [$user, $token] = $this->actingAsUser();

        Activity::create([
            'user_id' => $user->_id,
            'title' => 'Study Session',
            'category' => 'Productivity',
            'sub_category' => 'Study',
            'duration' => 60,
            'date' => '2024-01-16',
            'feeling' => 6,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/activities');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    public function test_validation_fails_for_empty_title()
    {
        [$user, $token] = $this->actingAsUser();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/activities', [
            'title' => '',
            'category' => 'Self-care',
            'sub_category' => 'Workout',
            'duration' => 30,
            'date' => '2024-01-15',
            'feeling' => 5,
        ]);

        $response->assertStatus(422);
    }
}
