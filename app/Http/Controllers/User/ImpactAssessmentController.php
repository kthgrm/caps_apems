<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\ImpactAssessment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ImpactAssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $assessments = ImpactAssessment::where('user_id', Auth::id())
            ->where('is_archived', false)
            ->with('project')
            ->get();
        return Inertia::render('user/impact-assessments/index', [
            'assessments' => $assessments
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = User::with('campusCollege.campus', 'campusCollege.college')
            ->find(Auth::id());

        $projects = $user->projects()->get();

        return Inertia::render('user/impact-assessments/create', [
            'user' => $user,
            'projects' => $projects
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'beneficiary' => 'required|string|max:255',
            'geographic_coverage' => 'required|string|max:255',
            'num_direct_beneficiary' => 'required|integer|min:0',
            'num_indirect_beneficiary' => 'required|integer|min:0',
        ]);

        $assessment = new ImpactAssessment();
        $assessment->user_id = Auth::user()->id;
        $assessment->fill($data);

        $assessment->setCreatedAt(now('Asia/Manila'));
        $assessment->setUpdatedAt(now('Asia/Manila'));
        $assessment->save();

        return redirect(route('user.impact-assessments.index'))
            ->with('message', 'Impact Assessment created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ImpactAssessment $assessment)
    {
        if ($assessment->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($assessment->is_archived) {
            abort(404, 'Assessment not found.');
        }

        $assessment->load(['user', 'project']);
        return Inertia::render('user/impact-assessments/show', [
            'assessment' => $assessment
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ImpactAssessment $assessment)
    {
        if ($assessment->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($assessment->is_archived) {
            abort(404, 'Assessment not found.');
        }

        $assessment->load('project');

        $user = User::find(Auth::id());
        $projects = $user->projects()->get()->map(function ($project) {
            return [
                'value' => $project->id,
                'label' => $project->name,
            ];
        });

        return Inertia::render('user/impact-assessments/edit', [
            'assessment' => $assessment,
            'projects' => $projects
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ImpactAssessment $assessment)
    {
        if ($assessment->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($assessment->is_archived) {
            abort(404, 'Assessment not found.');
        }

        $data = $request->validate([
            'beneficiary' => 'required|string|max:255',
            'geographic_coverage' => 'required|string|max:255',
            'num_direct_beneficiary' => 'required|integer|min:0',
            'num_indirect_beneficiary' => 'required|integer|min:0',
            'project_id' => 'required|exists:projects,id',
        ]);

        $assessment->fill($data);
        $assessment->save();

        return redirect(route('user.impact-assessments.show', $assessment))
            ->with('message', 'Impact Assessment updated successfully.');
    }

    public function archive(Request $request, ImpactAssessment $assessment)
    {
        if ($assessment->user_id !== Auth::id()) {
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

        $oldValues = ['is_archived' => $assessment->is_archived];
        $assessment->update(['is_archived' => true]);

        // Log the archive action
        AuditLog::log(
            action: 'archive',
            auditable: $assessment,
            oldValues: $oldValues,
            newValues: ['is_archived' => true],
            description: Auth::user()->name . " archived Impact Assessment #{$assessment->id} for Project #{$assessment->project_id}"
        );

        return redirect()->back()
            ->with('message', 'Assessment archived successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
