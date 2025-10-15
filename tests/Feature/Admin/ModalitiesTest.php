<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use App\Models\Modalities;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModalitiesTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;
    protected Campus $campus;
    protected College $college;
    protected CampusCollege $campusCollege;
    protected Modalities $modality;

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

        $this->modality = Modalities::factory()->create([
            'user_id' => $this->regularUser->id,
        ]);
    }

    public function test_admin_can_view_modalities_campuses()
    {
        $response = $this->actingAs($this->admin)->get('/admin/modalities');

        $response->assertStatus(200);
    }

    public function test_admin_can_view_colleges_for_specific_campus()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/modalities/{$this->campus->id}");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_modalities_for_campus_college()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/modalities/{$this->campus->id}/{$this->college->id}/modalities");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_specific_modality()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/modalities/{$this->modality->id}/details");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_modality_edit_form()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/modalities/{$this->modality->id}/edit");

        $response->assertStatus(200);
    }

    public function test_admin_can_update_modality()
    {
        $updateData = [
            'user_id' => $this->modality->user_id,
            'project_id' => $this->modality->project_id,
            'modality' => 'Updated Modality',
            'tv_channel' => 'Updated TV Channel',
            'radio' => $this->modality->radio,
            'online_link' => $this->modality->online_link,
            'time_air' => $this->modality->time_air,
            'period' => $this->modality->period,
            'partner_agency' => $this->modality->partner_agency,
            'hosted_by' => $this->modality->hosted_by,
        ];

        $response = $this->actingAs($this->admin)
            ->put("/admin/modalities/{$this->modality->id}", $updateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('modalities', [
            'id' => $this->modality->id,
            'modality' => 'Updated Modality',
            'tv_channel' => 'Updated TV Channel',
        ]);
    }

    public function test_admin_can_archive_modality()
    {
        $response = $this->actingAs($this->admin)
            ->patch("/admin/modalities/{$this->modality->id}/archive", [
                'password' => 'password' // Default password from UserFactory
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('modalities', [
            'id' => $this->modality->id,
            'is_archived' => true,
        ]);
    }

    public function test_regular_user_cannot_access_admin_modalities()
    {
        $response = $this->actingAs($this->regularUser)
            ->get('/admin/modalities');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_admin_modalities()
    {
        $response = $this->get('/admin/modalities');

        $response->assertRedirect('/');
    }

    public function test_admin_can_access_all_modalities_routes()
    {
        $routes = [
            '/admin/modalities',
            "/admin/modalities/{$this->campus->id}",
            "/admin/modalities/{$this->campus->id}/{$this->college->id}/modalities",
            "/admin/modalities/{$this->modality->id}/details",
            "/admin/modalities/{$this->modality->id}/edit",
        ];

        foreach ($routes as $route) {
            $response = $this->actingAs($this->admin)->get($route);
            $response->assertStatus(200);
        }
    }

    public function test_regular_user_cannot_access_any_admin_modalities_routes()
    {
        $routes = [
            '/admin/modalities',
            "/admin/modalities/{$this->campus->id}",
            "/admin/modalities/{$this->campus->id}/{$this->college->id}/modalities",
            "/admin/modalities/{$this->modality->id}/details",
        ];

        foreach ($routes as $route) {
            $response = $this->actingAs($this->regularUser)->get($route);
            $response->assertStatus(403);
        }
    }
}
