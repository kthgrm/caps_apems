<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Award;
use App\Models\InternationalPartner;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get user's statistics
        $userStats = [
            'total_projects' => Project::where('user_id', $user->id)->where('is_archived', false)->count(),
            'total_awards' => Award::where('user_id', $user->id)->where('is_archived', false)->count(),
            'total_international_partners' => InternationalPartner::where('user_id', $user->id)->where('is_archived', false)->count(),
        ];

        // Get recent submissions from other users (excluding current user)
        $recentSubmissions = [
            'projects' => Project::with(['user', 'campusCollege.campus', 'campusCollege.college'])
                ->where('user_id', '!=', $user->id)
                ->where('is_archived', false)
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($project) {
                    return [
                        'id' => $project->id,
                        'name' => $project->name,
                        'type' => 'Project',
                        'user_name' => $project->user->name ?? 'Unknown User',
                        'campus' => $project->campusCollege?->campus?->name ?? 'N/A',
                        'college' => $project->campusCollege?->college?->name ?? 'N/A',
                        'created_at' => $project->created_at,
                        'description' => $project->description
                    ];
                }),
            'awards' => Award::with(['user', 'campusCollege.campus', 'campusCollege.college'])
                ->where('user_id', '!=', $user->id)
                ->where('is_archived', false)
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($award) {
                    return [
                        'id' => $award->id,
                        'name' => $award->award_name,
                        'type' => 'Award',
                        'user_name' => $award->user->name ?? 'Unknown User',
                        'campus' => $award->campusCollege?->campus?->name ?? 'N/A',
                        'college' => $award->campusCollege?->college?->name ?? 'N/A',
                        'created_at' => $award->created_at,
                        'description' => $award->description,
                        'date_received' => $award->date_received
                    ];
                }),
            'international_partners' => InternationalPartner::with(['user', 'campusCollege.campus', 'campusCollege.college'])
                ->where('user_id', '!=', $user->id)
                ->where('is_archived', false)
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($partner) {
                    return [
                        'id' => $partner->id,
                        'name' => $partner->agency_partner,
                        'type' => 'International Partner',
                        'user_name' => $partner->user->name ?? 'Unknown User',
                        'campus' => $partner->campusCollege?->campus?->name ?? 'N/A',
                        'college' => $partner->campusCollege?->college?->name ?? 'N/A',
                        'created_at' => $partner->created_at,
                        'description' => $partner->activity_conducted,
                        'location' => $partner->location
                    ];
                })
        ];

        return Inertia::render('user/dashboard', [
            'userStats' => $userStats,
            'recentSubmissions' => $recentSubmissions,
        ]);
    }
}
