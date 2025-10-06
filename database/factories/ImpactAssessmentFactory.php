<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ImpactAssessment>
 */
class ImpactAssessmentFactory extends Factory
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
            'beneficiary' => fake()->randomElement(['Students', 'Faculty', 'Community', 'Industry', 'Government']),
            'num_direct_beneficiary' => fake()->numberBetween(10, 1000),
            'num_indirect_beneficiary' => fake()->numberBetween(100, 5000),
            'geographic_coverage' => fake()->randomElement(['Local', 'Regional', 'National', 'International']),
            'is_archived' => false,
        ];
    }
}
