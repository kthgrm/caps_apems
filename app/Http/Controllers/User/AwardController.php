<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Award;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AwardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $awards = Award::where('user_id', Auth::id())
            ->where('is_archived', false)
            ->get();
        return Inertia::render('user/awards/index', [
            'awards' => $awards
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = User::with('campusCollege.campus', 'campusCollege.college')
            ->find(Auth::id());

        return Inertia::render('user/awards/create', [
            'user' => $user,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'award_name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'date_received' => 'required|date',
            'event_details' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'awarding_body' => 'required|string|max:255',
            'people_involved' => 'required|string|max:255',

            'attachment' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'attachment_link' => 'nullable|url',
        ]);

        $award = new Award();
        $award->user_id = Auth::user()->id;
        $award->campus_college_id = Auth::user()->campus_college_id;
        $award->fill($data);

        if ($request->hasFile('attachment')) {
            $award->attachment_path = $request->file('attachment')->store('award-attachments', 'spaces');
        }
        $award->setCreatedAt(now('Asia/Manila'));
        $award->setUpdatedAt(now('Asia/Manila'));
        $award->save();

        return redirect(route('user.awards.index'))
            ->with('message', 'Award created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Award $award)
    {
        if ($award->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($award->is_archived) {
            abort(404, 'Award not found.');
        }

        $award->load('user');
        return Inertia::render('user/awards/show', [
            'award' => $award
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Award $award)
    {
        if ($award->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($award->is_archived) {
            abort(404, 'Award not found.');
        }

        return Inertia::render('user/awards/edit', [
            'award' => $award
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Award $award)
    {
        if ($award->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($award->is_archived) {
            abort(404, 'Award not found.');
        }

        $data = $request->validate([
            'award_name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'level' => 'required|in:local,regional,national,international',
            'date_received' => 'required|date',
            'event_details' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'awarding_body' => 'required|string|max:255',
            'people_involved' => 'required|string|max:255',

            'attachment' => 'nullable|file|mimes:jpg,jpeg,png|max:1024',
            'attachment_link' => 'nullable|url',
        ]);

        $award->fill($data);
        if ($request->hasFile('attachment')) {
            $award->attachment_path = $request->file('attachment')->store('award-attachments', 'spaces');
        }
        $award->setUpdatedAt(now('Asia/Manila'));
        $award->save();

        return redirect(route('user.awards.show', $award))
            ->with('message', 'Award updated successfully.');
    }

    public function archive(Request $request, Award $award)
    {
        if ($award->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

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
            description: Auth::user()->name . " archived Award #{$award->id}: {$award->title}"
        );

        return redirect()->back()
            ->with('message', 'Award archived successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
