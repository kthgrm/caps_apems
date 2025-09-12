<?php

namespace Database\Seeders;

use App\Models\Resolution;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResolutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first user or create one
        $user = User::first();

        if (!$user) {
            $user = User::create([
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => bcrypt('password'),
                'campus_college_id' => 1,
                'is_admin' => true,
            ]);
        }

        $resolutions = [
            [
                'user_id' => $user->id,
                'resolution_number' => 'RES-2024-001',
                'year_of_effectivity' => Carbon::now()->subMonths(6),
                'expiration' => Carbon::now()->addMonths(18),
                'contact_person' => 'Maria Santos',
                'contact_number_email' => 'maria.santos@university.edu.ph',
                'partner_agency_organization' => 'Department of Science and Technology',
            ],
            [
                'user_id' => $user->id,
                'resolution_number' => 'RES-2024-002',
                'year_of_effectivity' => Carbon::now()->subMonths(3),
                'expiration' => Carbon::now()->addDays(15), // Expiring soon
                'contact_person' => 'Juan dela Cruz',
                'contact_number_email' => '+63912-345-6789',
                'partner_agency_organization' => 'Department of Trade and Industry',
            ],
            [
                'user_id' => $user->id,
                'resolution_number' => 'RES-2023-015',
                'year_of_effectivity' => Carbon::now()->subYear(),
                'expiration' => Carbon::now()->subDays(30), // Expired
                'contact_person' => 'Anna Reyes',
                'contact_number_email' => 'anna.reyes@dti.gov.ph',
                'partner_agency_organization' => 'Philippine Council for Industry, Energy and Emerging Technology',
            ],
            [
                'user_id' => $user->id,
                'resolution_number' => 'RES-2024-003',
                'year_of_effectivity' => Carbon::now()->subMonths(2),
                'expiration' => Carbon::now()->addYear(),
                'contact_person' => 'Dr. Roberto Garcia',
                'contact_number_email' => 'roberto.garcia@dilg.gov.ph',
                'partner_agency_organization' => 'Department of the Interior and Local Government',
            ],
            [
                'user_id' => $user->id,
                'resolution_number' => 'RES-2024-004',
                'year_of_effectivity' => Carbon::now()->subMonth(),
                'expiration' => Carbon::now()->addMonths(6),
                'contact_person' => 'Lisa Mendoza',
                'contact_number_email' => 'lisa.mendoza@deped.gov.ph',
                'partner_agency_organization' => 'Department of Education',
            ]
        ];

        foreach ($resolutions as $resolution) {
            Resolution::create($resolution);
        }
    }
}
