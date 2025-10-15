<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TechnologyTransferTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;
    protected Campus $campus;
    protected College $college;
    protected CampusCollege $campusCollege;
    protected Project $project;

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

        $this->project = Project::factory()->create([
            'user_id' => $this->regularUser->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);
    }

    public function test_admin_can_view_technology_transfer_campuses()
    {
        $response = $this->actingAs($this->admin)->get('/admin/technology-transfer');

        $response->assertStatus(200);
    }

    public function test_admin_can_view_colleges_for_specific_campus()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/technology-transfer/{$this->campus->id}");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_projects_for_campus_college()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/technology-transfer/{$this->campus->id}/{$this->college->id}/projects");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_specific_project()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/technology-transfer/projects/{$this->project->id}");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_project_edit_form()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/technology-transfer/projects/{$this->project->id}/edit");

        $response->assertStatus(200);
    }

    public function test_admin_can_update_project()
    {
        $updateData = [
            'name' => 'Updated Project Name',
            'description' => $this->project->description,
            'category' => $this->project->category,
            'purpose' => $this->project->purpose,
            'start_date' => $this->project->start_date->format('Y-m-d'),
            'end_date' => $this->project->end_date->format('Y-m-d'),
            'tags' => $this->project->tags,
            'leader' => $this->project->leader,
            'deliverables' => $this->project->deliverables,
            'agency_partner' => $this->project->agency_partner,
            'contact_person' => $this->project->contact_person,
            'contact_email' => $this->project->contact_email,
            'contact_phone' => $this->project->contact_phone,
            'contact_address' => $this->project->contact_address,
            'copyright' => $this->project->copyright,
            'ip_details' => $this->project->ip_details,
            'is_assessment_based' => $this->project->is_assessment_based,
            'monitoring_evaluation_plan' => $this->project->monitoring_evaluation_plan,
            'sustainability_plan' => $this->project->sustainability_plan,
            'reporting_frequency' => $this->project->reporting_frequency,
            'attachment_link' => $this->project->attachment_link,
            'remarks' => $this->project->remarks,
        ];

        $response = $this->actingAs($this->admin)
            ->put("/admin/technology-transfer/projects/{$this->project->id}", $updateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('projects', [
            'id' => $this->project->id,
            'name' => 'Updated Project Name',
        ]);
    }

    public function test_admin_can_archive_project()
    {
        $response = $this->actingAs($this->admin)
            ->patch("/admin/technology-transfer/projects/{$this->project->id}/archive", [
                'password' => 'password' // Using default test password
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('projects', [
            'id' => $this->project->id,
            'is_archived' => 1,
        ]);
    }

    public function test_regular_user_cannot_access_admin_technology_transfer()
    {
        $response = $this->actingAs($this->regularUser)
            ->get('/admin/technology-transfer');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_admin_technology_transfer()
    {
        $response = $this->get('/admin/technology-transfer');

        $response->assertRedirect('/');
    }
}
