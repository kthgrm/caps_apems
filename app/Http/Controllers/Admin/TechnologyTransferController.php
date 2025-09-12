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
            ->get();

        return Inertia::render('admin/technology-transfer/projects/index', [
            'campus' => $campus,
            'college' => $college,
            'projects' => $projects
        ]);
    }

    public function projectDetails(Project $project)
    {
        $project->load(['campusCollege.campus', 'campusCollege.college', 'user']);
        return Inertia::render('admin/technology-transfer/projects/project/index', [
            'project' => $project,
        ]);
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
            description: Auth::user()->name . " (Admin) archived Project #{$project->id}: {$project->name}"
        );

        return redirect()->back()->with('success', 'Project archived successfully.');
    }
}
