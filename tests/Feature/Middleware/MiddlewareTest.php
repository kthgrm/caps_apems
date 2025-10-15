<?php

namespace Tests\Feature\Middleware;

use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MiddlewareTest extends TestCase
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
    }

    public function test_is_admin_middleware_allows_admin_access()
    {
        $response = $this->actingAs($this->admin)->get('/admin/dashboard');

        $response->assertStatus(200);
    }

    public function test_is_admin_middleware_blocks_regular_user()
    {
        $response = $this->actingAs($this->regularUser)->get('/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_is_admin_middleware_blocks_unauthenticated_user()
    {
        $response = $this->get('/admin/dashboard');

        $response->assertRedirect('/');
    }

    public function test_is_user_middleware_allows_regular_user_access()
    {
        $response = $this->actingAs($this->regularUser)->get('/user/dashboard');

        $response->assertStatus(200);
    }

    public function test_is_user_middleware_blocks_admin()
    {
        $response = $this->actingAs($this->admin)->get('/user/dashboard');

        $response->assertStatus(403);
    }

    public function test_is_user_middleware_blocks_unauthenticated_user()
    {
        $response = $this->get('/user/dashboard');

        $response->assertRedirect('/');
    }

    public function test_auth_middleware_protects_all_routes()
    {
        // Test various admin routes
        $adminRoutes = [
            '/admin/dashboard',
            '/admin/users',
            '/admin/technology-transfer',
            '/admin/resolutions',
            '/admin/campus',
            '/admin/college',
        ];

        foreach ($adminRoutes as $route) {
            $response = $this->get($route);
            $response->assertRedirect('/');
        }

        // Test various user routes
        $userRoutes = [
            '/user/dashboard',
            '/user/technology-transfer',
            '/user/awards',
            '/user/international-partners',
        ];

        foreach ($userRoutes as $route) {
            $response = $this->get($route);
            $response->assertRedirect('/');
        }
    }

    public function test_admin_can_access_all_admin_routes()
    {
        $adminRoutes = [
            '/admin/dashboard',
            '/admin/users',
            '/admin/technology-transfer',
            '/admin/resolutions',
            '/admin/campus',
            '/admin/college',
        ];

        foreach ($adminRoutes as $route) {
            $response = $this->withoutVite()->actingAs($this->admin)->get($route);
            $response->assertStatus(200);
        }
    }

    public function test_regular_user_can_access_all_user_routes()
    {
        $userRoutes = [
            '/user/dashboard',
            '/user/technology-transfer',
            '/user/awards',
            '/user/international-partners',
            '/user/impact-assessments',
            '/user/modalities',
        ];

        foreach ($userRoutes as $route) {
            $response = $this->withoutVite()->actingAs($this->regularUser)->get($route);
            $response->assertStatus(200);
        }
    }

    public function test_cross_role_access_is_properly_blocked()
    {
        // Admin should not access user routes
        $userRoutes = [
            '/user/dashboard',
            '/user/technology-transfer',
            '/user/awards',
        ];

        foreach ($userRoutes as $route) {
            $response = $this->actingAs($this->admin)->get($route);
            $response->assertStatus(403);
        }

        // Regular user should not access admin routes
        $adminRoutes = [
            '/admin/dashboard',
            '/admin/users',
            '/admin/technology-transfer',
        ];

        foreach ($adminRoutes as $route) {
            $response = $this->actingAs($this->regularUser)->get($route);
            $response->assertStatus(403);
        }
    }

    public function test_inactive_user_behavior()
    {
        $inactiveUser = User::factory()->create([
            'is_admin' => false,
            'is_active' => false,
            'campus_college_id' => $this->campusCollege->id,
        ]);

        // Note: The middleware doesn't check is_active, this would be handled in authentication
        // This test verifies that inactive users can still access routes if authenticated
        $response = $this->actingAs($inactiveUser)->get('/user/dashboard');

        // This should work because middleware only checks authentication and role
        $response->assertStatus(200);
    }
}
