<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use App\Models\Project;
use App\Models\Award;
use App\Models\InternationalPartner;
use App\Models\User as ModelsUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportsTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;
    protected CampusCollege $campusCollege;

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

        $this->admin = User::factory()->create([
            'is_admin' => true,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        $this->regularUser = User::factory()->create([
            'is_admin' => false,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        // Create sample data for reports
        Project::factory()->count(3)->create([
            'user_id' => $this->regularUser->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        Award::factory()->count(2)->create([
            'user_id' => $this->regularUser->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        InternationalPartner::factory()->count(2)->create([
            'user_id' => $this->regularUser->id,
            'campus_college_id' => $this->campusCollege->id,
        ]);
    }

    public function test_admin_can_view_audit_trail_report()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/audit-trail');

        $response->assertStatus(200);
    }

    public function test_admin_can_download_audit_trail_pdf()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/audit-trail/pdf');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_admin_can_view_technology_transfers_report()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/technology-transfers');

        $response->assertStatus(200);
    }

    public function test_admin_can_download_technology_transfers_pdf()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/technology-transfers/pdf');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_admin_can_view_awards_report()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/awards');

        $response->assertStatus(200);
    }

    public function test_admin_can_download_awards_pdf()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/awards/pdf');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_admin_can_view_international_partners_report()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/international-partners');

        $response->assertStatus(200);
    }

    public function test_admin_can_download_international_partners_pdf()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/international-partners/pdf');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_admin_can_view_users_report()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/users');

        $response->assertStatus(200);
    }

    public function test_admin_can_download_users_pdf()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/users/pdf');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_admin_can_view_modalities_report()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/modalities');

        $response->assertStatus(200);
    }

    public function test_admin_can_download_modalities_pdf()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/modalities/pdf');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_admin_can_view_resolutions_report()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/resolutions');

        $response->assertStatus(200);
    }

    public function test_admin_can_download_resolutions_pdf()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/resolutions/pdf');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_admin_can_view_impact_assessments_report()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/impact-assessments');

        $response->assertStatus(200);
    }

    public function test_admin_can_download_impact_assessments_pdf()
    {
        $response = $this->actingAs($this->admin)->get('/admin/report/impact-assessments/pdf');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_regular_user_cannot_access_reports()
    {
        $reportRoutes = [
            '/admin/report/audit-trail',
            '/admin/report/technology-transfers',
            '/admin/report/awards',
            '/admin/report/users',
        ];

        foreach ($reportRoutes as $route) {
            $response = $this->actingAs($this->regularUser)->get($route);
            $response->assertStatus(403);
        }
    }

    public function test_unauthenticated_user_cannot_access_reports()
    {
        $reportRoutes = [
            '/admin/report/audit-trail',
            '/admin/report/technology-transfers',
            '/admin/report/awards',
            '/admin/report/users',
        ];

        foreach ($reportRoutes as $route) {
            $response = $this->get($route);
            $response->assertRedirect('/');
        }
    }

    public function test_reports_with_filters()
    {
        // Test audit trail with user filter
        $response = $this->actingAs($this->admin)
            ->get('/admin/report/audit-trail?user_id=' . $this->regularUser->id);

        $response->assertStatus(200);

        // Test users report with campus filter
        $response = $this->actingAs($this->admin)
            ->get('/admin/report/users?campus_id=' . $this->campusCollege->campus_id);

        $response->assertStatus(200);

        // Test projects report with date filter
        $response = $this->actingAs($this->admin)
            ->get('/admin/report/technology-transfers?start_date=' . now()->subMonth()->format('Y-m-d'));

        $response->assertStatus(200);
    }
}