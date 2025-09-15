<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Campus;
use App\Models\College;
use App\Models\InternationalPartner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

    /**
     * Archive a partnership.
     */
    public function archive(Request $request, InternationalPartner $partnership)
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

        $oldValues = ['is_archived' => $partnership->is_archived];
        $partnership->update(['is_archived' => true]);

        // Log the archive action
        AuditLog::log(
            action: 'archive',
            auditable: $partnership,
            oldValues: $oldValues,
            newValues: ['is_archived' => true],
            description: Auth::user()->name . " (Admin) archived International Partnership #{$partnership->id}: {$partnership->agency_partner}"
        );

        return redirect()->back()->with('success', 'Partnership archived successfully.');
    }
}
