<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\CampusCollege;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
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
            'name' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'category' => fake()->randomElement(['private', 'government']),
            'purpose' => fake()->sentence(),
            'start_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'end_date' => fake()->dateTimeBetween('now', '+2 years'),
            'tags' => implode(',', fake()->words(3)),
            'leader' => fake()->name(),
            'deliverables' => fake()->sentence(),
            'agency_partner' => fake()->company(),
            'contact_person' => fake()->name(),
            'contact_email' => fake()->safeEmail(),
            'contact_phone' => fake()->phoneNumber(),
            'contact_address' => fake()->address(),
            'copyright' => fake()->randomElement(['yes', 'no', 'pending']),
            'ip_details' => fake()->paragraph(),
            'is_assessment_based' => fake()->boolean(),
            'monitoring_evaluation_plan' => fake()->paragraph(),
            'sustainability_plan' => fake()->paragraph(),
            'reporting_frequency' => fake()->numberBetween(1, 12),
            'attachment_path' => null,
            'attachment_link' => fake()->url(),
            'remarks' => fake()->sentence(),
            'is_archived' => false,
        ];
    }
}
