<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CampusController extends Controller
{
    public function index()
    {
        $campuses = Campus::all();
        return Inertia::render('admin/campus/index', ['campuses' => $campuses]);
    }

    public function create()
    {
        return Inertia::render('admin/campus/create');
    }

    public function show(Campus $campus)
    {
        return Inertia::render('admin/campus/show', [
            'campus' => $campus
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:campuses,name',
            'logo' => 'required|image|mimes:jpeg,jpg,png|max:2048', // 2MB max
        ]);

        $logoPath = null;

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('campus-logo', 'spaces');
        }

        Campus::create([
            'name' => $validated['name'],
            'logo' => $logoPath,
        ]);

        return redirect()->route('admin.campus.create');
    }

    public function edit(Campus $campus)
    {
        return Inertia::render('admin/campus/edit', ['campus' => $campus]);
    }

    public function update(Request $request, Campus $campus)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:campuses,name,' . $campus->id,
            'logo' => 'nullable|image|mimes:jpeg,jpg,png|max:2048', // 2MB max
        ]);

        $updateData = ['name' => $validated['name']];

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($campus->logo && Storage::disk('spaces')->exists($campus->logo)) {
                Storage::disk('spaces')->delete($campus->logo);
            }

            // Store new logo
            $updateData['logo'] = $request->file('logo')->store('campus-logo', 'spaces');
        }

        $campus->update($updateData);

        return redirect()->route('admin.campus.show', $campus)
            ->with('message', 'Campus updated successfully!');
    }

    public function destroy(Request $request, Campus $campus)
    {
        // Validate password confirmation
        $request->validate([
            'password' => 'required|string'
        ]);

        // Check if the provided password matches the current user's password
        if (!Hash::check($request->password, Auth::user()->password)) {
            return redirect()->back()
                ->withErrors(['password' => 'The provided password is incorrect.']);
        }

        // Check for related records before deletion
        $collegesCount = $campus->colleges()->count();
        $projectsCount = $campus->projects()->count();
        $awardsCount = $campus->awards()->count();
        $internationalPartnersCount = $campus->internationalPartners()->count();

        if ($collegesCount > 0 || $projectsCount > 0 || $awardsCount > 0 || $internationalPartnersCount > 0) {
            $errorMessages = [];

            if ($collegesCount > 0) {
                $errorMessages[] = "{$collegesCount} college(s)";
            }
            if ($projectsCount > 0) {
                $errorMessages[] = "{$projectsCount} project(s)";
            }
            if ($awardsCount > 0) {
                $errorMessages[] = "{$awardsCount} award(s)";
            }
            if ($internationalPartnersCount > 0) {
                $errorMessages[] = "{$internationalPartnersCount} international partnership(s)";
            }

            $relatedRecords = implode(', ', $errorMessages);

            return redirect()->route('admin.campus.index')
                ->withErrors(['deletion' => "Cannot delete campus '{$campus->name}' because it has related records: {$relatedRecords}. Please remove or reassign these records first."]);
        }

        // Delete logo if exists
        if ($campus->logo && Storage::disk('spaces')->exists($campus->logo)) {
            Storage::disk('spaces')->delete($campus->logo);
        }

        $campus->delete();

        return redirect()->route('admin.campus.index')
            ->with('message', 'Campus deleted successfully!');
    }
}
