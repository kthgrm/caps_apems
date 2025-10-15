<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use App\Models\Resolution;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResolutionTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;
    protected CampusCollege $campusCollege;
    protected Resolution $resolution;

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

        $this->resolution = Resolution::factory()->create();
    }

    public function test_admin_can_view_resolutions_index()
    {
        $response = $this->actingAs($this->admin)->get('/admin/resolutions');

        $response->assertStatus(200);
    }

    public function test_admin_can_view_create_resolution_form()
    {
        $response = $this->actingAs($this->admin)->get('/admin/resolutions/create');

        $response->assertStatus(200);
    }

    public function test_admin_can_create_resolution()
    {
        $resolutionData = [
            'resolution_number' => 'RES-TEST-001',
            'year_of_effectivity' => now()->format('Y-m-d'),
            'expiration' => now()->addYears(2)->format('Y-m-d'),
            'contact_person' => 'John Doe',
            'contact_number_email' => 'john.doe@example.com',
            'partner_agency_organization' => 'Test Agency',
        ];

        $response = $this->actingAs($this->admin)
            ->post('/admin/resolutions', $resolutionData);

        $response->assertRedirect();
        $this->assertDatabaseHas('resolutions', [
            'resolution_number' => 'RES-TEST-001',
        ]);
    }

    public function test_admin_can_view_specific_resolution()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/resolutions/{$this->resolution->id}");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_edit_resolution_form()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/resolutions/{$this->resolution->id}/edit");

        $response->assertStatus(200);
    }

    public function test_admin_can_update_resolution()
    {
        $updateData = [
            'resolution_number' => 'RES-UPDATED-001',
            'year_of_effectivity' => $this->resolution->year_of_effectivity->format('Y-m-d'),
            'expiration' => $this->resolution->expiration->format('Y-m-d'),
            'contact_person' => $this->resolution->contact_person,
            'contact_number_email' => $this->resolution->contact_number_email,
            'partner_agency_organization' => $this->resolution->partner_agency_organization,
        ];

        $response = $this->actingAs($this->admin)
            ->put("/admin/resolutions/{$this->resolution->id}", $updateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('resolutions', [
            'id' => $this->resolution->id,
            'resolution_number' => 'RES-UPDATED-001',
        ]);
    }

    public function test_admin_can_archive_resolution()
    {
        $response = $this->actingAs($this->admin)
            ->patch("/admin/resolutions/{$this->resolution->id}/archive", [
                'password' => 'password' // Using default test password
            ]);

        $response->assertRedirect('/admin/resolutions');
        $this->assertDatabaseHas('resolutions', [
            'id' => $this->resolution->id,
            'is_archived' => 1,
        ]);
    }

    public function test_regular_user_cannot_access_admin_resolutions()
    {
        $response = $this->actingAs($this->regularUser)
            ->get('/admin/resolutions');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_admin_resolutions()
    {
        $response = $this->get('/admin/resolutions');

        $response->assertRedirect('/');
    }

    public function test_admin_cannot_create_resolution_with_invalid_data()
    {
        $invalidData = [
            'resolution_number' => '', // Required field empty
            'year_of_effectivity' => now()->format('Y-m-d'),
            'expiration' => now()->addYears(2)->format('Y-m-d'),
            'contact_person' => 'John Doe',
            'contact_number_email' => 'john.doe@example.com',
            'partner_agency_organization' => 'Test Agency',
        ];

        $response = $this->actingAs($this->admin)
            ->post('/admin/resolutions', $invalidData);

        $response->assertSessionHasErrors(['resolution_number']);
    }
}
