<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::where('user_id', Auth::id())
            ->where('is_archived', false)
            ->get();
        return Inertia::render('user/technology-transfer/project/index', [
            'projects' => $projects,
        ]);
    }

    public function show(Project $project)
    {
        if ($project->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($project->is_archived) {
            abort(404, 'Project not found.');
        }

        return Inertia::render('user/technology-transfer/project/show', [
            'project' => $project,
        ]);
    }

    public function create()
    {
        $user = User::with('campusCollege.campus', 'campusCollege.college')
            ->find(Auth::id());

        return Inertia::render('user/technology-transfer/project/create', [
            'user' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:private,government',
            'purpose' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'budget' => 'required|numeric|min:0',
            'funding_source' => 'required|string|max:255',
            'tags' => 'required|string|max:255',
            'leader' => 'required|string|max:255',
            'deliverables' => 'required|string|max:255',
            'agency_partner' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'required|string|max:255',
            'contact_address' => 'required|string|max:255',
            'copyright' => 'required|in:yes,no,pending',
            'ip_details' => 'required|string|max:255',

            'is_assessment_based' => 'required|boolean',
            'monitoring_evaluation_plan' => 'nullable|string',
            'sustainability_plan' => 'nullable|string',
            'reporting_frequency' => 'required|integer|min:0',

            'attachment' => 'nullable|file|mimes:jpeg,png,jpg|max:1024',
            'attachment_link' => 'nullable|url',

            'remarks' => 'nullable|string',
        ]);

        $project = new Project();
        $project->user_id = Auth::user()->id;
        $project->campus_college_id = Auth::user()->campus_college_id;
        $project->fill($validated);

        if ($request->hasFile('attachment')) {
            $project->attachment_path = $request->file('attachment')->store('project-attachment', 'public');
        }
        $project->attachment_link = $request->input('attachment_link');
        $project->setCreatedAt(now('Asia/Manila'));
        $project->setUpdatedAt(now('Asia/Manila'));
        $project->save();

        return redirect()->route('user.technology-transfer.index')
            ->with('message', 'Project created successfully.');
    }

    public function edit(Project $project)
    {
        if ($project->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($project->is_archived) {
            abort(404, 'Project not found.');
        }

        return Inertia::render('user/technology-transfer/project/edit', [
            'project' => $project,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        if ($project->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($project->is_archived) {
            abort(404, 'Project not found.');
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:private,government',
            'purpose' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'budget' => 'required|numeric|min:0',
            'funding_source' => 'required|string|max:255',
            'tags' => 'required|string|max:255',
            'leader' => 'required|string|max:255',
            'deliverables' => 'required|string|max:255',
            'agency_partner' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'required|string|max:255',
            'contact_address' => 'required|string|max:255',
            'copyright' => 'required|in:yes,no,pending',
            'ip_details' => 'required|string|max:255',

            'is_assessment_based' => 'required|boolean',
            'monitoring_evaluation_plan' => 'nullable|string',
            'sustainability_plan' => 'nullable|string',
            'reporting_frequency' => 'required|integer|min:0',

            'attachment' => 'nullable|file|mimes:jpeg,png,jpg|max:1024',
            'attachment_link' => 'nullable|url',

            'remarks' => 'nullable|string',
        ]);

        $project->fill($data);

        if ($request->hasFile('attachment')) {
            // Delete old attachment if exists
            if ($project->attachment_path && Storage::disk('public')->exists($project->attachment_path)) {
                Storage::disk('public')->delete($project->attachment_path);
            }
            $project->attachment_path = $request->file('attachment')->store('project-attachment', 'public');
        }

        $project->save();

        return redirect()->route('user.technology-transfer.index', $project)
            ->with('message', 'Project updated successfully.');
    }

    public function archive(Request $request, Project $project)
    {
        if ($project->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Validate password confirmation
        $request->validate([
            'password' => 'required|string'
        ]);

        // Check if the provided password matches the current user's password
        if (!Hash::check($request->password, Auth::user()->password)) {
            return redirect()->back()
                ->withErrors(['password' => 'The provided password is incorrect.'])
                ->withInput();
        }

        $oldValues = ['is_archived' => $project->is_archived];
        $project->update(['is_archived' => true]);

        // Log the archive action
        AuditLog::log(
            action: 'archive',
            auditable: $project,
            oldValues: $oldValues,
            newValues: ['is_archived' => true],
            description: Auth::user()->name . " archived Project #{$project->id}: {$project->name}"
        );

        return redirect()->back()
            ->with('message', 'Project archived successfully.');
    }
}
