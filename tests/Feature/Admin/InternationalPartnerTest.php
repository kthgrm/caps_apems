<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use App\Models\InternationalPartner;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InternationalPartnerTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;
    protected Campus $campus;
    protected College $college;
    protected CampusCollege $campusCollege;
    protected InternationalPartner $partnership;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();

        // Create test data
        $this->campus = Campus::factory()->create();
        $this->college = College::factory()->create();
        $this->campusCollege = CampusCollege::factory()->create([
            'campus_id' => $this->campus->id,
            'college_id' => $this->college->id,
        ]);

        $this->admin = User::factory()->create([
            'is_admin' => true,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $this->regularUser = User::factory()->create([
            'is_admin' => false,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $this->partnership = InternationalPartner::factory()->create([
            'user_id' => $this->regularUser->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);
    }

    public function test_admin_can_view_international_partners_campuses()
    {
        $response = $this->actingAs($this->admin)->get('/admin/international-partners');

        $response->assertStatus(200);
    }

    public function test_admin_can_view_colleges_for_specific_campus()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/international-partners/{$this->campus->id}");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_partnerships_for_campus_college()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/international-partners/{$this->campus->id}/{$this->college->id}/partnerships");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_specific_partnership()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/international-partners/partnerships/{$this->partnership->id}");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_partnership_edit_form()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/international-partners/partnerships/{$this->partnership->id}/edit");

        $response->assertStatus(200);
    }

    public function test_admin_can_update_partnership()
    {
        $updateData = [
            'agency_partner' => 'Updated Agency Partner',
            'location' => $this->partnership->location,
            'activity_conducted' => $this->partnership->activity_conducted,
            'start_date' => $this->partnership->start_date,
            'end_date' => $this->partnership->end_date,
            'number_of_participants' => $this->partnership->number_of_participants,
            'number_of_committee' => $this->partnership->number_of_committee,
            'narrative' => $this->partnership->narrative,
        ];

        $response = $this->actingAs($this->admin)
            ->put("/admin/international-partners/partnerships/{$this->partnership->id}", $updateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('international_partners', [
            'id' => $this->partnership->id,
            'agency_partner' => 'Updated Agency Partner',
        ]);
    }

    public function test_admin_can_archive_partnership()
    {
        $response = $this->actingAs($this->admin)
            ->patch("/admin/international-partners/partnerships/{$this->partnership->id}/archive", [
                'password' => 'password' // Default password from UserFactory
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('international_partners', [
            'id' => $this->partnership->id,
            'is_archived' => true,
        ]);
    }

    public function test_regular_user_cannot_access_admin_international_partners()
    {
        $response = $this->actingAs($this->regularUser)
            ->get('/admin/international-partners');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_admin_international_partners()
    {
        $response = $this->get('/admin/international-partners');

        $response->assertRedirect('/');
    }

    public function test_admin_can_view_partnerships_filtered_by_campus()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/international-partners/{$this->campus->id}");

        $response->assertStatus(200);
    }

    public function test_admin_partnership_routes_require_valid_ids()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/international-partners/partnerships/99999");

        $response->assertStatus(404);
    }

    public function test_admin_can_view_partnerships_with_filters()
    {
        // Test with country filter
        $response = $this->actingAs($this->admin)
            ->get("/admin/international-partners/{$this->campus->id}/{$this->college->id}/partnerships?country=USA");

        $response->assertStatus(200);

        // Test with partnership type filter
        $response = $this->actingAs($this->admin)
            ->get("/admin/international-partners/{$this->campus->id}/{$this->college->id}/partnerships?type=academic");

        $response->assertStatus(200);
    }
}
