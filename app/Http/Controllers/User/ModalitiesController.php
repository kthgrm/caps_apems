<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Modalities;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ModalitiesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $modalities = Modalities::with(['user', 'project'])
            ->where('user_id', $user->id)
            ->where('is_archived', false)
            ->latest()
            ->get();

        return Inertia::render('user/project-activities/modalities/index', [
            'modalities' => $modalities,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = User::with('campusCollege.campus', 'campusCollege.college')
            ->find(Auth::id());

        $projects = Project::where('user_id', $user->id)
            ->latest()
            ->get();

        return Inertia::render('user/project-activities/modalities/create', [
            'projects' => $projects,
            'user' => $user,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'modality' => 'required|string|max:255',
            'tv_channel' => 'nullable|string|max:255',
            'radio' => 'nullable|string|max:255',
            'online_link' => 'nullable|url|max:255',
            'time_air' => 'nullable|string|max:255',
            'period' => 'nullable|string|max:255',
            'partner_agency' => 'nullable|string|max:255',
            'hosted_by' => 'nullable|string|max:255',
        ]);

        $validated['user_id'] = Auth::id();

        $modality = Modalities::create($validated);

        return redirect()->route('user.modalities.index')
            ->with('message', 'Modality created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Modalities $modality)
    {
        // Ensure user can only view their own modalities
        if ($modality->user_id !== Auth::id()) {
            abort(403);
        }

        if ($modality->is_archived) {
            abort(404, 'Modality not found.');
        }

        $modality->load(['user', 'project']);

        return Inertia::render('user/project-activities/modalities/show', [
            'modality' => $modality,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Modalities $modality)
    {
        // Ensure user can only edit their own modalities
        if ($modality->user_id !== Auth::id()) {
            abort(403);
        }

        if ($modality->is_archived) {
            abort(404, 'Modality not found.');
        }

        $user = Auth::user();

        $projects = Project::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($project) {
                return [
                    'value' => $project->id,
                    'label' => $project->name,
                ];
            });

        $modality->load(['user', 'project']);

        return Inertia::render('user/project-activities/modalities/edit', [
            'modality' => $modality,
            'projects' => $projects,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Modalities $modality)
    {
        // Ensure user can only update their own modalities
        if ($modality->user_id !== Auth::id()) {
            abort(403);
        }

        if ($modality->is_archived) {
            abort(404, 'Modality not found.');
        }

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'modality' => 'required|string|max:255',
            'tv_channel' => 'nullable|string|max:255',
            'radio' => 'nullable|string|max:255',
            'online_link' => 'nullable|url|max:255',
            'time_air' => 'nullable|string|max:255',
            'period' => 'nullable|string|max:255',
            'partner_agency' => 'nullable|string|max:255',
            'hosted_by' => 'nullable|string|max:255',
        ]);

        $modality->update($validated);

        return redirect()->route('user.modalities.show', $modality)
            ->with('message', 'Modality updated successfully.');
    }

    public function archive(Request $request, Modalities $modality)
    {
        // Ensure user can only archive their own modalities
        if ($modality->user_id !== Auth::id()) {
            abort(403);
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

        $oldValues = ['is_archived' => $modality->is_archived];
        $modality->update(['is_archived' => true]);

        // Log the archive action
        AuditLog::log(
            action: 'archive',
            auditable: $modality,
            oldValues: $oldValues,
            newValues: ['is_archived' => true],
            description: Auth::user()->name . " archived Modality #{$modality->id}: {$modality->modality_type}"
        );

        return redirect()->back()
            ->with('message', 'Modality archived successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Modalities $modality)
    {
        // Ensure user can only delete their own modalities
        if ($modality->user_id !== Auth::id()) {
            abort(403);
        }

        $modality->delete();

        return redirect()->route('user.modalities.index')
            ->with('message', 'Modality deleted successfully.');
    }
}
