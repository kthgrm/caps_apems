<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Campus;
use App\Models\College;
use App\Models\Modalities;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ModalitiesController extends Controller
{
    public function campuses()
    {
        $campuses = Campus::all();

        // Add modalities count for each campus
        $campuses = $campuses->map(function ($campus) {
            $modalitiesCount = Modalities::join('projects', 'modalities.project_id', '=', 'projects.id')
                ->join('campus_college', 'projects.campus_college_id', '=', 'campus_college.id')
                ->where('campus_college.campus_id', $campus->id)
                ->where('modalities.is_archived', false)
                ->count();

            $campus->modalities_count = $modalitiesCount;
            return $campus;
        });

        return Inertia::render('admin/project-activities/modalities/campus', [
            'campuses' => $campuses,
        ]);
    }

    public function colleges(Campus $campus)
    {
        $colleges = $campus->colleges()->get();

        // Add modalities count for each college within this campus
        $colleges = $colleges->map(function ($college) use ($campus) {
            $modalitiesCount = Modalities::join('projects', 'modalities.project_id', '=', 'projects.id')
                ->join('campus_college', 'projects.campus_college_id', '=', 'campus_college.id')
                ->where('campus_college.campus_id', $campus->id)
                ->where('campus_college.college_id', $college->id)
                ->where('modalities.is_archived', false)
                ->count();

            $college->modalities_count = $modalitiesCount;
            return $college;
        });

        return Inertia::render('admin/project-activities/modalities/college', [
            'campus' => $campus,
            'colleges' => $colleges,
        ]);
    }

    public function modalities(Campus $campus, College $college)
    {
        $modalities = Modalities::whereHas('project', function ($query) use ($college) {
            $query->whereHas('campusCollege', function ($query) use ($college) {
                $query->where('college_id', $college->id);
            })->where('is_archived', false);
        })->where('is_archived', false)->with(['project.campusCollege.campus', 'project.campusCollege.college', 'user'])->get();

        return Inertia::render('admin/project-activities/modalities/modalities', [
            'campus' => $campus,
            'college' => $college,
            'modalities' => $modalities
        ]);
    }

    public function modalityDetails(Modalities $modality)
    {
        $modality->load(['project', 'project.campusCollege.campus', 'project.campusCollege.college', 'user']);

        return Inertia::render('admin/project-activities/modalities/modality', [
            'modality' => $modality,
        ]);
    }

    public function modalityEdit(Modalities $modality)
    {
        if ($modality->is_archived) {
            abort(404);
        }

        $modality->load(['project', 'project.campusCollege.campus', 'project.campusCollege.college', 'user']);

        $projects = collect();
        if ($modality->project && $modality->project->campusCollege) {
            $campusCollegeId = $modality->project->campusCollege->id;
            $projects = Project::whereHas('campusCollege', function ($query) use ($campusCollegeId) {
                $query->where('id', $campusCollegeId);
            })->get()->map(function ($project) {
                return [
                    'value' => $project->id,
                    'label' => $project->name,
                ];
            });
        }

        return Inertia::render('admin/project-activities/modalities/edit', [
            'modality' => $modality,
            'projects' => $projects,
        ]);
    }

    public function modalityUpdate(Request $request, Modalities $modality)
    {
        if ($modality->is_archived) {
            abort(404, 'Modality not found.');
        }

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'modality' => 'required|string|max:255',
            'tv_channel' => 'nullable|string|max:255',
            'radio' => 'nullable|string|max:255',
            'online_link' => 'nullable|url|max:255',
            'time_air' => 'nullable|string|max:255',
            'period' => 'nullable|string|max:255',
            'partner_agency' => 'nullable|string|max:255',
            'hosted_by' => 'nullable|string|max:255',
        ]);

        // Store old values for audit log
        $oldValues = $modality->toArray();

        $modality->update($validated);

        // Log the update action
        AuditLog::log(
            action: 'update',
            auditable: $modality,
            oldValues: $oldValues,
            newValues: $validated,
            description: Auth::user()->name . " (Admin) updated Modality #{$modality->id} for project: {$modality->project?->name}"
        );

        return redirect()->route('admin.modalities.modality', $modality)
            ->with('success', 'Modality updated successfully.');
    }

    /**
     * Archive a modality.
     */
    public function archive(Request $request, Modalities $modality)
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

        $oldValues = ['is_archived' => $modality->is_archived];
        $modality->update(['is_archived' => true]);

        // Log the archive action
        AuditLog::log(
            action: 'archive',
            auditable: $modality,
            oldValues: $oldValues,
            newValues: ['is_archived' => true],
            description: Auth::user()->name . " (Admin) archived Modality #{$modality->id} for project: {$modality->project?->name}"
        );

        return redirect()->back()->with('success', 'Modality archived successfully.');
    }
}
