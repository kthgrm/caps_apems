<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;
    protected CampusCollege $campusCollege;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test data
        $campus = Campus::factory()->create();
        $college = College::factory()->create();
        $this->campusCollege = CampusCollege::factory()->create([
            'campus_id' => $campus->id,
            'college_id' => $college->id,
        ]);

        $this->admin = User::factory()->create([
            'is_admin' => true,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $this->regularUser = User::factory()->create([
            'is_admin' => false,
            'campus_college_id' => $this->campusCollege->id,
        ]);
    }

    public function test_admin_can_view_user_list()
    {
        $response = $this->actingAs($this->admin)->get('/admin/users');

        $response->assertStatus(200);
    }

    public function test_admin_can_view_specific_user()
    {
        $response = $this->actingAs($this->admin)->get("/admin/users/{$this->regularUser->id}");

        $response->assertStatus(200);
    }

    public function test_admin_can_create_new_user()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'is_admin' => false,
            'is_active' => true,
            'campus_college_id' => $this->campusCollege->id,
        ];

        $response = $this->actingAs($this->admin)->post('/admin/users', $userData);

        $response->assertRedirect('/admin/users');
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);
    }

    public function test_admin_can_update_user()
    {
        $updateData = [
            'name' => 'Updated Name',
            'email' => $this->regularUser->email,
            'is_admin' => false,
            'is_active' => true,
            'campus_college_id' => $this->campusCollege->id,
        ];

        $response = $this->actingAs($this->admin)
            ->put("/admin/users/{$this->regularUser->id}", $updateData);

        $response->assertRedirect('/admin/users');
        $this->assertDatabaseHas('users', [
            'id' => $this->regularUser->id,
            'name' => 'Updated Name',
        ]);
    }

    public function test_admin_can_toggle_user_admin_status()
    {
        $response = $this->actingAs($this->admin)
            ->patch("/admin/users/{$this->regularUser->id}/toggle-admin");

        $response->assertRedirect('/admin/users');
        $this->assertDatabaseHas('users', [
            'id' => $this->regularUser->id,
            'is_admin' => true,
        ]);
    }

    public function test_admin_cannot_toggle_own_admin_status()
    {
        $response = $this->actingAs($this->admin)
            ->patch("/admin/users/{$this->admin->id}/toggle-admin");

        $response->assertRedirect('/admin/users');
        $this->assertDatabaseHas('users', [
            'id' => $this->admin->id,
            'is_admin' => true, // Should remain admin
        ]);
    }

    public function test_admin_can_bulk_activate_users()
    {
        $inactiveUser = User::factory()->create([
            'is_active' => false,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->patch('/admin/users/bulk-activate', [
                'user_ids' => [$inactiveUser->id],
            ]);

        $response->assertRedirect('/admin/users');
        $this->assertDatabaseHas('users', [
            'id' => $inactiveUser->id,
            'is_active' => true,
        ]);
    }

    public function test_admin_can_bulk_deactivate_users()
    {
        $response = $this->actingAs($this->admin)
            ->patch('/admin/users/bulk-deactivate', [
                'user_ids' => [$this->regularUser->id],
            ]);

        $response->assertRedirect('/admin/users');
        $this->assertDatabaseHas('users', [
            'id' => $this->regularUser->id,
            'is_active' => false,
        ]);
    }

    public function test_admin_can_delete_user()
    {
        $userToDelete = User::factory()->create([
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->delete("/admin/users/{$userToDelete->id}");

        $response->assertRedirect('/admin/users');
        $this->assertDatabaseMissing('users', [
            'id' => $userToDelete->id,
        ]);
    }

    public function test_admin_cannot_delete_themselves()
    {
        $response = $this->actingAs($this->admin)
            ->delete("/admin/users/{$this->admin->id}");

        $response->assertRedirect('/admin/users');
        $this->assertDatabaseHas('users', [
            'id' => $this->admin->id,
        ]);
    }

    public function test_regular_user_cannot_access_user_management()
    {
        $response = $this->actingAs($this->regularUser)->get('/admin/users');

        $response->assertStatus(403);
    }

    public function test_user_list_filtering_by_admin_status()
    {
        $response = $this->actingAs($this->admin)
            ->get('/admin/users?is_admin=true');

        $response->assertStatus(200);
    }

    public function test_user_list_search_functionality()
    {
        $response = $this->actingAs($this->admin)
            ->get('/admin/users?search=' . $this->regularUser->name);

        $response->assertStatus(200);
    }
}