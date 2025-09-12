<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Award;
use App\Models\Campus;
use App\Models\College;
use App\Models\InternationalPartner;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Overall statistics
        $overallStats = [
            'total_users' => User::where('is_admin', false)->count(),
            'total_projects' => Project::where('is_archived', false)->count(),
            'total_awards' => Award::where('is_archived', false)->count(),
            'total_international_partners' => InternationalPartner::where('is_archived', false)->count(),
        ];

        // Monthly statistics (current year)
        $monthlyStats = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthlyStats[] = [
                'month' => Carbon::create(date('Y'), $i, 1)->format('M'),
                'projects' => Project::whereYear('created_at', date('Y'))
                    ->whereMonth('created_at', $i)
                    ->where('is_archived', false)
                    ->count(),
                'awards' => Award::whereYear('created_at', date('Y'))
                    ->whereMonth('created_at', $i)
                    ->where('is_archived', false)
                    ->count(),
                'partners' => InternationalPartner::whereYear('created_at', date('Y'))
                    ->whereMonth('created_at', $i)
                    ->where('is_archived', false)
                    ->count(),
            ];
        }

        // Campus-wise statistics
        $campusStats = Campus::withCount(['campusColleges as total_colleges'])
            ->with(['campusColleges' => function ($query) {
                $query->withCount([
                    'projects' => function ($query) {
                        $query->where('is_archived', false);
                    },
                    'awards' => function ($query) {
                        $query->where('is_archived', false);
                    },
                    'internationalPartners' => function ($query) {
                        $query->where('is_archived', false);
                    }
                ]);
            }])
            ->get()
            ->map(function ($campus) {
                $totalProjects = $campus->campusColleges->sum('projects_count');
                $totalAwards = $campus->campusColleges->sum('awards_count');
                $totalPartners = $campus->campusColleges->sum('international_partners_count');

                return [
                    'id' => $campus->id,
                    'name' => $campus->name,
                    'code' => $campus->code,
                    'total_colleges' => $campus->total_colleges,
                    'total_projects' => $totalProjects,
                    'total_awards' => $totalAwards,
                    'total_partners' => $totalPartners,
                ];
            });

        // Recent activities
        $recentActivities = collect();

        // Recent projects
        Project::with(['user', 'campusCollege.campus', 'campusCollege.college'])
            ->where('is_archived', false)
            ->latest()
            ->take(10)
            ->get()
            ->each(function ($project) use (&$recentActivities) {
                $recentActivities->push([
                    'id' => $project->id,
                    'type' => 'project',
                    'title' => $project->name,
                    'description' => $project->description,
                    'user' => $project->user->name,
                    'campus' => $project->campusCollege?->campus?->name ?? 'N/A',
                    'college' => $project->campusCollege?->college?->name ?? 'N/A',
                    'created_at' => $project->created_at,
                ]);
            });

        // Recent awards
        Award::with(['user', 'campusCollege.campus', 'campusCollege.college'])
            ->where('is_archived', false)
            ->latest()
            ->take(10)
            ->get()
            ->each(function ($award) use (&$recentActivities) {
                $recentActivities->push([
                    'id' => $award->id,
                    'type' => 'award',
                    'title' => $award->award_name,
                    'description' => $award->description,
                    'user' => $award->user->name,
                    'campus' => $award->campusCollege?->campus?->name ?? 'N/A',
                    'college' => $award->campusCollege?->college?->name ?? 'N/A',
                    'created_at' => $award->created_at,
                    'date_received' => $award->date_received,
                ]);
            });

        // Recent international partners
        InternationalPartner::with(['user', 'campusCollege.campus', 'campusCollege.college'])
            ->where('is_archived', false)
            ->latest()
            ->take(10)
            ->get()
            ->each(function ($partner) use (&$recentActivities) {
                $recentActivities->push([
                    'id' => $partner->id,
                    'type' => 'partner',
                    'title' => $partner->agency_partner,
                    'description' => $partner->activity_conducted,
                    'user' => $partner->user->name,
                    'campus' => $partner->campusCollege?->campus?->name ?? 'N/A',
                    'college' => $partner->campusCollege?->college?->name ?? 'N/A',
                    'created_at' => $partner->created_at,
                    'location' => $partner->location,
                ]);
            });

        // Sort recent activities by created_at and take top 10
        $recentActivities = $recentActivities->sortByDesc('created_at')->take(10)->values();

        return Inertia::render('admin/dashboard', [
            'overallStats' => $overallStats,
            'monthlyStats' => $monthlyStats,
            'campusStats' => $campusStats,
            'recentActivities' => $recentActivities,
        ]);
    }
}
