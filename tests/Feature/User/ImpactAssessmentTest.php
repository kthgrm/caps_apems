<?php

namespace Tests\Feature\User;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use App\Models\ImpactAssessment;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ImpactAssessmentTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected User $admin;
    protected User $otherUser;
    protected CampusCollege $campusCollege;
    protected ImpactAssessment $assessment;
    protected Project $project;

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

        $this->user = User::factory()->create([
            'is_admin' => false,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $this->admin = User::factory()->create([
            'is_admin' => true,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $this->otherUser = User::factory()->create([
            'is_admin' => false,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        // Create a project for the required relationship
        $this->project = Project::factory()->create([
            'user_id' => $this->user->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $this->assessment = ImpactAssessment::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);
    }

    public function test_user_can_view_impact_assessments_index()
    {
        $response = $this->actingAs($this->user)->get('/user/impact-assessments');

        $response->assertStatus(200);
    }

    public function test_user_can_view_create_assessment_form()
    {
        $response = $this->actingAs($this->user)->get('/user/impact-assessments/create');

        $response->assertStatus(200);
    }

    public function test_user_can_create_impact_assessment()
    {
        $assessmentData = [
            'project_id' => $this->project->id,
            'beneficiary' => 'Local community members',
            'geographic_coverage' => 'Metropolitan area',
            'num_direct_beneficiary' => 150,
            'num_indirect_beneficiary' => 500,
        ];

        $response = $this->actingAs($this->user)
            ->post('/user/impact-assessments', $assessmentData);

        $response->assertRedirect('/user/impact-assessments');
        $this->assertDatabaseHas('impact_assessments', [
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_user_can_view_own_assessment()
    {
        $response = $this->actingAs($this->user)
            ->get("/user/impact-assessments/{$this->assessment->id}");

        $response->assertStatus(200);
    }

    public function test_user_can_view_edit_own_assessment()
    {
        $response = $this->actingAs($this->user)
            ->get("/user/impact-assessments/{$this->assessment->id}/edit");

        $response->assertStatus(200);
    }

    public function test_user_can_update_own_assessment()
    {
        $updateData = [
            'project_id' => $this->assessment->project_id,
            'beneficiary' => 'Updated beneficiary group',
            'geographic_coverage' => $this->assessment->geographic_coverage,
            'num_direct_beneficiary' => $this->assessment->num_direct_beneficiary,
            'num_indirect_beneficiary' => $this->assessment->num_indirect_beneficiary,
        ];

        $response = $this->actingAs($this->user)
            ->put("/user/impact-assessments/{$this->assessment->id}", $updateData);

        $response->assertRedirect("/user/impact-assessments/{$this->assessment->id}");
        $this->assertDatabaseHas('impact_assessments', [
            'id' => $this->assessment->id,
            'beneficiary' => 'Updated beneficiary group',
        ]);
    }

    public function test_user_can_archive_own_assessment()
    {
        $response = $this->actingAs($this->user)
            ->patch("/user/impact-assessments/{$this->assessment->id}/archive", [
                'password' => 'password'
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('impact_assessments', [
            'id' => $this->assessment->id,
            'is_archived' => true,
        ]);
    }

    public function test_user_cannot_view_other_users_assessment()
    {
        $otherAssessment = ImpactAssessment::factory()->create([
            'user_id' => $this->otherUser->id,
            'project_id' => $this->project->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get("/user/impact-assessments/{$otherAssessment->id}");

        $response->assertStatus(403);
    }

    public function test_user_cannot_edit_other_users_assessment()
    {
        $otherAssessment = ImpactAssessment::factory()->create([
            'user_id' => $this->otherUser->id,
            'project_id' => $this->project->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get("/user/impact-assessments/{$otherAssessment->id}/edit");

        $response->assertStatus(403);
    }

    public function test_user_cannot_update_other_users_assessment()
    {
        $otherAssessment = ImpactAssessment::factory()->create([
            'user_id' => $this->otherUser->id,
            'project_id' => $this->project->id,
        ]);

        $updateData = [
            'beneficiary' => 'Hacked beneficiary',
        ];

        $response = $this->actingAs($this->user)
            ->put("/user/impact-assessments/{$otherAssessment->id}", $updateData);

        $response->assertStatus(403);
    }

    public function test_admin_cannot_access_user_impact_assessments()
    {
        $response = $this->actingAs($this->admin)->get('/user/impact-assessments');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_user_impact_assessments()
    {
        $response = $this->get('/user/impact-assessments');

        $response->assertRedirect('/');
    }

    public function test_user_cannot_create_assessment_with_invalid_data()
    {
        $invalidData = [
            'project_id' => '', // Required field empty
            'beneficiary' => '',
            'geographic_coverage' => '',
        ];

        $response = $this->actingAs($this->user)
            ->post('/user/impact-assessments', $invalidData);

        $response->assertSessionHasErrors(['project_id']);
    }

    public function test_user_can_filter_own_assessments()
    {
        // Create multiple assessments for filtering
        ImpactAssessment::factory()->count(3)->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get('/user/impact-assessments?status=completed');

        $response->assertStatus(200);
    }

    public function test_user_can_search_own_assessments()
    {
        $response = $this->actingAs($this->user)
            ->get('/user/impact-assessments?search=' . $this->assessment->title);

        $response->assertStatus(200);
    }

    public function test_user_can_update_assessment_details()
    {
        $updateData = [
            'project_id' => $this->assessment->project_id,
            'beneficiary' => 'Updated Beneficiaries',
            'geographic_coverage' => 'Updated Geographic Coverage',
            'num_direct_beneficiary' => 999,
            'num_indirect_beneficiary' => 888,
        ];

        $response = $this->actingAs($this->user)
            ->put("/user/impact-assessments/{$this->assessment->id}", $updateData);

        $response->assertRedirect("/user/impact-assessments/{$this->assessment->id}");
        $this->assertDatabaseHas('impact_assessments', [
            'id' => $this->assessment->id,
            'beneficiary' => 'Updated Beneficiaries',
            'geographic_coverage' => 'Updated Geographic Coverage',
            'num_direct_beneficiary' => 999,
            'num_indirect_beneficiary' => 888,
        ]);
    }
}
