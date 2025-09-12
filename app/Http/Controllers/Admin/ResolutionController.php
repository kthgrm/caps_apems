<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resolution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResolutionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $resolutions = Resolution::with('user')
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
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
