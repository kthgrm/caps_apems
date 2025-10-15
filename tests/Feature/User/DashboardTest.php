<?php

namespace Tests\Feature\User;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected User $admin;

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

        $this->user = User::factory()->create([
            'is_admin' => false,
        ]);

        $this->admin = User::factory()->create([
            'is_admin' => true,
        ]);
    }

    public function test_user_can_access_dashboard()
    {
        $response = $this->actingAs($this->user)->get('/user/dashboard');

        $response->assertStatus(200);
    }

    public function test_admin_cannot_access_user_dashboard()
    {
        $response = $this->actingAs($this->admin)->get('/user/dashboard');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_user_dashboard()
    {
        $response = $this->get('/user/dashboard');

        $response->assertRedirect('/');
    }
}
