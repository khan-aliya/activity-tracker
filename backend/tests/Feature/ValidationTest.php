<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;

class ValidationTest extends TestCase
{
    protected $user;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();

        \App\Models\User::truncate();
        \App\Models\Activity::truncate();

        $this->user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $this->token = $loginResponse->json('token');
    }

    /** @test */
    public function it_validates_activity_creation_required_fields()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/activities', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'title',
                'category',
                'sub_category',
                'duration',
                'date',
                'feeling'
            ]);
    }

    /** @test */
    public function it_validates_activity_title_max_length()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/activities', [
            'title' => str_repeat('a', 256),
            'category' => 'Self-care',
            'sub_category' => 'Workout',
            'duration' => 30,
            'date' => '2024-01-01',
            'feeling' => 5,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    /** @test */
    public function it_validates_feeling_range()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/activities', [
            'title' => 'Valid Title',
            'category' => 'Self-care',
            'sub_category' => 'Workout',
            'duration' => 30,
            'date' => '2024-01-01',
            'feeling' => 99,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['feeling']);
    }
}
