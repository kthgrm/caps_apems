<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use App\Models\ImpactAssessment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ImpactAssessmentTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;
    protected Campus $campus;
    protected College $college;
    protected CampusCollege $campusCollege;
    protected ImpactAssessment $assessment;

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

        $this->assessment = ImpactAssessment::factory()->create([
            'user_id' => $this->regularUser->id,
        ]);
    }

    public function test_admin_can_view_impact_assessment_campuses()
    {
        $response = $this->actingAs($this->admin)->get('/admin/impact-assessment');

        $response->assertStatus(200);
    }

    public function test_admin_can_view_colleges_for_specific_campus()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/impact-assessment/{$this->campus->id}");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_assessments_for_campus_college()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/impact-assessment/{$this->campus->id}/{$this->college->id}/assessments");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_specific_assessment()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/impact-assessment/assessments/{$this->assessment->id}");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_assessment_edit_form()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/impact-assessment/assessments/{$this->assessment->id}/edit");

        $response->assertStatus(200);
    }

    public function test_admin_can_update_assessment()
    {
        $updateData = [
            'project_id' => $this->assessment->project_id,
            'beneficiary' => 'Updated Community',
            'num_direct_beneficiary' => 500,
            'num_indirect_beneficiary' => 2000,
            'geographic_coverage' => 'National',
        ];

        $response = $this->actingAs($this->admin)
            ->put("/admin/impact-assessment/assessments/{$this->assessment->id}", $updateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('impact_assessments', [
            'id' => $this->assessment->id,
            'beneficiary' => 'Updated Community',
            'num_direct_beneficiary' => 500,
        ]);
    }

    public function test_admin_can_archive_assessment()
    {
        $response = $this->actingAs($this->admin)
            ->patch("/admin/impact-assessment/{$this->assessment->id}/archive", [
                'password' => 'password', // Default test password
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('impact_assessments', [
            'id' => $this->assessment->id,
            'is_archived' => true,
        ]);
    }

    public function test_regular_user_cannot_access_admin_impact_assessments()
    {
        $response = $this->actingAs($this->regularUser)
            ->get('/admin/impact-assessment');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_admin_impact_assessments()
    {
        $response = $this->get('/admin/impact-assessment');

        $response->assertRedirect('/');
    }

    public function test_admin_can_view_assessments_filtered_by_campus()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/impact-assessment/{$this->campus->id}");

        $response->assertStatus(200);
    }

    public function test_admin_assessment_routes_require_valid_ids()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/impact-assessment/assessments/99999");

        $response->assertStatus(404);
    }

    public function test_admin_can_view_assessments_with_filters()
    {
        // Test with date filter
        $response = $this->actingAs($this->admin)
            ->get("/admin/impact-assessment/{$this->campus->id}/{$this->college->id}/assessments?start_date=" . now()->subYear()->format('Y-m-d'));

        $response->assertStatus(200);

        // Test with status filter
        $response = $this->actingAs($this->admin)
            ->get("/admin/impact-assessment/{$this->campus->id}/{$this->college->id}/assessments?status=completed");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_assessment_analytics()
    {
        // Create multiple assessments for analytics
        ImpactAssessment::factory()->count(5)->create([
            'user_id' => $this->regularUser->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get("/admin/impact-assessment/{$this->campus->id}/{$this->college->id}/assessments");

        $response->assertStatus(200);
    }

    public function test_admin_cannot_update_assessment_with_invalid_data()
    {
        $invalidData = [
            'beneficiary' => '', // Required field empty
            'project_id' => 'invalid', // Should be existing project ID
            'num_direct_beneficiary' => 'not_a_number', // Should be integer
        ];

        $response = $this->actingAs($this->admin)
            ->put("/admin/impact-assessment/assessments/{$this->assessment->id}", $invalidData);

        $response->assertSessionHasErrors(['beneficiary', 'project_id', 'num_direct_beneficiary']);
    }

    public function test_admin_can_view_assessment_history()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/impact-assessment/assessments/{$this->assessment->id}");

        $response->assertStatus(200);
    }
}
