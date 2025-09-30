<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Project;
use App\Models\Award;
use App\Models\ImpactAssessment;
use App\Models\InternationalPartner;
use App\Models\User;
use App\Models\Campus;
use App\Models\College;
use App\Models\Modalities;
use App\Models\Resolution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Display the audit trail page.
     */
    public function auditTrail(Request $request): Response
    {
        $query = AuditLog::with(['user'])
            ->orderBy('created_at', 'desc');

        // Filter by user if provided
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by action if provided
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        // Filter by model type if provided
        if ($request->filled('auditable_type')) {
            $auditableType = $request->auditable_type;
            $query->where(function ($q) use ($auditableType) {
                // Check if it's already a full class name
                if (class_exists($auditableType)) {
                    $q->where('auditable_type', $auditableType);
                } else {
                    // If it's just the basename, search for classes ending with this name
                    $q->where('auditable_type', 'like', "%\\{$auditableType}");
                }
            });
        }

        // Filter by date range if provided
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search in description
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%")
                    ->orWhere('auditable_type', 'like', "%{$search}%");
            });
        }

        $auditLogs = $query->paginate(25)->withQueryString();

        // Get unique values for filters
        $actions = AuditLog::distinct()->pluck('action')->filter()->sort()->values();
        $auditableTypes = AuditLog::distinct()->pluck('auditable_type')->filter()
            ->map(fn($type) => class_basename($type))
            ->unique()
            ->sort()
            ->values();

        return Inertia::render('admin/reports/audit-trail/index', [
            'auditLogs' => $auditLogs,
            'actions' => $actions,
            'auditableTypes' => $auditableTypes,
            'filters' => $request->only(['user_id', 'action', 'auditable_type', 'date_from', 'date_to', 'search'])
        ]);
    }

    /**
     * Generate PDF report for audit trail.
     */
    public function auditTrailPdf(Request $request)
    {
        $query = AuditLog::with(['user'])
            ->orderBy('created_at', 'desc');

        // Apply the same filters as the main auditTrail method
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('auditable_type')) {
            $auditableType = $request->auditable_type;
            $query->where(function ($q) use ($auditableType) {
                if (class_exists($auditableType)) {
                    $q->where('auditable_type', $auditableType);
                } else {
                    $q->where('auditable_type', 'like', "%\\{$auditableType}");
                }
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%")
                    ->orWhere('auditable_type', 'like', "%{$search}%");
            });
        }

        // Get all audit logs without pagination for PDF
        $auditLogs = $query->get();

        // Calculate statistics
        $totalLogs = $auditLogs->count();
        $uniqueUsers = $auditLogs->pluck('user_id')->unique()->count();
        $actionCounts = $auditLogs->groupBy('action')->map->count();
        $modelCounts = $auditLogs->groupBy(function ($log) {
            return $log->auditable_type ? class_basename($log->auditable_type) : 'Unknown';
        })->map->count();

        // Prepare data for PDF
        $data = [
            'auditLogs' => $auditLogs,
            'statistics' => [
                'total_logs' => $totalLogs,
                'unique_users' => $uniqueUsers,
                'action_counts' => $actionCounts,
                'model_counts' => $modelCounts,
            ],
            'filters' => $request->only([
                'user_id',
                'action',
                'auditable_type',
                'date_from',
                'date_to',
                'search'
            ]),
            'generated_at' => now()->format('F d, Y \a\t h:i A'),
            'generated_by' => Auth::user()?->name ?? 'Unknown User',
        ];

        $pdf = Pdf::loadView('reports.audit-trail-pdf', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('audit-trail-report-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Display the projects report page.
     */
    public function projects(Request $request): Response
    {
        $query = Project::with(['user', 'campusCollege.campus', 'campusCollege.college'])
            ->where('is_archived', false);

        // Filter by campus if provided
        if ($request->filled('campus_id')) {
            $query->whereHas('campusCollege.campus', function ($q) use ($request) {
                $q->where('id', $request->campus_id);
            });
        }

        // Filter by college if provided
        if ($request->filled('college_id')) {
            $query->whereHas('campusCollege.college', function ($q) use ($request) {
                $q->where('id', $request->college_id);
            });
        }

        // Filter by date range if provided
        if ($request->filled('date_from')) {
            $query->whereDate('start_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('end_date', '<=', $request->date_to);
        }

        // Search in project details
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('leader', 'like', "%{$search}%")
                    ->orWhere('agency_partner', 'like', "%{$search}%");
            });
        }

        // Sort by specified field
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $projects = $query->paginate(25)->withQueryString();

        // Get filter options
        $campuses = Campus::orderBy('name')->get(['id', 'name']);
        $colleges = College::orderBy('name')->get(['id', 'name']);

        // Calculate statistics
        $totalProjects = Project::where('is_archived', false)->count();

        $projectsByMonth = Project::where('is_archived', false)->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->orderByRaw('YEAR(created_at) DESC, MONTH(created_at) DESC')
            ->limit(12)
            ->get()
            ->map(function ($item) {
                return [
                    'period' => date('M Y', mktime(0, 0, 0, $item->month, 1, $item->year)),
                    'count' => $item->count
                ];
            });

        return Inertia::render('admin/reports/projects/index', [
            'projects' => $projects,
            'campuses' => $campuses,
            'colleges' => $colleges,
            'filters' => $request->only([
                'campus_id',
                'college_id',
                'date_from',
                'date_to',
                'search',
                'sort_by',
                'sort_order'
            ]),
            'statistics' => [
                'total_projects' => $totalProjects,
                'projects_by_month' => $projectsByMonth,
            ]
        ]);
    }

    /**
     * Generate PDF report for projects.
     */
    public function projectsPdf(Request $request)
    {
        $query = Project::with(['user', 'campusCollege.campus', 'campusCollege.college'])
            ->where('is_archived', false);

        // Apply the same filters as the main projects method
        if ($request->filled('campus_id')) {
            $query->whereHas('campusCollege.campus', function ($q) use ($request) {
                $q->where('id', $request->campus_id);
            });
        }

        if ($request->filled('college_id')) {
            $query->whereHas('campusCollege.college', function ($q) use ($request) {
                $q->where('id', $request->college_id);
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('start_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('end_date', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('leader', 'like', "%{$search}%")
                    ->orWhere('agency_partner', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Get all projects without pagination for PDF
        $projects = $query->get();

        // Calculate statistics
        $totalProjects = $projects->count();
        $projectsByCategory = $projects->groupBy('category')->map->count();

        // Prepare data for PDF
        $data = [
            'projects' => $projects,
            'statistics' => [
                'total_projects' => $totalProjects,
                'projects_by_category' => $projectsByCategory,
            ],
            'filters' => $request->only([
                'campus_id',
                'college_id',
                'category',
                'date_from',
                'date_to',
                'search',
                'sort_by',
                'sort_order'
            ]),
            'generated_at' => now()->format('F d, Y \a\t h:i A'),
            'generated_by' => Auth::user()?->name ?? 'Unknown User',
        ];

        $pdf = Pdf::loadView('reports.projects-pdf', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('projects-report-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Display the awards report page.
     */
    public function awards(Request $request): Response
    {
        $query = Award::with(['user', 'campusCollege.campus', 'campusCollege.college'])
            ->where('is_archived', false);

        // Filter by campus if provided
        if ($request->filled('campus_id')) {
            $query->whereHas('campusCollege.campus', function ($q) use ($request) {
                $q->where('id', $request->campus_id);
            });
        }

        // Filter by college if provided
        if ($request->filled('college_id')) {
            $query->whereHas('campusCollege.college', function ($q) use ($request) {
                $q->where('id', $request->college_id);
            });
        }

        // Filter by date range if provided
        if ($request->filled('date_from')) {
            $query->whereDate('date_received', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('date_received', '<=', $request->date_to);
        }

        // Search in award details
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('award_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('awarding_body', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('people_involved', 'like', "%{$search}%");
            });
        }

        // Sort by specified field
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $awards = $query->paginate(25)->withQueryString();

        // Get filter options
        $campuses = Campus::orderBy('name')->get(['id', 'name']);
        $colleges = College::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/reports/awards/index', [
            'awards' => $awards,
            'campuses' => $campuses,
            'colleges' => $colleges,
            'filters' => $request->only([
                'campus_id',
                'college_id',
                'date_from',
                'date_to',
                'search',
                'sort_by',
                'sort_order'
            ]),
        ]);
    }

    /**
     * Generate PDF report for awards.
     */
    public function awardsPdf(Request $request)
    {
        $query = Award::with(['user', 'campusCollege.campus', 'campusCollege.college'])
            ->where('is_archived', false);

        // Apply the same filters as the main awards method
        if ($request->filled('campus_id')) {
            $query->whereHas('campusCollege.campus', function ($q) use ($request) {
                $q->where('id', $request->campus_id);
            });
        }

        if ($request->filled('college_id')) {
            $query->whereHas('campusCollege.college', function ($q) use ($request) {
                $q->where('id', $request->college_id);
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('date_received', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('date_received', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('award_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('awarding_body', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('people_involved', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Get all awards without pagination for PDF
        $awards = $query->get();

        // Calculate statistics
        $totalAwards = $awards->count();
        $awardsByYear = $awards->groupBy(function ($award) {
            return $award->date_received ? date('Y', strtotime($award->date_received)) : 'Unknown';
        })->map->count();

        // Prepare data for PDF
        $data = [
            'awards' => $awards,
            'statistics' => [
                'total_awards' => $totalAwards,
                'awards_by_year' => $awardsByYear,
            ],
            'filters' => $request->only([
                'campus_id',
                'college_id',
                'date_from',
                'date_to',
                'search',
                'sort_by',
                'sort_order'
            ]),
            'generated_at' => now()->format('F d, Y \a\t h:i A'),
            'generated_by' => Auth::user()?->name ?? 'Unknown User',
        ];

        $pdf = Pdf::loadView('reports.awards-pdf', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('awards-report-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Display the international partners report page.
     */
    public function internationalPartners(Request $request): Response
    {
        $query = InternationalPartner::with(['user', 'campusCollege.campus', 'campusCollege.college'])
            ->where('is_archived', false);

        // Filter by campus if provided
        if ($request->filled('campus_id')) {
            $query->whereHas('campusCollege.campus', function ($q) use ($request) {
                $q->where('id', $request->campus_id);
            });
        }

        // Filter by college if provided
        if ($request->filled('college_id')) {
            $query->whereHas('campusCollege.college', function ($q) use ($request) {
                $q->where('id', $request->college_id);
            });
        }

        // Filter by date range if provided
        if ($request->filled('date_from')) {
            $query->whereDate('start_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('end_date', '<=', $request->date_to);
        }

        // Filter by participants range if provided
        if ($request->filled('participants_min')) {
            $query->where('number_of_participants', '>=', $request->participants_min);
        }

        if ($request->filled('participants_max')) {
            $query->where('number_of_participants', '<=', $request->participants_max);
        }

        // Search in partnership details
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('agency_partner', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('activity_conducted', 'like', "%{$search}%")
                    ->orWhere('narrative', 'like', "%{$search}%");
            });
        }

        // Sort by specified field
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $internationalPartners = $query->paginate(25)->withQueryString();

        // Get filter options
        $campuses = Campus::orderBy('name')->get(['id', 'name']);
        $colleges = College::orderBy('name')->get(['id', 'name']);

        // Calculate statistics
        $totalPartners = InternationalPartner::where('is_archived', false)->count();
        $totalParticipants = InternationalPartner::where('is_archived', false)->sum('number_of_participants') ?? 0;
        $avgParticipants = InternationalPartner::where('is_archived', false)->avg('number_of_participants') ?? 0;

        $partnersByMonth = InternationalPartner::where('is_archived', false)
            ->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->orderByRaw('YEAR(created_at) DESC, MONTH(created_at) DESC')
            ->limit(12)
            ->get()
            ->map(function ($item) {
                return [
                    'period' => date('M Y', mktime(0, 0, 0, $item->month, 1, $item->year)),
                    'count' => $item->count
                ];
            });

        $partnersByLocation = InternationalPartner::where('is_archived', false)
            ->selectRaw('location, COUNT(*) as count')
            ->whereNotNull('location')
            ->groupBy('location')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'location' => $item->location,
                    'count' => $item->count
                ];
            });

        return Inertia::render('admin/reports/international-partners/index', [
            'internationalPartners' => $internationalPartners,
            'campuses' => $campuses,
            'colleges' => $colleges,
            'filters' => $request->only([
                'campus_id',
                'college_id',
                'date_from',
                'date_to',
                'participants_min',
                'participants_max',
                'search',
                'sort_by',
                'sort_order'
            ]),
            'statistics' => [
                'total_partners' => $totalPartners,
                'total_participants' => $totalParticipants,
                'avg_participants' => $avgParticipants,
                'partners_by_month' => $partnersByMonth,
                'partners_by_location' => $partnersByLocation,
            ]
        ]);
    }

    /**
     * Generate PDF report for international partners.
     */
    public function internationalPartnersPdf(Request $request)
    {
        $query = InternationalPartner::with(['user', 'campusCollege.campus', 'campusCollege.college'])
            ->where('is_archived', false);

        // Apply the same filters as the main internationalPartners method
        if ($request->filled('campus_id')) {
            $query->whereHas('campusCollege.campus', function ($q) use ($request) {
                $q->where('id', $request->campus_id);
            });
        }

        if ($request->filled('college_id')) {
            $query->whereHas('campusCollege.college', function ($q) use ($request) {
                $q->where('id', $request->college_id);
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('start_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('end_date', '<=', $request->date_to);
        }

        if ($request->filled('participants_min')) {
            $query->where('number_of_participants', '>=', $request->participants_min);
        }

        if ($request->filled('participants_max')) {
            $query->where('number_of_participants', '<=', $request->participants_max);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('agency_partner', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('activity_conducted', 'like', "%{$search}%")
                    ->orWhere('narrative', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Get all international partners without pagination for PDF
        $internationalPartners = $query->get();

        // Calculate statistics
        $totalPartners = $internationalPartners->count();
        $totalParticipants = $internationalPartners->sum('number_of_participants') ?? 0;
        $avgParticipants = $internationalPartners->avg('number_of_participants') ?? 0;
        $partnersByLocation = $internationalPartners->groupBy('location')->map->count();

        // Prepare data for PDF
        $data = [
            'internationalPartners' => $internationalPartners,
            'statistics' => [
                'total_partners' => $totalPartners,
                'total_participants' => $totalParticipants,
                'avg_participants' => $avgParticipants,
                'partners_by_location' => $partnersByLocation,
            ],
            'filters' => $request->only([
                'campus_id',
                'college_id',
                'date_from',
                'date_to',
                'participants_min',
                'participants_max',
                'search',
                'sort_by',
                'sort_order'
            ]),
            'generated_at' => now()->format('F d, Y \a\t h:i A'),
            'generated_by' => Auth::user()?->name ?? 'Unknown User',
        ];

        $pdf = Pdf::loadView('reports.international-partners-pdf', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('international-partners-report-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Display the users report page.
     */
    public function users(Request $request): Response
    {
        $query = User::with(['campusCollege.campus', 'campusCollege.college']);

        // Filter by campus if provided
        if ($request->filled('campus_id')) {
            $query->whereHas('campusCollege.campus', function ($q) use ($request) {
                $q->where('id', $request->campus_id);
            });
        }

        // Filter by college if provided
        if ($request->filled('college_id')) {
            $query->whereHas('campusCollege.college', function ($q) use ($request) {
                $q->where('id', $request->college_id);
            });
        }

        // Filter by user type if provided
        if ($request->filled('user_type')) {
            if ($request->user_type === 'admin') {
                $query->where('is_admin', true);
            } elseif ($request->user_type === 'regular') {
                $query->where('is_admin', false);
            }
        }

        // Filter by status if provided
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Filter by registration date range if provided
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search in user details
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sort by specified field
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate(25)->withQueryString();

        // Get filter options
        $campuses = Campus::orderBy('name')->get(['id', 'name']);
        $colleges = College::orderBy('name')->get(['id', 'name']);

        // Calculate statistics
        $totalUsers = User::count();
        $adminUsers = User::where('is_admin', true)->count();
        $activeUsers = User::where('is_active', true)->count();
        $inactiveUsers = User::where('is_active', false)->count();

        $usersByMonth = User::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->orderByRaw('YEAR(created_at) DESC, MONTH(created_at) DESC')
            ->limit(12)
            ->get()
            ->map(function ($item) {
                return [
                    'period' => date('M Y', mktime(0, 0, 0, $item->month, 1, $item->year)),
                    'count' => $item->count
                ];
            });

        $usersByCampus = User::with('campusCollege.campus')
            ->get()
            ->groupBy(function ($user) {
                return $user->campusCollege->campus->name ?? 'No Campus';
            })
            ->map(function ($users) {
                return $users->count();
            });

        $usersByCollege = User::with('campusCollege.college')
            ->get()
            ->groupBy(function ($user) {
                return $user->campusCollege->college->name ?? 'No College';
            })
            ->map(function ($users) {
                return $users->count();
            });

        return Inertia::render('admin/reports/users/index', [
            'users' => $users,
            'campuses' => $campuses,
            'colleges' => $colleges,
            'filters' => $request->only([
                'campus_id',
                'college_id',
                'user_type',
                'status',
                'date_from',
                'date_to',
                'search',
                'sort_by',
                'sort_order'
            ]),
            'statistics' => [
                'total_users' => $totalUsers,
                'admin_users' => $adminUsers,
                'active_users' => $activeUsers,
                'inactive_users' => $inactiveUsers,
                'users_by_month' => $usersByMonth,
                'users_by_campus' => $usersByCampus,
                'users_by_college' => $usersByCollege,
            ]
        ]);
    }

    /**
     * Generate PDF report for users.
     */
    public function usersPdf(Request $request)
    {
        $query = User::with(['campusCollege.campus', 'campusCollege.college']);

        // Apply the same filters as the main users method
        if ($request->filled('campus_id')) {
            $query->whereHas('campusCollege.campus', function ($q) use ($request) {
                $q->where('id', $request->campus_id);
            });
        }

        if ($request->filled('college_id')) {
            $query->whereHas('campusCollege.college', function ($q) use ($request) {
                $q->where('id', $request->college_id);
            });
        }

        if ($request->filled('user_type')) {
            if ($request->user_type === 'admin') {
                $query->where('is_admin', true);
            } elseif ($request->user_type === 'regular') {
                $query->where('is_admin', false);
            }
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Get all users without pagination for PDF
        $users = $query->get();

        // Calculate statistics
        $totalUsers = $users->count();
        $adminUsers = $users->where('is_admin', true)->count();
        $activeUsers = $users->where('is_active', true)->count();
        $inactiveUsers = $users->where('is_active', false)->count();

        $usersByCampus = $users->groupBy(function ($user) {
            return $user->campusCollege->campus->name ?? 'No Campus';
        })->map->count();

        $usersByCollege = $users->groupBy(function ($user) {
            return $user->campusCollege->college->name ?? 'No College';
        })->map->count();

        // Prepare data for PDF
        $data = [
            'users' => $users,
            'statistics' => [
                'total_users' => $totalUsers,
                'admin_users' => $adminUsers,
                'active_users' => $activeUsers,
                'inactive_users' => $inactiveUsers,
                'users_by_campus' => $usersByCampus,
                'users_by_college' => $usersByCollege,
            ],
            'filters' => $request->only([
                'campus_id',
                'college_id',
                'user_type',
                'status',
                'date_from',
                'date_to',
                'search',
                'sort_by',
                'sort_order'
            ]),
            'generated_at' => now()->format('F d, Y \a\t h:i A'),
            'generated_by' => Auth::user()?->name ?? 'Unknown User',
        ];

        $pdf = Pdf::loadView('reports.users-pdf', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('users-report-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Display the modalities report page.
     */
    public function modalities(Request $request): Response
    {
        $query = Modalities::with(['user', 'project.campusCollege.campus', 'project.campusCollege.college'])
            ->where('is_archived', false);

        // Filter by campus if provided
        if ($request->filled('campus_id')) {
            $query->whereHas('project.campusCollege', function ($q) use ($request) {
                $q->where('campus_id', $request->campus_id);
            });
        }

        // Filter by college if provided
        if ($request->filled('college_id')) {
            $query->whereHas('project.campusCollege', function ($q) use ($request) {
                $q->where('college_id', $request->college_id);
            });
        }

        // Filter by modality type if provided
        if ($request->filled('modality_type')) {
            $query->where('modality', $request->modality_type);
        }

        // Filter by date range if provided
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search in modality details
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('modality', 'like', "%{$search}%")
                    ->orWhere('tv_channel', 'like', "%{$search}%")
                    ->orWhere('radio', 'like', "%{$search}%")
                    ->orWhere('online_link', 'like', "%{$search}%")
                    ->orWhere('partner_agency', 'like', "%{$search}%")
                    ->orWhere('hosted_by', 'like', "%{$search}%")
                    ->orWhereHas('project', function ($projectQuery) use ($search) {
                        $projectQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Sort by specified field
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $modalities = $query->paginate(25)->withQueryString();

        // Get filter options
        $campuses = Campus::orderBy('name')->get(['id', 'name']);
        $colleges = College::orderBy('name')->get(['id', 'name']);

        // Calculate statistics
        $totalModalities = Modalities::where('is_archived', false)->count();

        $modalitiesByType = Modalities::where('is_archived', false)
            ->selectRaw('modality as type, COUNT(*) as count')
            ->groupBy('modality')
            ->orderByDesc('count')
            ->get()
            ->toArray();

        $modalitiesByMonth = Modalities::where('is_archived', false)
            ->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->orderByRaw('YEAR(created_at) DESC, MONTH(created_at) DESC')
            ->limit(12)
            ->get()
            ->map(function ($item) {
                return [
                    'period' => date('M Y', mktime(0, 0, 0, $item->month, 1, $item->year)),
                    'count' => $item->count
                ];
            });

        $modalitiesByCollege = Modalities::where('is_archived', false)
            ->whereHas('project.campusCollege.college')
            ->with('project.campusCollege.college')
            ->get()
            ->groupBy(function ($modality) {
                return $modality->project->campusCollege->college->name ?? 'No College';
            })
            ->map(function ($items, $collegeName) {
                return [
                    'college' => $collegeName,
                    'count' => $items->count()
                ];
            })
            ->values()
            ->sortByDesc('count')
            ->take(10)
            ->toArray();

        return Inertia::render('admin/reports/modalities/index', [
            'modalities' => $modalities,
            'campuses' => $campuses,
            'colleges' => $colleges,
            'filters' => $request->only([
                'campus_id',
                'college_id',
                'modality_type',
                'date_from',
                'date_to',
                'search',
                'sort_by',
                'sort_order'
            ]),
            'statistics' => [
                'total_modalities' => $totalModalities,
                'modalities_by_type' => $modalitiesByType,
                'modalities_by_month' => $modalitiesByMonth,
                'modalities_by_college' => $modalitiesByCollege,
            ]
        ]);
    }

    /**
     * Generate PDF report for modalities.
     */
    public function modalitiesPdf(Request $request)
    {
        $query = Modalities::with(['user', 'project.campusCollege.campus', 'project.campusCollege.college'])
            ->where('is_archived', false);

        // Apply the same filters as the main modalities method
        if ($request->filled('campus_id')) {
            $query->whereHas('project.campusCollege', function ($q) use ($request) {
                $q->where('campus_id', $request->campus_id);
            });
        }

        if ($request->filled('college_id')) {
            $query->whereHas('project.campusCollege', function ($q) use ($request) {
                $q->where('college_id', $request->college_id);
            });
        }

        if ($request->filled('modality_type')) {
            $query->where('modality', $request->modality_type);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('modality', 'like', "%{$search}%")
                    ->orWhere('tv_channel', 'like', "%{$search}%")
                    ->orWhere('radio', 'like', "%{$search}%")
                    ->orWhere('online_link', 'like', "%{$search}%")
                    ->orWhere('partner_agency', 'like', "%{$search}%")
                    ->orWhere('hosted_by', 'like', "%{$search}%")
                    ->orWhereHas('project', function ($projectQuery) use ($search) {
                        $projectQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Get all modalities without pagination for PDF
        $modalities = $query->get();

        // Calculate statistics
        $totalModalities = $modalities->count();

        $modalitiesByType = $modalities->groupBy('modality')->map->count();
        $modalitiesByCollege = $modalities->groupBy(function ($modality) {
            return $modality->project->campusCollege->college->name ?? 'No College';
        })->map->count();

        // Prepare data for PDF
        $data = [
            'modalities' => $modalities,
            'statistics' => [
                'total_modalities' => $totalModalities,
                'modalities_by_type' => $modalitiesByType,
                'modalities_by_college' => $modalitiesByCollege,
            ],
            'filters' => $request->only([
                'campus_id',
                'college_id',
                'modality_type',
                'date_from',
                'date_to',
                'search',
                'sort_by',
                'sort_order'
            ]),
            'generated_at' => now()->format('F d, Y \a\t h:i A'),
            'generated_by' => Auth::user()?->name ?? 'Unknown User',
        ];

        $pdf = Pdf::loadView('reports.modalities-pdf', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('modalities-report-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Display the resolutions report page.
     */
    public function resolutions(Request $request): Response
    {
        $query = Resolution::with(['user'])
            ->orderBy('created_at', 'desc');

        // Filter by status if provided
        if ($request->filled('status')) {
            $status = $request->status;
            $currentDate = now();

            switch ($status) {
                case 'active':
                    $query->whereDate('year_of_effectivity', '<=', $currentDate)
                        ->whereDate('expiration', '>=', $currentDate);
                    break;
                case 'expired':
                    $query->whereDate('expiration', '<', $currentDate);
                    break;
                case 'expiring_soon':
                    $query->whereDate('expiration', '>=', $currentDate)
                        ->whereDate('expiration', '<=', $currentDate->copy()->addDays(30));
                    break;
                case 'pending':
                    $query->whereDate('year_of_effectivity', '>', $currentDate);
                    break;
            }
        }

        // Filter by year if provided
        if ($request->filled('year')) {
            $query->whereYear('year_of_effectivity', $request->year);
        }

        // Filter by date range if provided
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search in resolution details
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('resolution_number', 'like', "%{$search}%")
                    ->orWhere('contact_person', 'like', "%{$search}%")
                    ->orWhere('contact_number_email', 'like', "%{$search}%")
                    ->orWhere('partner_agency_organization', 'like', "%{$search}%");
            });
        }

        // Sort by specified field
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $resolutions = $query->paginate(25)->withQueryString();

        // Calculate statistics
        $currentDate = now();
        $totalResolutions = Resolution::count();
        $activeResolutions = Resolution::whereDate('year_of_effectivity', '<=', $currentDate)
            ->whereDate('expiration', '>=', $currentDate)
            ->count();
        $expiredResolutions = Resolution::whereDate('expiration', '<', $currentDate)->count();
        $expiringSoon = Resolution::whereDate('expiration', '>=', $currentDate)
            ->whereDate('expiration', '<=', $currentDate->copy()->addDays(30))
            ->count();

        $resolutionsByYear = Resolution::selectRaw('YEAR(year_of_effectivity) as year, COUNT(*) as count')
            ->groupByRaw('YEAR(year_of_effectivity)')
            ->orderByDesc('year')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'year' => (string) $item->year,
                    'count' => $item->count
                ];
            });

        $resolutionsByMonth = Resolution::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->orderByRaw('YEAR(created_at) DESC, MONTH(created_at) DESC')
            ->limit(12)
            ->get()
            ->map(function ($item) {
                return [
                    'period' => date('M Y', mktime(0, 0, 0, $item->month, 1, $item->year)),
                    'count' => $item->count
                ];
            });

        return Inertia::render('admin/reports/resolutions/index', [
            'resolutions' => $resolutions,
            'filters' => $request->only([
                'status',
                'year',
                'date_from',
                'date_to',
                'search',
                'sort_by',
                'sort_order'
            ]),
            'statistics' => [
                'total_resolutions' => $totalResolutions,
                'active_resolutions' => $activeResolutions,
                'expired_resolutions' => $expiredResolutions,
                'expiring_soon' => $expiringSoon,
                'resolutions_by_year' => $resolutionsByYear,
                'resolutions_by_month' => $resolutionsByMonth,
            ]
        ]);
    }

    /**
     * Generate PDF report for resolutions.
     */
    public function resolutionsPdf(Request $request)
    {
        $query = Resolution::with(['user'])
            ->orderBy('created_at', 'desc');

        // Apply the same filters as the main resolutions method
        if ($request->filled('status')) {
            $status = $request->status;
            $currentDate = now();

            switch ($status) {
                case 'active':
                    $query->whereDate('year_of_effectivity', '<=', $currentDate)
                        ->whereDate('expiration', '>=', $currentDate);
                    break;
                case 'expired':
                    $query->whereDate('expiration', '<', $currentDate);
                    break;
                case 'expiring_soon':
                    $query->whereDate('expiration', '>=', $currentDate)
                        ->whereDate('expiration', '<=', $currentDate->copy()->addDays(30));
                    break;
                case 'pending':
                    $query->whereDate('year_of_effectivity', '>', $currentDate);
                    break;
            }
        }

        if ($request->filled('year')) {
            $query->whereYear('year_of_effectivity', $request->year);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('resolution_number', 'like', "%{$search}%")
                    ->orWhere('contact_person', 'like', "%{$search}%")
                    ->orWhere('contact_number_email', 'like', "%{$search}%")
                    ->orWhere('partner_agency_organization', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Get all resolutions without pagination for PDF
        $resolutions = $query->get();

        // Calculate statistics
        $currentDate = now();
        $totalResolutions = $resolutions->count();
        $activeResolutions = $resolutions->filter(function ($resolution) use ($currentDate) {
            $effectivity = Carbon::parse($resolution->year_of_effectivity);
            $expiration = Carbon::parse($resolution->expiration);
            return $effectivity->lte($currentDate) && $expiration->gte($currentDate);
        })->count();
        $expiredResolutions = $resolutions->filter(function ($resolution) use ($currentDate) {
            $expiration = Carbon::parse($resolution->expiration);
            return $expiration->lt($currentDate);
        })->count();

        // Prepare data for PDF
        $data = [
            'resolutions' => $resolutions,
            'statistics' => [
                'total_resolutions' => $totalResolutions,
                'active_resolutions' => $activeResolutions,
                'expired_resolutions' => $expiredResolutions,
            ],
            'filters' => $request->only([
                'status',
                'year',
                'date_from',
                'date_to',
                'search',
                'sort_by',
                'sort_order'
            ]),
            'generated_at' => now()->format('F d, Y \a\t h:i A'),
            'generated_by' => Auth::user()?->name ?? 'Unknown User',
        ];

        $pdf = Pdf::loadView('reports.resolutions-pdf', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('resolutions-report-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Display the impact assessments report page.
     */
    public function impactAssessments(Request $request): Response
    {
        $query = ImpactAssessment::with(['project', 'project.campusCollege.campus', 'project.campusCollege.college', 'user'])
            ->where('is_archived', false);

        // Filter by campus if provided
        if ($request->filled('campus_id')) {
            $query->whereHas('project.campusCollege.campus', function ($q) use ($request) {
                $q->where('id', $request->campus_id);
            });
        }

        // Filter by college if provided
        if ($request->filled('college_id')) {
            $query->whereHas('project.campusCollege.college', function ($q) use ($request) {
                $q->where('id', $request->college_id);
            });
        }

        // Filter by project if provided
        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        // Filter by beneficiary count range if provided
        if ($request->filled('direct_min')) {
            $query->where('num_direct_beneficiary', '>=', $request->direct_min);
        }

        if ($request->filled('direct_max')) {
            $query->where('num_direct_beneficiary', '<=', $request->direct_max);
        }

        if ($request->filled('indirect_min')) {
            $query->where('num_indirect_beneficiary', '>=', $request->indirect_min);
        }

        if ($request->filled('indirect_max')) {
            $query->where('num_indirect_beneficiary', '<=', $request->indirect_max);
        }

        // Filter by date range if provided
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search in assessment details
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('beneficiary', 'like', "%{$search}%")
                    ->orWhere('geographic_coverage', 'like', "%{$search}%")
                    ->orWhereHas('project', function ($projectQuery) use ($search) {
                        $projectQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if ($sortBy === 'project_name') {
            $query->join('projects', 'impact_assessments.project_id', '=', 'projects.id')
                ->orderBy('projects.name', $sortOrder)
                ->select('impact_assessments.*');
        } elseif ($sortBy === 'campus') {
            $query->join('projects', 'impact_assessments.project_id', '=', 'projects.id')
                ->join('campus_colleges', 'projects.campus_college_id', '=', 'campus_colleges.id')
                ->join('campuses', 'campus_colleges.campus_id', '=', 'campuses.id')
                ->orderBy('campuses.name', $sortOrder)
                ->select('impact_assessments.*');
        } elseif ($sortBy === 'college') {
            $query->join('projects', 'impact_assessments.project_id', '=', 'projects.id')
                ->join('campus_colleges', 'projects.campus_college_id', '=', 'campus_colleges.id')
                ->join('colleges', 'campus_colleges.college_id', '=', 'colleges.id')
                ->orderBy('colleges.name', $sortOrder)
                ->select('impact_assessments.*');
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $assessments = $query->paginate(25)->withQueryString();

        // Statistics
        $totalAssessments = ImpactAssessment::where('is_archived', false)->count();
        $totalDirectBeneficiaries = ImpactAssessment::where('is_archived', false)->sum('num_direct_beneficiary');
        $totalIndirectBeneficiaries = ImpactAssessment::where('is_archived', false)->sum('num_indirect_beneficiary');
        $avgDirectBeneficiaries = ImpactAssessment::where('is_archived', false)->avg('num_direct_beneficiary');

        // Get campuses and colleges for filtering
        $campuses = Campus::all();
        $colleges = College::all();

        // Get available projects for filtering
        $projects = Project::with('campusCollege.campus', 'campusCollege.college')
            ->where('is_archived', false)
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/reports/impact-assessments/index', [
            'assessments' => $assessments,
            'statistics' => [
                'total_assessments' => $totalAssessments,
                'total_direct_beneficiaries' => $totalDirectBeneficiaries,
                'total_indirect_beneficiaries' => $totalIndirectBeneficiaries,
                'avg_direct_beneficiaries' => round($avgDirectBeneficiaries ?? 0, 2),
            ],
            'campuses' => $campuses,
            'colleges' => $colleges,
            'projects' => $projects,
            'filters' => $request->only([
                'campus_id',
                'college_id',
                'project_id',
                'direct_min',
                'direct_max',
                'indirect_min',
                'indirect_max',
                'date_from',
                'date_to',
                'search',
                'sort_by',
                'sort_order'
            ])
        ]);
    }

    /**
     * Generate PDF report for impact assessments.
     */
    public function impactAssessmentsPdf(Request $request)
    {
        $query = ImpactAssessment::with(['project', 'project.campusCollege.campus', 'project.campusCollege.college', 'user'])
            ->where('is_archived', false);

        // Apply the same filters as the main impact assessments method
        if ($request->filled('campus_id')) {
            $query->whereHas('project.campusCollege.campus', function ($q) use ($request) {
                $q->where('id', $request->campus_id);
            });
        }

        if ($request->filled('college_id')) {
            $query->whereHas('project.campusCollege.college', function ($q) use ($request) {
                $q->where('id', $request->college_id);
            });
        }

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->filled('direct_min')) {
            $query->where('num_direct_beneficiary', '>=', $request->direct_min);
        }

        if ($request->filled('direct_max')) {
            $query->where('num_direct_beneficiary', '<=', $request->direct_max);
        }

        if ($request->filled('indirect_min')) {
            $query->where('num_indirect_beneficiary', '>=', $request->indirect_min);
        }

        if ($request->filled('indirect_max')) {
            $query->where('num_indirect_beneficiary', '<=', $request->indirect_max);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('beneficiary', 'like', "%{$search}%")
                    ->orWhere('geographic_coverage', 'like', "%{$search}%")
                    ->orWhereHas('project', function ($projectQuery) use ($search) {
                        $projectQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if ($sortBy === 'project_name') {
            $query->join('projects', 'impact_assessments.project_id', '=', 'projects.id')
                ->orderBy('projects.name', $sortOrder)
                ->select('impact_assessments.*');
        } elseif ($sortBy === 'campus') {
            $query->join('projects', 'impact_assessments.project_id', '=', 'projects.id')
                ->join('campus_colleges', 'projects.campus_college_id', '=', 'campus_colleges.id')
                ->join('campuses', 'campus_colleges.campus_id', '=', 'campuses.id')
                ->orderBy('campuses.name', $sortOrder)
                ->select('impact_assessments.*');
        } elseif ($sortBy === 'college') {
            $query->join('projects', 'impact_assessments.project_id', '=', 'projects.id')
                ->join('campus_colleges', 'projects.campus_college_id', '=', 'campus_colleges.id')
                ->join('colleges', 'campus_colleges.college_id', '=', 'colleges.id')
                ->orderBy('colleges.name', $sortOrder)
                ->select('impact_assessments.*');
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $assessments = $query->get();

        // Statistics
        $totalAssessments = $assessments->count();
        $totalDirectBeneficiaries = $assessments->sum('num_direct_beneficiary');
        $totalIndirectBeneficiaries = $assessments->sum('num_indirect_beneficiary');
        $avgDirectBeneficiaries = $totalAssessments > 0 ? $totalDirectBeneficiaries / $totalAssessments : 0;

        $data = [
            'assessments' => $assessments,
            'statistics' => [
                'total_assessments' => $totalAssessments,
                'total_direct_beneficiaries' => $totalDirectBeneficiaries,
                'total_indirect_beneficiaries' => $totalIndirectBeneficiaries,
                'avg_direct_beneficiaries' => round($avgDirectBeneficiaries, 2),
            ],
            'filters' => $request->only([
                'campus_id',
                'college_id',
                'project_id',
                'direct_min',
                'direct_max',
                'indirect_min',
                'indirect_max',
                'date_from',
                'date_to',
                'search',
                'sort_by',
                'sort_order'
            ]),
            'generated_at' => now()->format('F d, Y \a\t h:i A'),
            'generated_by' => Auth::user()?->name ?? 'Unknown User',
        ];

        $pdf = Pdf::loadView('reports.impact-assessments-pdf', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('impact-assessments-report-' . now()->format('Y-m-d') . '.pdf');
    }
}
