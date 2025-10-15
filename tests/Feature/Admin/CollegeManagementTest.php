<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollegeManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;
    protected Campus $campus;
    protected College $college;
    protected CampusCollege $campusCollege;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['is_admin' => true]);
        $this->regularUser = User::factory()->create(['is_admin' => false]);
        $this->campus = Campus::factory()->create();
        $this->college = College::factory()->create();
        $this->campusCollege = CampusCollege::factory()->create([
            'campus_id' => $this->campus->id,
            'college_id' => $this->college->id,
        ]);
    }

    /**
     * @jira TC-020
     */
    public function test_admin_can_view_college_index()
    {
        $response = $this->withoutVite()
            ->actingAs($this->admin)
            ->get('/admin/college');

        $response->assertStatus(200);
    }

    /**
     * @jira TC-021
     */
    public function test_admin_can_view_create_college_form()
    {
        $response = $this->withoutVite()
            ->actingAs($this->admin)
            ->get('/admin/college/create');

        $response->assertStatus(200);
    }

    /**
     * @jira TC-022
     */
    public function test_admin_can_create_college()
    {
        $collegeData = [
            'name' => 'Test College',
            'code' => 'TEST',
            'campus_id' => $this->campus->id,
            'logo' => UploadedFile::fake()->create('college-logo.jpg', 100, 'image/jpeg'),
        ];

        $response = $this->withoutVite()
            ->actingAs($this->admin)
            ->post('/admin/college', $collegeData);

        $response->assertRedirect("/admin/college/campus/{$this->campus->id}");
        $this->assertDatabaseHas('colleges', [
            'name' => 'Test College',
            'code' => 'TEST',
        ]);
    }

    /**
     * @jira TC-023
     */
    public function test_admin_can_view_specific_college()
    {
        $response = $this->withoutVite()
            ->actingAs($this->admin)
            ->get("/admin/college/{$this->campusCollege->id}");

        $response->assertStatus(200);
    }

    /**
     * @jira TC-024
     */
    public function test_admin_can_view_edit_college_form()
    {
        $response = $this->withoutVite()
            ->actingAs($this->admin)
            ->get("/admin/college/college/{$this->college->id}/edit");

        $response->assertStatus(200);
    }

    /**
     * @jira TC-025
     */
    public function test_admin_can_update_college()
    {
        $updateData = [
            'name' => 'Updated College Name',
            'code' => $this->college->code,
            'campus_id' => $this->campus->id,
            'logo' => UploadedFile::fake()->create('updated-logo.jpg', 100, 'image/jpeg'),
        ];

        $response = $this->withoutVite()
            ->actingAs($this->admin)
            ->put("/admin/college/college/{$this->college->id}", $updateData);

        $response->assertRedirect("/admin/college/campus/{$this->campus->id}");
        $this->assertDatabaseHas('colleges', [
            'id' => $this->college->id,
            'name' => 'Updated College Name',
        ]);
    }

    /**
     * @jira TC-026
     */
    public function test_admin_can_delete_college()
    {
        $collegeToDelete = College::factory()->create();

        $deleteData = [
            'password' => 'password', // Default factory password
        ];

        $response = $this->withoutVite()
            ->actingAs($this->admin)
            ->delete("/admin/college/college/{$collegeToDelete->id}", $deleteData);

        $response->assertRedirect('/admin/college');
        $this->assertDatabaseMissing('colleges', [
            'id' => $collegeToDelete->id,
        ]);
    }

    /**
     * @jira TC-027
     */
    public function test_admin_can_filter_colleges_by_campus()
    {
        $response = $this->withoutVite()
            ->actingAs($this->admin)
            ->get("/admin/college/campus/{$this->campus->id}");

        $response->assertStatus(200);
    }

    /**
     * @jira TC-028
     */
    public function test_regular_user_cannot_access_college_management()
    {
        $response = $this->withoutVite()
            ->actingAs($this->regularUser)
            ->get('/admin/college');

        $response->assertStatus(403);
    }

    /**
     * @jira TC-029
     */
    public function test_unauthenticated_user_cannot_access_college_management()
    {
        $response = $this->withoutVite()
            ->get('/admin/college');

        $response->assertRedirect('/');
    }

    /**
     * @jira TC-030
     */
    public function test_admin_cannot_create_college_with_invalid_data()
    {
        $invalidData = [
            'name' => '', // Required field empty
        ];

        $response = $this->withoutVite()
            ->actingAs($this->admin)
            ->post('/admin/college', $invalidData);

        $response->assertSessionHasErrors(['name']);
    }

    /**
     * @jira TC-031
     */
    public function test_admin_cannot_create_college_with_duplicate_code()
    {
        $existingCollege = College::factory()->create(['code' => 'DUPLICATE']);

        $collegeData = [
            'name' => 'Another College',
            'code' => 'DUPLICATE', // Same code as existing college
            'campus_id' => $this->campus->id,
            'logo' => UploadedFile::fake()->create('college-logo.jpg', 100, 'image/jpeg'),
        ];

        $response = $this->withoutVite()
            ->actingAs($this->admin)
            ->post('/admin/college', $collegeData);

        $response->assertSessionHasErrors(['code']);
    }

    /**
     * @jira TC-032
     */
    public function test_admin_cannot_create_college_with_invalid_file_type()
    {
        $collegeData = [
            'name' => 'Test College',
            'code' => 'TEST',
            'campus_id' => $this->campus->id,
            'logo' => UploadedFile::fake()->create('malicious.exe', 100, 'application/exe'),
        ];

        $response = $this->withoutVite()
            ->actingAs($this->admin)
            ->post('/admin/college', $collegeData);

        $response->assertSessionHasErrors(['logo']);
    }
}
