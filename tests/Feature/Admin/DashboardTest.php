<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test data
        $campus = Campus::factory()->create();
        $college = College::factory()->create();
        $campusCollege = CampusCollege::factory()->create([
            'campus_id' => $campus->id,
            'college_id' => $college->id,
        ]);
    }

    public function test_admin_can_access_dashboard()
    {
        $campusCollege = CampusCollege::factory()->create();
        $admin = User::factory()->create([
            'is_admin' => true,
            'campus_college_id' => $campusCollege->id,
        ]);

        $response = $this->actingAs($admin)->get('/admin/dashboard');

        $response->assertStatus(200);
    }

    public function test_regular_user_cannot_access_admin_dashboard()
    {
        $campusCollege = CampusCollege::factory()->create();
        $user = User::factory()->create([
            'is_admin' => false,
            'campus_college_id' => $campusCollege->id,
        ]);

        $response = $this->actingAs($user)->get('/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_admin_dashboard()
    {
        $response = $this->get('/admin/dashboard');

        $response->assertRedirect('/');
    }
}
