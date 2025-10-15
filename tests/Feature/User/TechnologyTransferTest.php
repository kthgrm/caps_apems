<?php

namespace Tests\Feature\User;

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

    protected User $user;
    protected User $admin;
    protected CampusCollege $campusCollege;
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

        $this->project = Project::factory()->create([
            'user_id' => $this->user->id,
        ]);
    }

    public function test_user_can_view_technology_transfer_index()
    {
        $response = $this->actingAs($this->user)->get('/user/technology-transfer');

        $response->assertStatus(200);
    }

    public function test_user_can_view_create_project_form()
    {
        $response = $this->actingAs($this->user)->get('/user/technology-transfer/project/create');

        $response->assertStatus(200);
    }

    public function test_user_can_create_project()
    {
        $projectData = [
            'name' => 'Test Project',
            'description' => 'This is a test project description',
            'category' => 'private', // Valid option from controller validation
            'purpose' => 'Academic research and development',
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addMonths(6)->format('Y-m-d'),
            'leader' => 'Dr. Project Leader',
            'tags' => 'test,project,research',
            'deliverables' => 'Research paper, prototype',
            'agency_partner' => 'Department of Science and Technology',
            'contact_person' => 'John Doe',
            'contact_email' => 'john.doe@example.com',
            'contact_phone' => '+63 912 345 6789',
            'contact_address' => '123 Main St, Manila, Philippines',
            'copyright' => 'yes', // Valid option: yes, no, pending
            'ip_details' => 'Patent pending for innovative technology',
            'is_assessment_based' => true,
            'monitoring_evaluation_plan' => 'Monthly progress reports',
            'sustainability_plan' => 'Long-term funding secured',
            'reporting_frequency' => 4, // Quarterly reporting
            'attachment_link' => 'https://example.com/project-doc',
            'remarks' => 'Initial project setup complete',
        ];

        $response = $this->actingAs($this->user)
            ->post('/user/technology-transfer/project', $projectData);

        $response->assertRedirect('/user/technology-transfer');
        $this->assertDatabaseHas('projects', [
            'name' => 'Test Project',
            'user_id' => $this->user->id,
            'category' => 'private',
        ]);
    }

    public function test_user_can_view_own_project()
    {
        $response = $this->actingAs($this->user)
            ->get("/user/technology-transfer/project/{$this->project->id}");

        $response->assertStatus(200);
    }

    public function test_user_can_view_edit_own_project()
    {
        $response = $this->actingAs($this->user)
            ->get("/user/technology-transfer/project/{$this->project->id}/edit");

        $response->assertStatus(200);
    }

    public function test_user_can_update_own_project()
    {
        $updateData = [
            'name' => 'Updated Project Name',
            'description' => 'Updated project description',
            'category' => $this->project->category,
            'purpose' => $this->project->purpose,
            'start_date' => $this->project->start_date->format('Y-m-d'),
            'end_date' => $this->project->end_date->format('Y-m-d'),
            'leader' => $this->project->leader,
            'tags' => $this->project->tags,
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

        $response = $this->actingAs($this->user)
            ->put("/user/technology-transfer/project/{$this->project->id}", $updateData);

        $response->assertRedirect()->assertSessionHas('message');
        $this->assertDatabaseHas('projects', [
            'id' => $this->project->id,
            'name' => 'Updated Project Name',
        ]);
    }

    public function test_user_can_archive_own_project()
    {
        $response = $this->actingAs($this->user)
            ->from("/user/technology-transfer/project/{$this->project->id}")
            ->patch("/user/technology-transfer/project/{$this->project->id}/archive", [
                'password' => 'password' // Default password from UserFactory
            ]);

        $response->assertRedirect("/user/technology-transfer/project/{$this->project->id}");
        $this->assertDatabaseHas('projects', [
            'id' => $this->project->id,
            'is_archived' => true,
        ]);
    }

    public function test_user_cannot_view_other_users_project()
    {
        $otherUser = User::factory()->create([
            'is_admin' => false,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $otherProject = Project::factory()->create([
            'user_id' => $otherUser->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get("/user/technology-transfer/project/{$otherProject->id}");

        $response->assertStatus(403);
    }

    public function test_admin_cannot_access_user_technology_transfer()
    {
        $response = $this->actingAs($this->admin)->get('/user/technology-transfer');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_user_technology_transfer()
    {
        $response = $this->get('/user/technology-transfer');

        $response->assertRedirect('/');
    }

    public function test_user_cannot_create_project_with_invalid_data()
    {
        $invalidData = [
            'name' => '', // Required field empty
            'description' => '',
        ];

        $response = $this->actingAs($this->user)
            ->post('/user/technology-transfer/project', $invalidData);

        $response->assertSessionHasErrors(['name']);
    }
}
