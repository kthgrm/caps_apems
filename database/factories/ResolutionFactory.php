<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Resolution>
 */
class ResolutionFactory extends Factory
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
            'resolution_number' => 'RES-' . fake()->unique()->numberBetween(1000, 9999),
            'year_of_effectivity' => fake()->dateTimeBetween('-2 years', 'now'),
            'expiration' => fake()->dateTimeBetween('now', '+5 years'),
            'contact_person' => fake()->name(),
            'contact_number_email' => fake()->randomElement([fake()->phoneNumber(), fake()->safeEmail()]),
            'partner_agency_organization' => fake()->company(),
        ];
    }
}
