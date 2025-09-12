<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\User;
use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuditLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $projects = Project::all();

        if ($users->isEmpty()) {
            return;
        }

        // Sample audit log entries
        $auditLogs = [
            [
                'user_type' => 'App\Models\User',
                'user_id' => $users->random()->id,
                'action' => 'login',
                'auditable_type' => null,
                'auditable_id' => null,
                'old_values' => null,
                'new_values' => null,
                'ip_address' => '192.168.1.100',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'description' => 'User logged into the system',
                'created_at' => now()->subMinutes(30),
            ],
            [
                'user_type' => 'App\Models\User',
                'user_id' => $users->random()->id,
                'action' => 'create',
                'auditable_type' => 'App\Models\Project',
                'auditable_id' => $projects->first()?->id,
                'old_values' => null,
                'new_values' => [
                    'title' => 'New Technology Transfer Project',
                    'description' => 'A sample project for testing',
                    'status' => 'active'
                ],
                'ip_address' => '192.168.1.101',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'description' => 'Created a new project',
                'created_at' => now()->subMinutes(25),
            ],
            [
                'user_type' => 'App\Models\User',
                'user_id' => $users->random()->id,
                'action' => 'update',
                'auditable_type' => 'App\Models\Project',
                'auditable_id' => $projects->first()?->id,
                'old_values' => [
                    'title' => 'Old Project Title',
                    'status' => 'draft'
                ],
                'new_values' => [
                    'title' => 'Updated Project Title',
                    'status' => 'active'
                ],
                'ip_address' => '192.168.1.102',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'description' => 'Updated project details',
                'created_at' => now()->subMinutes(20),
            ],
            [
                'user_type' => 'App\Models\User',
                'user_id' => $users->random()->id,
                'action' => 'delete',
                'auditable_type' => 'App\Models\Project',
                'auditable_id' => null,
                'old_values' => [
                    'title' => 'Deleted Project',
                    'description' => 'This project was removed',
                    'status' => 'inactive'
                ],
                'new_values' => null,
                'ip_address' => '192.168.1.103',
                'user_agent' => 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36',
                'description' => 'Deleted a project',
                'created_at' => now()->subMinutes(15),
            ],
            [
                'user_type' => 'App\Models\User',
                'user_id' => $users->random()->id,
                'action' => 'logout',
                'auditable_type' => null,
                'auditable_id' => null,
                'old_values' => null,
                'new_values' => null,
                'ip_address' => '192.168.1.100',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'description' => 'User logged out of the system',
                'created_at' => now()->subMinutes(10),
            ],
        ];

        foreach ($auditLogs as $logData) {
            AuditLog::create($logData);
        }
    }
}
