<?php

namespace Tests\Feature\User;

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

    protected User $user;
    protected User $admin;
    protected User $otherUser;
    protected CampusCollege $campusCollege;
    protected InternationalPartner $partnership;

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

        $this->partnership = InternationalPartner::factory()->create([
            'user_id' => $this->user->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);
    }

    public function test_user_can_view_international_partners_index()
    {
        $response = $this->actingAs($this->user)->get('/user/international-partners');

        $response->assertStatus(200);
    }

    public function test_user_can_view_create_partnership_form()
    {
        $response = $this->actingAs($this->user)->get('/user/international-partners/create');

        $response->assertStatus(200);
    }

    public function test_user_can_create_partnership()
    {
        $partnershipData = [
            'agency_partner' => 'Test University',
            'location' => 'United States',
            'activity_conducted' => 'Academic Exchange',
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addYear()->format('Y-m-d'),
            'number_of_participants' => 50,
            'number_of_committee' => 5,
            'narrative' => 'Test partnership description',
        ];

        $response = $this->actingAs($this->user)
            ->post('/user/international-partners', $partnershipData);

        $response->assertRedirect('/user/international-partners');
        $this->assertDatabaseHas('international_partners', [
            'agency_partner' => 'Test University',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_user_can_view_own_partnership()
    {
        $response = $this->actingAs($this->user)
            ->get("/user/international-partners/{$this->partnership->id}");

        $response->assertStatus(200);
    }

    public function test_user_can_view_edit_own_partnership()
    {
        $response = $this->actingAs($this->user)
            ->get("/user/international-partners/{$this->partnership->id}/edit");

        $response->assertStatus(200);
    }

    public function test_user_can_update_own_partnership()
    {
        $updateData = [
            'agency_partner' => 'Updated University Name',
            'location' => $this->partnership->location,
            'activity_conducted' => $this->partnership->activity_conducted,
            'start_date' => $this->partnership->start_date->format('Y-m-d'),
            'end_date' => $this->partnership->end_date->format('Y-m-d'),
            'number_of_participants' => $this->partnership->number_of_participants,
            'number_of_committee' => $this->partnership->number_of_committee,
            'narrative' => $this->partnership->narrative,
        ];

        $response = $this->actingAs($this->user)
            ->put("/user/international-partners/{$this->partnership->id}", $updateData);

        $response->assertRedirect("/user/international-partners/{$this->partnership->id}");
        $this->assertDatabaseHas('international_partners', [
            'id' => $this->partnership->id,
            'agency_partner' => 'Updated University Name',
        ]);
    }

    public function test_user_can_archive_own_partnership()
    {
        $response = $this->actingAs($this->user)
            ->patch("/user/international-partners/{$this->partnership->id}/archive", [
                'password' => 'password' // Add required password
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('international_partners', [
            'id' => $this->partnership->id,
            'is_archived' => true,
        ]);
    }

    public function test_user_cannot_view_other_users_partnership()
    {
        $otherPartnership = InternationalPartner::factory()->create([
            'user_id' => $this->otherUser->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get("/user/international-partners/{$otherPartnership->id}");

        $response->assertStatus(403);
    }

    public function test_user_cannot_edit_other_users_partnership()
    {
        $otherPartnership = InternationalPartner::factory()->create([
            'user_id' => $this->otherUser->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get("/user/international-partners/{$otherPartnership->id}/edit");

        $response->assertStatus(403);
    }

    public function test_user_cannot_update_other_users_partnership()
    {
        $otherPartnership = InternationalPartner::factory()->create([
            'user_id' => $this->otherUser->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $updateData = [
            'partner_name' => 'Hacked Name',
        ];

        $response = $this->actingAs($this->user)
            ->put("/user/international-partners/{$otherPartnership->id}", $updateData);

        $response->assertStatus(403);
    }

    public function test_admin_cannot_access_user_international_partners()
    {
        $response = $this->actingAs($this->admin)->get('/user/international-partners');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_user_international_partners()
    {
        $response = $this->get('/user/international-partners');

        $response->assertRedirect('/');
    }

    public function test_user_cannot_create_partnership_with_invalid_data()
    {
        $invalidData = [
            'agency_partner' => '', // Required field empty
            'location' => '',
            'activity_conducted' => '',
        ];

        $response = $this->actingAs($this->user)
            ->post('/user/international-partners', $invalidData);

        $response->assertSessionHasErrors(['agency_partner']);
    }

    public function test_user_can_filter_own_partnerships()
    {
        // Create multiple partnerships for filtering
        InternationalPartner::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get('/user/international-partners?country=USA');

        $response->assertStatus(200);
    }

    public function test_user_can_search_own_partnerships()
    {
        $response = $this->actingAs($this->user)
            ->get('/user/international-partners?search=' . $this->partnership->partner_name);

        $response->assertStatus(200);
    }
}
