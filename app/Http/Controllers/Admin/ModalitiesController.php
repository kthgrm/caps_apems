<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campus;
use App\Models\College;
use App\Models\Modalities;
use Illuminate\Http\Request;
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
}
