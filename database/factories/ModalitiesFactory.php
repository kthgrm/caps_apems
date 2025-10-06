<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Modalities>
 */
class ModalitiesFactory extends Factory
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
            'project_id' => Project::factory(),
            'modality' => fake()->randomElement(['TV', 'Radio', 'Online', 'Print', 'Face-to-face']),
            'tv_channel' => fake()->optional()->randomElement(['ABS-CBN', 'GMA', 'TV5', 'CNN Philippines']),
            'radio' => fake()->optional()->randomElement(['DZBB', 'DZMM', 'Radyo Patrol', 'DWIZ']),
            'online_link' => fake()->optional()->url(),
            'time_air' => fake()->optional()->time(),
            'period' => fake()->optional()->randomElement(['Daily', 'Weekly', 'Monthly', 'Quarterly']),
            'partner_agency' => fake()->optional()->company(),
            'hosted_by' => fake()->optional()->name(),
            'is_archived' => false,
        ];
    }
}
