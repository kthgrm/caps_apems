<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Campus;
use App\Models\College;
use App\Models\Modalities;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ModalitiesController extends Controller
{
    public function campuses()
    {
        $campuses = Campus::withCount([
            'projects' => function ($query) {
                $query->whereHas('modalities', function ($modalityQuery) {
                    $modalityQuery->where('is_archived', false);
                })->where('is_archived', false);
            }
        ])->get();

        return Inertia::render('admin/project-activities/modalities/campus', [
            'campuses' => $campuses,
        ]);
    }

    public function colleges(Campus $campus)
    {
        return Inertia::render('admin/project-activities/modalities/college', [
            'campus' => $campus,
            'colleges' => $campus->colleges()->withCount([
                'projects' => function ($query) use ($campus) {
                    $query->whereHas('campusCollege', function ($subQuery) use ($campus) {
                        $subQuery->where('campus_id', $campus->id);
                    })->whereHas('modalities', function ($modalityQuery) {
                        $modalityQuery->where('is_archived', false);
                    })->where('is_archived', false);
                }
            ])->get(),
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
