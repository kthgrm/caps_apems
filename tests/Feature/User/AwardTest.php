<?php

namespace Tests\Feature\User;

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

    protected User $user;
    protected User $admin;
    protected User $otherUser;
    protected CampusCollege $campusCollege;
    protected Award $award;

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

        $this->award = Award::factory()->create([
            'user_id' => $this->user->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);
    }

    /**
     * Test that user can view awards index.
     * @jira TC-033: Verify that authenticated users can view the awards listing page
     */
    public function test_user_can_view_awards_index()
    {
        $response = $this->actingAs($this->user)->get('/user/awards');

        $response->assertStatus(200);
    }

    /**
     * Test that user can view create award form.
     * @jira TC-034: Verify that authenticated users can access the award creation form
     */
    public function test_user_can_view_create_award_form()
    {
        $response = $this->actingAs($this->user)->get('/user/awards/create');

        $response->assertStatus(200);
    }

    /**
     * Test that user can create award.
     * @jira TC-035: Verify that authenticated users can successfully create new awards
     */
    public function test_user_can_create_award()
    {
        $awardData = [
            'award_name' => 'Test Award',
            'description' => 'This is a test award',
            'date_received' => now()->format('Y-m-d'),
            'event_details' => 'Annual Excellence Awards Ceremony',
            'location' => 'University Auditorium',
            'awarding_body' => 'Test Organization',
            'people_involved' => 'John Doe, Jane Smith',
        ];

        $response = $this->actingAs($this->user)
            ->post('/user/awards', $awardData);

        $response->assertRedirect('/user/awards');
        $this->assertDatabaseHas('awards', [
            'award_name' => 'Test Award',
            'user_id' => $this->user->id,
        ]);
    }

    /**
     * Test that user can view own award.
     * @jira TC-036: Verify that users can view detailed information of their own awards
     */
    public function test_user_can_view_own_award()
    {
        $response = $this->actingAs($this->user)
            ->get("/user/awards/{$this->award->id}");

        $response->assertStatus(200);
    }

    /**
     * Test that user can view edit own award.
     * @jira TC-037: Verify that users can access the edit form for their own awards
     */
    public function test_user_can_view_edit_own_award()
    {
        $response = $this->actingAs($this->user)
            ->get("/user/awards/{$this->award->id}/edit");

        $response->assertStatus(200);
    }

    /**
     * Test that user can update own award.
     * @jira TC-038: Verify that users can successfully update their own awards
     */
    public function test_user_can_update_own_award()
    {
        $updateData = [
            'award_name' => 'Updated Award Title',
            'description' => $this->award->description,
            'date_received' => $this->award->date_received->format('Y-m-d'),
            'event_details' => $this->award->event_details,
            'location' => $this->award->location,
            'awarding_body' => $this->award->awarding_body,
            'people_involved' => $this->award->people_involved,
        ];

        $response = $this->actingAs($this->user)
            ->put("/user/awards/{$this->award->id}", $updateData);

        $response->assertRedirect("/user/awards/{$this->award->id}");
        $this->assertDatabaseHas('awards', [
            'id' => $this->award->id,
            'award_name' => 'Updated Award Title',
        ]);
    }

    /**
     * Test that user can archive own award.
     * @jira TC-039: Verify that users can archive their own awards
     */
    public function test_user_can_archive_own_award()
    {
        $response = $this->actingAs($this->user)
            ->patch("/user/awards/{$this->award->id}/archive", [
                'password' => 'password' // Add password requirement
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('awards', [
            'id' => $this->award->id,
            'is_archived' => true,
        ]);
    }

    /**
     * Test that user cannot view other users award.
     * @jira TC-040: Verify that users cannot access awards belonging to other users
     */
    public function test_user_cannot_view_other_users_award()
    {
        $otherUser = User::factory()->create([
            'is_admin' => false,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $otherAward = Award::factory()->create([
            'user_id' => $otherUser->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get("/user/awards/{$otherAward->id}");

        $response->assertStatus(403);
    }

    /**
     * Test that admin cannot access user awards.
     * @jira TC-041: Verify that admin users cannot access user award management sections
     */
    public function test_admin_cannot_access_user_awards()
    {
        $response = $this->actingAs($this->admin)->get('/user/awards');

        $response->assertStatus(403);
    }

    /**
     * Test that unauthenticated user cannot access user awards.
     * @jira TC-042: Verify that unauthenticated users cannot access award management features
     */
    public function test_unauthenticated_user_cannot_access_user_awards()
    {
        $response = $this->get('/user/awards');

        $response->assertRedirect('/');
    }

    public function test_user_cannot_create_award_with_invalid_data()
    {
        $invalidData = [
            'award_name' => '', // Required field empty
            'description' => '',
        ];

        $response = $this->actingAs($this->user)
            ->post('/user/awards', $invalidData);

        $response->assertSessionHasErrors(['award_name']);
    }
}
