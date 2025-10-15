<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Campus;
use App\Models\College;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TechnologyTransferController extends Controller
{
    public function campuses()
    {
        $campuses = Campus::withCount([
            'projects' => function ($query) {
                $query->where('is_archived', false);
            }
        ])->get();

        return Inertia::render('admin/technology-transfer/campus', [
            'campuses' => $campuses,
        ]);
    }

    public function colleges(Campus $campus)
    {
        return Inertia::render('admin/technology-transfer/colleges', [
            'campus' => $campus,
            'colleges' => $campus->colleges()->withCount([
                'projects' => function ($query) use ($campus) {
                    $query->whereHas('campusCollege', function ($subQuery) use ($campus) {
                        $subQuery->where('campus_id', $campus->id);
                    })->where('is_archived', false);
                }
            ])->get(),
        ]);
    }

    public function projects(Campus $campus, College $college)
    {
        $projects = $college->projects()
            ->whereHas('campusCollege', function ($query) use ($campus) {
                $query->where('campus_id', $campus->id);
            })
            ->where('is_archived', false)
            ->with(['campusCollege.campus', 'campusCollege.college', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/technology-transfer/projects/index', [
            'campus' => $campus,
            'college' => $college,
            'projects' => $projects
        ]);
    }

    public function projectDetails(Project $project)
    {
        if ($project->is_archived) {
            abort(404);
        }

        $project->load(['campusCollege.campus', 'campusCollege.college', 'user']);
        return Inertia::render('admin/technology-transfer/projects/project/index', [
            'project' => $project,
        ]);
    }

    public function projectEdit(Project $project)
    {
        if ($project->is_archived) {
            abort(404);
        }

        $project->load(['campusCollege.campus', 'campusCollege.college', 'user']);
        return Inertia::render('admin/technology-transfer/projects/project/edit', [
            'project' => $project,
        ]);
    }

    /**
     * Update a project.
     */
    public function projectUpdate(Request $request, Project $project)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:private,government',
            'purpose' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'tags' => 'required|string|max:255',
            'leader' => 'required|string|max:255',
            'deliverables' => 'nullable|string|max:255',
            'agency_partner' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'required|string|max:255',
            'contact_address' => 'nullable|string',
            'copyright' => 'required|in:yes,no,pending',
            'ip_details' => 'nullable|string',
            'is_assessment_based' => 'boolean',
            'monitoring_evaluation_plan' => 'nullable|string',
            'sustainability_plan' => 'nullable|string',
            'reporting_frequency' => 'nullable|integer|min:0|max:12',
            'attachments.*' => 'nullable|file|mimes:jpeg,png,jpg,pdf,doc,docx|max:10240',
            'attachment_link' => 'nullable|url',
        ]);

        // Store old values for audit log
        $oldValues = $project->toArray();

        // Handle multiple file uploads for update
        if ($request->hasFile('attachments')) {
            // Delete old attachments if they exist
            if ($project->attachment_paths) {
                foreach ($project->attachment_paths as $oldPath) {
                    if (Storage::disk('spaces')->exists($oldPath)) {
                        Storage::disk('spaces')->delete($oldPath);
                    }
                }
            }

            // Upload new attachments
            $attachmentPaths = [];
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('project-attachments', 'spaces');
                $attachmentPaths[] = $path;
            }
            $project->attachment_paths = $attachmentPaths;
        }

        // Update project
        $project->update($data);

        // Log the update action
        AuditLog::log(
            action: 'update',
            auditable: $project,
            oldValues: $oldValues,
            newValues: $project->fresh()->toArray(),
            description: Auth::user()->name . " (Admin) updated Project #{$project->id}: {$project->name}"
        );

        return redirect()->route('admin.technology-transfer.project', $project)
            ->with('message', 'Project updated successfully.');
    }

    /**
     * Archive a project.
     */
    public function archive(Request $request, Project $project)
    {
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

        return redirect()->route('admin.technology-transfer.projects', [
            'campus' => $project->campusCollege->campus_id,
            'college' => $project->campusCollege->college_id
        ])->with('success', 'Project archived successfully.');
    }
}
