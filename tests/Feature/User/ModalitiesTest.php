<?php

namespace Tests\Feature\User;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use App\Models\Modalities;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModalitiesTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected User $admin;
    protected User $otherUser;
    protected CampusCollege $campusCollege;
    protected Modalities $modality;
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
        ]);

        $this->admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $this->otherUser = User::factory()->create([
            'is_admin' => false,
        ]);

        // Create a project for the user
        $this->project = Project::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $this->modality = Modalities::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);
    }

    public function test_user_can_view_modalities_index()
    {
        $response = $this->actingAs($this->user)->get('/user/modalities');

        $response->assertStatus(200);
    }

    public function test_user_can_view_create_modality_form()
    {
        $response = $this->actingAs($this->user)->get('/user/modalities/create');

        $response->assertStatus(200);
    }

    public function test_user_can_create_modality()
    {
        $modalityData = [
            'project_id' => $this->project->id,
            'modality' => 'Online Learning Platform',
            'tv_channel' => 'Channel 7',
            'radio' => 'DZBB',
            'online_link' => 'https://example.com/online-course',
            'time_air' => '9:00 AM - 10:00 AM',
            'period' => 'Weekly',
            'partner_agency' => 'Department of Education',
            'hosted_by' => 'University Extension Office',
        ];

        $response = $this->actingAs($this->user)
            ->post('/user/modalities', $modalityData);

        $response->assertRedirect('/user/modalities');
        $this->assertDatabaseHas('modalities', [
            'modality' => 'Online Learning Platform',
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);
    }

    public function test_user_can_view_own_modality()
    {
        $response = $this->actingAs($this->user)
            ->get("/user/modalities/{$this->modality->id}");

        $response->assertStatus(200);
    }

    public function test_user_can_view_edit_own_modality()
    {
        $response = $this->actingAs($this->user)
            ->get("/user/modalities/{$this->modality->id}/edit");

        $response->assertStatus(200);
    }

    public function test_user_can_update_own_modality()
    {
        $updateData = [
            'project_id' => $this->modality->project_id,
            'modality' => 'Updated Modality Name',
            'tv_channel' => $this->modality->tv_channel,
            'radio' => $this->modality->radio,
            'online_link' => $this->modality->online_link,
            'time_air' => $this->modality->time_air,
            'period' => $this->modality->period,
            'partner_agency' => $this->modality->partner_agency,
            'hosted_by' => $this->modality->hosted_by,
        ];

        $response = $this->actingAs($this->user)
            ->put("/user/modalities/{$this->modality->id}", $updateData);

        $response->assertRedirect("/user/modalities/{$this->modality->id}");
        $this->assertDatabaseHas('modalities', [
            'id' => $this->modality->id,
            'modality' => 'Updated Modality Name',
        ]);
    }

    public function test_user_can_archive_own_modality()
    {
        $response = $this->actingAs($this->user)
            ->from("/user/modalities/{$this->modality->id}")
            ->patch("/user/modalities/{$this->modality->id}/archive", [
                'password' => 'password' // Default password from UserFactory
            ]);

        $response->assertRedirect("/user/modalities/{$this->modality->id}");
        $this->assertDatabaseHas('modalities', [
            'id' => $this->modality->id,
            'is_archived' => true,
        ]);
    }

    public function test_user_cannot_view_other_users_modality()
    {
        $otherProject = Project::factory()->create([
            'user_id' => $this->otherUser->id,
        ]);

        $otherModality = Modalities::factory()->create([
            'user_id' => $this->otherUser->id,
            'project_id' => $otherProject->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get("/user/modalities/{$otherModality->id}");

        $response->assertStatus(403);
    }

    public function test_user_cannot_edit_other_users_modality()
    {
        $otherProject = Project::factory()->create([
            'user_id' => $this->otherUser->id,
        ]);

        $otherModality = Modalities::factory()->create([
            'user_id' => $this->otherUser->id,
            'project_id' => $otherProject->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get("/user/modalities/{$otherModality->id}/edit");

        $response->assertStatus(403);
    }

    public function test_user_cannot_update_other_users_modality()
    {
        $otherProject = Project::factory()->create([
            'user_id' => $this->otherUser->id,
        ]);

        $otherModality = Modalities::factory()->create([
            'user_id' => $this->otherUser->id,
            'project_id' => $otherProject->id,
        ]);

        $updateData = [
            'project_id' => $otherProject->id,
            'modality' => 'Hacked Modality',
        ];

        $response = $this->actingAs($this->user)
            ->put("/user/modalities/{$otherModality->id}", $updateData);

        $response->assertStatus(403);
    }

    public function test_admin_cannot_access_user_modalities()
    {
        $response = $this->actingAs($this->admin)->get('/user/modalities');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_user_modalities()
    {
        $response = $this->get('/user/modalities');

        $response->assertRedirect('/');
    }

    public function test_user_cannot_create_modality_with_invalid_data()
    {
        $invalidData = [
            'project_id' => '', // Required field empty
            'modality' => '', // Required field empty
        ];

        $response = $this->actingAs($this->user)
            ->post('/user/modalities', $invalidData);

        $response->assertSessionHasErrors(['project_id', 'modality']);
    }

    public function test_user_can_filter_own_modalities()
    {
        // Create multiple modalities for filtering
        Modalities::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get('/user/modalities?type=Online');

        $response->assertStatus(200);
    }

    public function test_user_can_search_own_modalities()
    {
        $response = $this->actingAs($this->user)
            ->get('/user/modalities?search=' . $this->modality->modality);

        $response->assertStatus(200);
    }

    public function test_user_can_duplicate_modality()
    {
        // Test duplicating a modality (if this feature exists)
        $duplicateData = [
            'project_id' => $this->project->id,
            'modality' => 'Duplicate of ' . $this->modality->modality,
            'tv_channel' => $this->modality->tv_channel,
            'radio' => $this->modality->radio,
            'online_link' => $this->modality->online_link,
            'time_air' => $this->modality->time_air,
            'period' => $this->modality->period,
            'partner_agency' => $this->modality->partner_agency,
            'hosted_by' => $this->modality->hosted_by,
        ];

        $response = $this->actingAs($this->user)
            ->post('/user/modalities', $duplicateData);

        $response->assertRedirect('/user/modalities');
        $this->assertDatabaseHas('modalities', [
            'modality' => 'Duplicate of ' . $this->modality->modality,
            'user_id' => $this->user->id,
        ]);
    }
}
