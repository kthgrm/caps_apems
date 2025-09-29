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
    public function index(Request $request)
    {
        // Get the year from request, default to current year
        $year = $request->get('year', date('Y'));

        // Get available years dynamically from database
        $availableYears = collect();

        // Get years from projects
        $projectYears = Project::where('is_archived', false)
            ->selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->pluck('year')
            ->filter()
            ->toArray();

        // Get years from awards
        $awardYears = Award::where('is_archived', false)
            ->selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->pluck('year')
            ->filter()
            ->toArray();

        // Get years from international partners
        $partnerYears = InternationalPartner::where('is_archived', false)
            ->selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->pluck('year')
            ->filter()
            ->toArray();

        // Merge all years and get unique values
        $allYears = array_unique(array_merge($projectYears, $awardYears, $partnerYears));

        // Add current year if not present and sort descending
        $allYears[] = (int)date('Y');
        $availableYears = array_unique($allYears);
        rsort($availableYears);

        // Convert to strings for frontend
        $availableYears = array_map('strval', $availableYears);

        // Overall statistics for the selected year
        $overallStats = [
            'total_users' => User::where('is_admin', false)
                ->whereYear('created_at', $year)
                ->count(),
            'total_projects' => Project::where('is_archived', false)
                ->whereYear('created_at', $year)
                ->count(),
            'total_awards' => Award::where('is_archived', false)
                ->whereYear('created_at', $year)
                ->count(),
            'total_international_partners' => InternationalPartner::where('is_archived', false)
                ->whereYear('created_at', $year)
                ->count(),
            'total_campuses' => Campus::count(), // Structural data - not year-dependent
            'total_colleges' => College::count(), // Structural data - not year-dependent
        ];

        // Monthly statistics for the selected year
        $monthlyStats = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthlyStats[] = [
                'month' => Carbon::create($year, $i, 1)->format('M'),
                'projects' => Project::whereYear('created_at', $year)
                    ->whereMonth('created_at', $i)
                    ->where('is_archived', false)
                    ->count(),
                'awards' => Award::whereYear('created_at', $year)
                    ->whereMonth('created_at', $i)
                    ->where('is_archived', false)
                    ->count(),
                'partners' => InternationalPartner::whereYear('created_at', $year)
                    ->whereMonth('created_at', $i)
                    ->where('is_archived', false)
                    ->count(),
            ];
        }

        // Campus-wise statistics for the selected year
        $campusStats = Campus::withCount(['campusColleges as total_colleges'])
            ->with(['campusColleges' => function ($query) use ($year) {
                $query->withCount([
                    'projects' => function ($query) use ($year) {
                        $query->where('is_archived', false)
                            ->whereYear('created_at', $year);
                    },
                    'awards' => function ($query) use ($year) {
                        $query->where('is_archived', false)
                            ->whereYear('created_at', $year);
                    },
                    'internationalPartners' => function ($query) use ($year) {
                        $query->where('is_archived', false)
                            ->whereYear('created_at', $year);
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
                    'total_colleges' => $campus->total_colleges,
                    'total_projects' => $totalProjects,
                    'total_awards' => $totalAwards,
                    'total_partners' => $totalPartners,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'overallStats' => $overallStats,
            'monthlyStats' => $monthlyStats,
            'campusStats' => $campusStats,
            'selectedYear' => $year,
            'availableYears' => $availableYears,
        ]);
    }
}
