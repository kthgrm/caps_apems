<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\CampusCollege;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InternationalPartner>
 */
class InternationalPartnerFactory extends Factory
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
            'agency_partner' => fake()->company(),
            'location' => fake()->city() . ', ' . fake()->country(),
            'activity_conducted' => fake()->sentence(),
            'start_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'end_date' => fake()->dateTimeBetween('now', '+1 year'),
            'number_of_participants' => fake()->numberBetween(10, 100),
            'number_of_committee' => fake()->numberBetween(3, 15),
            'narrative' => fake()->paragraph(),
            'attachment' => null,
            'is_archived' => false,
        ];
    }
}
