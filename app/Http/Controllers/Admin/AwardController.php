<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Award;
use App\Models\Campus;
use App\Models\College;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
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
        if ($award->is_archived) {
            abort(404);
        }

        $award->load(['campusCollege.campus', 'campusCollege.college', 'user']);
        return Inertia::render('admin/awards/award', [
            'award' => $award,
        ]);
    }

    public function awardEdit(Award $award)
    {
        if ($award->is_archived) {
            abort(404);
        }

        $award->load(['campusCollege.campus', 'campusCollege.college', 'user']);
        return Inertia::render('admin/awards/edit', [
            'award' => $award,
        ]);
    }

    public function awardUpdate(Request $request, Award $award)
    {
        $validated = $request->validate([
            'award_name' => 'required|string|max:255',
            'description' => 'required|string',
            'date_received' => 'required|date',
            'event_details' => 'required|string',
            'location' => 'required|string|max:255',
            'awarding_body' => 'required|string|max:255',
            'people_involved' => 'required|string',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:10240',
            'attachment_link' => 'nullable|url',
        ]);

        // Store old values for audit log
        $oldValues = $award->toArray();

        // Handle file upload
        if ($request->hasFile('attachment')) {
            // Delete old file if it exists
            if ($award->attachment_path) {
                Storage::disk('spaces')->delete($award->attachment_path);
            }
            $validated['attachment_path'] = $request->file('attachment')->store('awards', 'spaces');
        }

        $award->update($validated);

        // Log the update action
        AuditLog::log(
            action: 'update',
            auditable: $award,
            oldValues: $oldValues,
            newValues: $validated,
            description: Auth::user()->name . " (Admin) updated Award #{$award->id}: {$award->award_name}"
        );

        return redirect()->route('admin.awards-recognition.award', $award)
            ->with('success', 'Award updated successfully.');
    }

    /**
     * Archive an award.
     */
    public function archive(Request $request, Award $award)
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

        $oldValues = ['is_archived' => $award->is_archived];
        $award->update(['is_archived' => true]);

        // Log the archive action
        AuditLog::log(
            action: 'archive',
            auditable: $award,
            oldValues: $oldValues,
            newValues: ['is_archived' => true],
            description: Auth::user()->name . " (Admin) archived Award #{$award->id}: {$award->award_name}"
        );

        return redirect()->back()->with('success', 'Award archived successfully.');
    }
}
