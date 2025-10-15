<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CampusManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;
    protected Campus $campus;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['is_admin' => true]);
        $this->regularUser = User::factory()->create(['is_admin' => false]);
        $this->campus = Campus::factory()->create();
    }

    /**
     * 
     * @jira TC-001
     */
    public function test_admin_can_view_campus_index()
    {
        $response = $this->withoutVite()->actingAs($this->admin)->get('/admin/campus');

        $response->assertStatus(200);
    }

    /**
     * 
     * @jira TC-002
     */
    public function test_admin_can_view_create_campus_form()
    {
        $response = $this->withoutVite()->actingAs($this->admin)->get('/admin/campus/create');

        $response->assertStatus(200);
    }

    /**
     * 
     * @jira TC-003
     */
    public function test_admin_can_create_campus()
    {
        $campusData = [
            'name' => 'Test Campus',
            'logo' => UploadedFile::fake()->create('campus-logo.jpg', 100, 'image/jpeg'),
        ];

        $response = $this->actingAs($this->admin)
            ->post('/admin/campus', $campusData);

        $response->assertRedirect('/admin/campus');
        $this->assertDatabaseHas('campuses', [
            'name' => 'Test Campus',
        ]);
    }

    /**
     * 
     * @jira TC-004
     */
    public function test_admin_can_view_specific_campus()
    {
        $response = $this->withoutVite()->actingAs($this->admin)
            ->get("/admin/campus/{$this->campus->id}");

        $response->assertStatus(200);
    }

    /**
     * 
     * @jira TC-005
     */
    public function test_admin_can_view_edit_campus_form()
    {
        $response = $this->withoutVite()->actingAs($this->admin)
            ->get("/admin/campus/{$this->campus->id}/edit");

        $response->assertStatus(200);
    }

    /**
     * 
     * @jira TC-006
     */
    public function test_admin_can_update_campus()
    {
        $updateData = [
            'name' => 'Updated Campus Name',
        ];

        $response = $this->actingAs($this->admin)
            ->patch("/admin/campus/{$this->campus->id}", $updateData);

        $response->assertRedirect("/admin/campus/{$this->campus->id}");
        $this->assertDatabaseHas('campuses', [
            'id' => $this->campus->id,
            'name' => 'Updated Campus Name',
        ]);
    }

    /**
     * 
     * @jira TC-007
     */
    public function test_admin_can_delete_campus()
    {
        $campusToDelete = Campus::factory()->create();

        $deleteData = [
            'password' => 'password', // Default password from UserFactory
        ];

        $response = $this->actingAs($this->admin)
            ->delete("/admin/campus/{$campusToDelete->id}", $deleteData);

        $response->assertRedirect('/admin/campus');
        $this->assertDatabaseMissing('campuses', [
            'id' => $campusToDelete->id,
        ]);
    }

    /** 
     * 
     * @jira TC-008
     */
    public function test_regular_user_cannot_access_campus_management()
    {
        $response = $this->actingAs($this->regularUser)->get('/admin/campus');

        $response->assertStatus(403);
    }

    /**
     * 
     * @jira TC-009
     */
    public function test_unauthenticated_user_cannot_access_campus_management()
    {

        $response = $this->get('/admin/campus');

        $response->assertRedirect('/');
    }

    /**
     * 
     * @jira TC-010
     */
    public function test_admin_cannot_create_campus_with_invalid_data()
    {
        $invalidData = [
            'name' => '', // Required field empty
        ];

        $response = $this->actingAs($this->admin)
            ->post('/admin/campus', $invalidData);

        $response->assertSessionHasErrors(['name']);
    }
}
