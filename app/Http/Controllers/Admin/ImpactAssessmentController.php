<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Campus;
use App\Models\College;
use App\Models\ImpactAssessment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ImpactAssessmentController extends Controller
{
    public function campuses()
    {
        $campuses = Campus::withCount([
            'projects' => function ($query) {
                $query->whereHas('impactAssessment', function ($assessmentQuery) {
                    $assessmentQuery->where('is_archived', false);
                })->where('is_archived', false);
            }
        ])->get();

        return Inertia::render('admin/project-activities/impact-assessment/campus', [
            'campuses' => $campuses,
        ]);
    }

    public function colleges(Campus $campus)
    {
        return Inertia::render('admin/project-activities/impact-assessment/college', [
            'campus' => $campus,
            'colleges' => $campus->colleges()->withCount([
                'projects' => function ($query) use ($campus) {
                    $query->whereHas('campusCollege', function ($subQuery) use ($campus) {
                        $subQuery->where('campus_id', $campus->id);
                    })->whereHas('impactAssessment', function ($assessmentQuery) {
                        $assessmentQuery->where('is_archived', false);
                    })->where('is_archived', false);
                }
            ])->get(),
        ]);
    }

    public function assessments(Campus $campus, College $college)
    {
        $assessments = ImpactAssessment::whereHas('project', function ($query) use ($college) {
            $query->whereHas('campusCollege', function ($query) use ($college) {
                $query->where('college_id', $college->id);
            })->where('is_archived', false);
        })->where('is_archived', false)->with(['project.campusCollege.campus', 'project.campusCollege.college', 'user'])->get();

        return Inertia::render('admin/project-activities/impact-assessment/impact-assessments', [
            'campus' => $campus,
            'college' => $college,
            'assessments' => $assessments
        ]);
    }

    public function assessmentDetails(ImpactAssessment $impactAssessment)
    {
        $impactAssessment->load(['project', 'project.campusCollege.campus', 'project.campusCollege.college', 'user']);

        return Inertia::render('admin/project-activities/impact-assessment/impact-assessment', [
            'assessment' => $impactAssessment,
        ]);
    }

    /**
     * Archive an impact assessment.
     */
    public function archive(Request $request, ImpactAssessment $impactAssessment)
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

        $oldValues = ['is_archived' => $impactAssessment->is_archived];
        $impactAssessment->update(['is_archived' => true]);

        // Log the archive action
        AuditLog::log(
            action: 'archive',
            auditable: $impactAssessment,
            oldValues: $oldValues,
            newValues: ['is_archived' => true],
            description: Auth::user()->name . " (Admin) archived Impact Assessment #{$impactAssessment->id} for project: {$impactAssessment->project?->name}"
        );

        return redirect()->back()->with('success', 'Impact assessment archived successfully.');
    }
}
