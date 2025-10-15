<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use App\Models\Award;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AwardTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;
    protected Campus $campus;
    protected College $college;
    protected CampusCollege $campusCollege;
    protected Award $award;

    protected function setUp(): void
    {
        parent::setUp();

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

        $this->award = Award::factory()->create([
            'user_id' => $this->regularUser->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);
    }

    public function test_admin_can_view_awards_campuses()
    {
        $response = $this->withoutVite()->actingAs($this->admin)->get('/admin/awards-recognition');

        $response->assertStatus(200);
    }

    public function test_admin_can_view_colleges_for_specific_campus()
    {
        $response = $this->withoutVite()->actingAs($this->admin)
            ->get("/admin/awards-recognition/{$this->campus->id}");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_awards_for_campus_college()
    {
        $response = $this->withoutVite()->actingAs($this->admin)
            ->get("/admin/awards-recognition/{$this->campus->id}/{$this->college->id}/awards");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_specific_award()
    {
        $response = $this->withoutVite()->actingAs($this->admin)
            ->get("/admin/awards-recognition/awards/{$this->award->id}");

        $response->assertStatus(200);
    }

    public function test_admin_can_view_award_edit_form()
    {
        $response = $this->withoutVite()->actingAs($this->admin)
            ->get("/admin/awards-recognition/awards/{$this->award->id}/edit");

        $response->assertStatus(200);
    }

    public function test_admin_can_update_award()
    {
        $updateData = [
            'award_name' => 'Updated Award Name',
            'description' => $this->award->description,
            'date_received' => $this->award->date_received->format('Y-m-d'),
            'event_details' => $this->award->event_details,
            'location' => $this->award->location,
            'awarding_body' => $this->award->awarding_body,
            'people_involved' => $this->award->people_involved,
        ];

        $response = $this->actingAs($this->admin)
            ->put("/admin/awards-recognition/awards/{$this->award->id}", $updateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('awards', [
            'id' => $this->award->id,
            'award_name' => 'Updated Award Name',
        ]);
    }

    public function test_admin_can_archive_award()
    {
        $archiveData = [
            'password' => 'password', // Default password from UserFactory
        ];

        $response = $this->actingAs($this->admin)
            ->patch("/admin/awards-recognition/awards/{$this->award->id}/archive", $archiveData);

        $response->assertRedirect();
        $this->assertDatabaseHas('awards', [
            'id' => $this->award->id,
            'is_archived' => true,
        ]);
    }

    public function test_regular_user_cannot_access_admin_awards()
    {
        $response = $this->actingAs($this->regularUser)
            ->get('/admin/awards-recognition');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_admin_awards()
    {
        $response = $this->get('/admin/awards-recognition');

        $response->assertRedirect('/');
    }

    public function test_admin_can_view_awards_filtered_by_campus()
    {
        $response = $this->withoutVite()->actingAs($this->admin)
            ->get("/admin/awards-recognition/{$this->campus->id}");

        $response->assertStatus(200);
    }

    public function test_admin_award_routes_require_valid_ids()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/awards-recognition/awards/99999");

        $response->assertStatus(404);
    }

    public function test_admin_can_view_awards_with_filters()
    {
        // Test with category filter
        $response = $this->withoutVite()->actingAs($this->admin)
            ->get("/admin/awards-recognition/{$this->campus->id}/{$this->college->id}/awards?category=academic");

        $response->assertStatus(200);

        // Test with date range filter
        $response = $this->withoutVite()->actingAs($this->admin)
            ->get("/admin/awards-recognition/{$this->campus->id}/{$this->college->id}/awards?start_date=" . now()->subYear()->format('Y-m-d'));

        $response->assertStatus(200);
    }

    public function test_admin_can_view_awards_statistics()
    {
        // Create multiple awards for statistics
        Award::factory()->count(5)->create([
            'user_id' => $this->regularUser->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $response = $this->withoutVite()->actingAs($this->admin)
            ->get("/admin/awards-recognition/{$this->campus->id}/{$this->college->id}/awards");

        $response->assertStatus(200);
    }

    public function test_admin_cannot_update_award_with_invalid_data()
    {
        $invalidData = [
            'award_name' => '', // Required field empty
            'description' => '',
        ];

        $response = $this->actingAs($this->admin)
            ->put("/admin/awards-recognition/awards/{$this->award->id}", $invalidData);

        $response->assertSessionHasErrors(['award_name']);
    }
}
