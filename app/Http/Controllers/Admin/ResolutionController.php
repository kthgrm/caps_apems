<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Resolution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ResolutionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $resolutions = Resolution::with('user')
            ->where('is_archived', false)
            ->latest()
            ->get();

        return Inertia::render('admin/resolution/index', [
            'resolutions' => $resolutions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/resolution/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'resolution_number' => 'required|string|unique:resolutions,resolution_number',
            'year_of_effectivity' => 'required|date',
            'expiration' => 'required|date|after:year_of_effectivity',
            'contact_person' => 'required|string|max:255',
            'contact_number_email' => 'required|string|max:255',
            'partner_agency_organization' => 'required|string|max:255',
        ]);

        $validated['user_id'] = Auth::id();

        $resolution = Resolution::create($validated);

        return redirect()->route('admin.resolutions.show', $resolution)
            ->with('success', 'Resolution created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Resolution $resolution)
    {
        $resolution->load('user');

        return Inertia::render('admin/resolution/show', [
            'resolution' => $resolution,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Resolution $resolution)
    {
        $resolution->load('user');

        return Inertia::render('admin/resolution/edit', [
            'resolution' => $resolution,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Resolution $resolution)
    {
        $validated = $request->validate([
            'resolution_number' => 'required|string|unique:resolutions,resolution_number,' . $resolution->id,
            'year_of_effectivity' => 'required|date',
            'expiration' => 'required|date|after:year_of_effectivity',
            'contact_person' => 'required|string|max:255',
            'contact_number_email' => 'required|string|max:255',
            'partner_agency_organization' => 'required|string|max:255',
        ]);

        $resolution->update($validated);

        return redirect()->route('admin.resolutions.show', $resolution)
            ->with('success', 'Resolution updated successfully.');
    }

    /**
     * Archive the specified resource from storage.
     */
    public function archive(Request $request, Resolution $resolution)
    {
        $request->validate([
            'password' => 'required|string'
        ]);

        // Check if the provided password matches the current user's password
        if (!Hash::check($request->password, Auth::user()->password)) {
            return redirect()->back()
                ->withErrors(['password' => 'The provided password is incorrect.'])
                ->withInput();
        }

        $oldValues = ['is_archived' => $resolution->is_archived];
        $resolution->update(['is_archived' => true]);

        // Log the archive action
        AuditLog::log(
            action: 'archive',
            auditable: $resolution,
            oldValues: $oldValues,
            newValues: ['is_archived' => true],
            description: Auth::user()->name . " (Admin) archived Resolution #{$resolution->id}: {$resolution->resolution_number}"
        );

        return redirect()->route('admin.resolutions.index')->with('success', 'Resolution archived successfully.');
    }
}
