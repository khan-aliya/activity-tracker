<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    protected $model = Activity::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(3),
            'category' => $this->faker->randomElement(['Self-care', 'Productivity', 'Reward']),
            'sub_category' => 'Workout',
            'duration' => $this->faker->numberBetween(1, 120),
            'date' => now()->format('Y-m-d'),
            'feeling' => $this->faker->numberBetween(1, 10),
            'notes' => $this->faker->sentence(),
            'status' => 'completed',
        ];
    }
}
