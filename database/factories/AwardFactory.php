<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\CampusCollege;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Award>
 */
class AwardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'campus_college_id' => CampusCollege::factory(),
            'award_name' => fake()->sentence(3) . ' Award',
            'description' => fake()->paragraph(),
            'level' => fake()->randomElement(['local', 'regional', 'national', 'international']),
            'date_received' => fake()->dateTimeBetween('-2 years', 'now'),
            'event_details' => fake()->sentence(),
            'location' => fake()->city() . ', ' . fake()->country(),
            'awarding_body' => fake()->company(),
            'people_involved' => fake()->name() . ', ' . fake()->name(),
            'attachment' => null,
            'is_archived' => false,
        ];
    }
}
