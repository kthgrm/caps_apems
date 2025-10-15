<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\InternationalPartner;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InternationalPartnerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $partnerships = InternationalPartner::where('user_id', Auth::id())
            ->where('is_archived', false)
            ->get();
        return Inertia::render('user/international-partners/index', [
            'internationalPartners' => $partnerships
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = User::with('campusCollege.campus', 'campusCollege.college')
            ->find(Auth::id());

        return Inertia::render('user/international-partners/create', [
            'user' => $user,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'agency_partner' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'activity_conducted' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'number_of_participants' => 'required|integer',
            'number_of_committee' => 'required|integer',
            'narrative' => 'required|string',

            'attachments.*' => 'nullable|file|mimes:jpeg,png,jpg,pdf,doc,docx|max:10240',
            'attachment_link' => 'nullable|url',
        ]);

        $partner = new InternationalPartner();
        $partner->user_id = Auth::user()->id;
        $partner->campus_college_id = Auth::user()->campus_college_id;
        $partner->fill($data);

        // Handle multiple file uploads
        $attachmentPaths = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('partner-attachments', 'spaces');
                $attachmentPaths[] = $path;
            }
        }
        $partner->attachment_paths = $attachmentPaths;
        $partner->attachment_link = $request->input('attachment_link');
        $partner->setCreatedAt(now('Asia/Manila'));
        $partner->setUpdatedAt(now('Asia/Manila'));
        $partner->save();

        return redirect(route('user.international-partners.index'))
            ->with('message', 'Partnership created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(InternationalPartner $partner)
    {
        if ($partner->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($partner->is_archived) {
            abort(404, 'Partnership not found.');
        }

        $partner->load('user');
        return Inertia::render('user/international-partners/show', [
            'partner' => $partner
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InternationalPartner $partner)
    {
        if ($partner->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($partner->is_archived) {
            abort(404, 'Partnership not found.');
        }

        return Inertia::render('user/international-partners/edit', [
            'partner' => $partner
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InternationalPartner $partner)
    {
        if ($partner->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($partner->is_archived) {
            abort(404, 'Partnership not found.');
        }

        $data = $request->validate([
            'agency_partner' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'activity_conducted' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'number_of_participants' => 'required|integer',
            'number_of_committee' => 'required|integer',
            'narrative' => 'required|string',

            'attachments.*' => 'nullable|file|mimes:jpeg,png,jpg,pdf,doc,docx|max:10240',
            'attachment_link' => 'nullable|url',
        ]);

        $partner->fill($data);

        // Handle multiple file uploads for update
        if ($request->hasFile('attachments')) {
            // Delete old attachments if they exist
            if ($partner->attachment_paths) {
                foreach ($partner->attachment_paths as $oldPath) {
                    if (Storage::disk('spaces')->exists($oldPath)) {
                        Storage::disk('spaces')->delete($oldPath);
                    }
                }
            }

            // Upload new attachments
            $attachmentPaths = [];
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('project-attachments', 'spaces');
                $attachmentPaths[] = $path;
            }
            $partner->attachment_paths = $attachmentPaths;
        }

        $partner->save();

        return redirect(route('user.international-partners.show', $partner))
            ->with('message', 'Partnership updated successfully.');
    }

    public function archive(Request $request, InternationalPartner $partner)
    {
        if ($partner->user_id !== Auth::id()) {
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

        $oldValues = ['is_archived' => $partner->is_archived];
        $partner->update(['is_archived' => true]);

        // Log the archive action
        AuditLog::log(
            action: 'archive',
            auditable: $partner,
            oldValues: $oldValues,
            newValues: ['is_archived' => true],
            description: Auth::user()->name . " archived International Partnership #{$partner->id} with {$partner->agency_partner}"
        );

        return redirect()->back()
            ->with('message', 'Partnership archived successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
