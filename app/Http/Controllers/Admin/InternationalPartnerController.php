<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campus;
use App\Models\College;
use App\Models\InternationalPartner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InternationalPartnerController extends Controller
{
    public function campuses()
    {
        $campuses = Campus::withCount([
            'internationalPartners' => function ($query) {
                $query->where('is_archived', false);
            }
        ])->get();

        return Inertia::render('admin/international-partners/campus', [
            'campuses' => $campuses,
        ]);
    }

    public function colleges(Campus $campus)
    {
        return Inertia::render('admin/international-partners/college', [
            'campus' => $campus,
            'colleges' => $campus->colleges()->withCount([
                'partnerships' => function ($query) use ($campus) {
                    $query->whereHas('campusCollege', function ($subQuery) use ($campus) {
                        $subQuery->where('campus_id', $campus->id);
                    })->where('is_archived', false);
                }
            ])->get(),
        ]);
    }

    public function partnerships(Campus $campus, College $college)
    {
        $partnerships = $college->partnerships()
            ->whereHas('campusCollege', function ($query) use ($campus) {
                $query->where('campus_id', $campus->id);
            })
            ->where('is_archived', false)
            ->with(['campusCollege.campus', 'campusCollege.college', 'user'])
            ->get();

        return Inertia::render('admin/international-partners/partnerships', [
            'campus' => $campus,
            'college' => $college,
            'partnerships' => $partnerships
        ]);
    }

    public function partnershipDetails(InternationalPartner $partnership)
    {
        $partnership->load(['campusCollege.campus', 'campusCollege.college', 'user']);
        return Inertia::render('admin/international-partners/partnership', [
            'partnership' => $partnership,
        ]);
    }
}
