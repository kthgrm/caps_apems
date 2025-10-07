<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Campus;
use App\Models\College;
use App\Models\ImpactAssessment;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ImpactAssessmentController extends Controller
{
    public function campuses()
    {
        $campuses = Campus::all();

        // Add impact assessments count for each campus
        $campuses = $campuses->map(function ($campus) {
            $assessmentsCount = ImpactAssessment::join('projects', 'impact_assessments.project_id', '=', 'projects.id')
                ->join('campus_college', 'projects.campus_college_id', '=', 'campus_college.id')
                ->where('campus_college.campus_id', $campus->id)
                ->where('impact_assessments.is_archived', false)
                ->count();

            $campus->impact_assessments_count = $assessmentsCount;
            return $campus;
        });

        return Inertia::render('admin/project-activities/impact-assessment/campus', [
            'campuses' => $campuses,
        ]);
    }

    public function colleges(Campus $campus)
    {
        $colleges = $campus->colleges()->get();

        // Add impact assessments count for each college within this campus
        $colleges = $colleges->map(function ($college) use ($campus) {
            $assessmentsCount = ImpactAssessment::join('projects', 'impact_assessments.project_id', '=', 'projects.id')
                ->join('campus_college', 'projects.campus_college_id', '=', 'campus_college.id')
                ->where('campus_college.campus_id', $campus->id)
                ->where('campus_college.college_id', $college->id)
                ->where('impact_assessments.is_archived', false)
                ->count();

            $college->impact_assessments_count = $assessmentsCount;
            return $college;
        });

        return Inertia::render('admin/project-activities/impact-assessment/college', [
            'campus' => $campus,
            'colleges' => $colleges,
        ]);
    }

    public function assessments(Campus $campus, College $college)
    {
        $assessments = ImpactAssessment::whereHas('project', function ($query) use ($college) {
            $query->whereHas('campusCollege', function ($query) use ($college) {
                $query->where('college_id', $college->id);
            });
        })->where('is_archived', false)->with(['project.campusCollege.campus', 'project.campusCollege.college', 'user'])->get();

        return Inertia::render('admin/project-activities/impact-assessment/impact-assessments', [
            'campus' => $campus,
            'college' => $college,
            'assessments' => $assessments
        ]);
    }

    public function assessmentDetails(ImpactAssessment $impactAssessment)
    {
        if ($impactAssessment->is_archived) {
            abort(404);
        }

        $impactAssessment->load(['project', 'project.campusCollege.campus', 'project.campusCollege.college', 'user']);

        return Inertia::render('admin/project-activities/impact-assessment/impact-assessment', [
            'assessment' => $impactAssessment,
        ]);
    }

    /**
     * Show the form for editing the specified impact assessment.
     */
    public function assessmentEdit(ImpactAssessment $impactAssessment)
    {
        if ($impactAssessment->is_archived) {
            abort(404);
        }

        $impactAssessment->load(['project', 'project.campusCollege.campus', 'project.campusCollege.college', 'user']);

        // Get all projects from the same campus and college
        $projects = collect();
        if ($impactAssessment->project && $impactAssessment->project->campusCollege) {
            $campusCollegeId = $impactAssessment->project->campusCollege->id;
            $projects = Project::whereHas('campusCollege', function ($query) use ($campusCollegeId) {
                $query->where('id', $campusCollegeId);
            })->get()->map(function ($project) {
                return [
                    'value' => $project->id,
                    'label' => $project->name,
                ];
            });
        }

        return Inertia::render('admin/project-activities/impact-assessment/edit', [
            'assessment' => $impactAssessment,
            'projects' => $projects,
        ]);
    }

    /**
     * Update the specified impact assessment.
     */
    public function assessmentUpdate(Request $request, ImpactAssessment $impactAssessment)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'beneficiary' => 'required|string|max:255',
            'geographic_coverage' => 'required|string|max:255',
            'num_direct_beneficiary' => 'required|integer|min:0',
            'num_indirect_beneficiary' => 'required|integer|min:0',
        ]);

        $oldValues = $impactAssessment->only(['project_id', 'beneficiary', 'geographic_coverage', 'num_direct_beneficiary', 'num_indirect_beneficiary']);

        $impactAssessment->fill($data);
        $impactAssessment->save();

        // Log the update action
        AuditLog::log(
            action: 'update',
            auditable: $impactAssessment,
            oldValues: $oldValues,
            newValues: $data,
            description: Auth::user()->name . " (Admin) updated Impact Assessment #{$impactAssessment->id} for project: {$impactAssessment->project?->name}"
        );

        return redirect()->route('admin.impact-assessment.assessment', $impactAssessment)
            ->with('success', 'Impact assessment updated successfully.');
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
