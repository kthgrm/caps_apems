<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Award;
use App\Models\Campus;
use App\Models\College;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AwardController extends Controller
{
    public function campuses()
    {
        $campuses = Campus::withCount([
            'awards' => function ($query) {
                $query->where('is_archived', false);
            }
        ])->get();

        return Inertia::render('admin/awards/campus', [
            'campuses' => $campuses,
        ]);
    }

    public function colleges(Campus $campus)
    {
        return Inertia::render('admin/awards/college', [
            'campus' => $campus,
            'colleges' => $campus->colleges()->withCount([
                'awards' => function ($query) use ($campus) {
                    $query->whereHas('campusCollege', function ($subQuery) use ($campus) {
                        $subQuery->where('campus_id', $campus->id);
                    })->where('is_archived', false);
                }
            ])->get(),
        ]);
    }

    public function awards(Campus $campus, College $college)
    {
        $awards = $college->awards()
            ->whereHas('campusCollege', function ($query) use ($campus) {
                $query->where('campus_id', $campus->id);
            })
            ->where('is_archived', false)
            ->with(['campusCollege.campus', 'campusCollege.college', 'user'])
            ->get();

        return Inertia::render('admin/awards/awards', [
            'campus' => $campus,
            'college' => $college,
            'awards' => $awards
        ]);
    }

    public function awardDetails(Award $award)
    {
        $award->load(['campusCollege.campus', 'campusCollege.college', 'user']);
        return Inertia::render('admin/awards/award', [
            'award' => $award,
        ]);
    }
}
