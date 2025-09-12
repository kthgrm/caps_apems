<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campus;
use App\Models\College;
use App\Models\ImpactAssessment;
use Illuminate\Http\Request;
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
}
