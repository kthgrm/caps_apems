<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campus;
use App\Models\College;
use App\Models\CampusCollege;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CollegeController extends Controller
{
    public function index()
    {
        $campuses = Campus::get();

        return Inertia::render('admin/college/index', [
            'campuses' => $campuses,
        ]);
    }

    public function filterByCampus(Campus $campus)
    {
        // Get colleges for this campus through the campus_college pivot table
        $campusColleges = CampusCollege::where('campus_id', $campus->id)->with('college')->get();

        return Inertia::render('admin/college/college', [
            'campus' => $campus,
            'colleges' => $campusColleges
        ]);
    }

    public function create(Request $request)
    {
        $campuses = Campus::orderBy('name')->get();
        $selectedCampus = null;

        if ($request->has('campus') && $request->campus) {
            $selectedCampus = Campus::find($request->campus);
        }

        return Inertia::render('admin/college/create', [
            'campuses' => $campuses,
            'selectedCampus' => $selectedCampus
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:5|unique:colleges,code',
            'campus_id' => 'required|exists:campuses,id',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $collegeData = [
            'name' => $request->name,
            'code' => $request->code
        ];

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('colleges/logos', 'public');
            $collegeData['logo'] = $logoPath;
        }

        $college = College::create($collegeData);

        // Create CampusCollege relationship
        CampusCollege::create([
            'campus_id' => $request->campus_id,
            'college_id' => $college->id
        ]);

        return redirect()
            ->route('admin.college.campus', ['campus' => $request->campus_id])
            ->with('message', 'College created successfully!');
    }

    public function show(CampusCollege $campusCollege)
    {
        $campusCollege->load('college', 'campus');
        return Inertia::render('admin/college/show', [
            'college' => $campusCollege
        ]);
    }

    public function edit(College $college)
    {
        $college->load('campuses');
        $college->campus = $college->campuses->first();
        $campuses = Campus::orderBy('name')->get();

        return Inertia::render('admin/college/edit', [
            'college' => $college,
            'campuses' => $campuses
        ]);
    }

    public function update(Request $request, College $college)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:colleges,code,' . $college->id,
            'campus_id' => 'required|exists:campuses,id',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $collegeData = [
            'name' => $request->name,
            'code' => strtoupper($request->code)
        ];

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($college->logo) {
                Storage::disk('public')->delete($college->logo);
            }

            $logoPath = $request->file('logo')->store('colleges/logos', 'public');
            $collegeData['logo'] = $logoPath;
        }

        $college->update($collegeData);

        // Get current campus relationship
        $currentCampusCollege = CampusCollege::where('college_id', $college->id)->first();

        // Update CampusCollege relationship if campus changed
        if (!$currentCampusCollege || $currentCampusCollege->campus_id != $request->campus_id) {
            // Delete old relationship
            CampusCollege::where('college_id', $college->id)->delete();

            // Create new relationship
            CampusCollege::create([
                'campus_id' => $request->campus_id,
                'college_id' => $college->id
            ]);
        }

        return redirect()
            ->route('admin.college.campus', ['campus' => $request->campus_id])
            ->with('message', 'College updated successfully!');
    }

    public function destroy(Request $request, College $college)
    {
        // Validate password
        if (!$request->password) {
            throw ValidationException::withMessages([
                'password' => 'Password is required to delete this college.'
            ]);
        }

        if (!Hash::check($request->password, $request->user()->password)) {
            throw ValidationException::withMessages([
                'password' => 'Invalid password provided.'
            ]);
        }

        // Check if college has related data through CampusCollege pivot
        $campusColleges = CampusCollege::where('college_id', $college->id)->get();
        $hasRelatedData = false;

        foreach ($campusColleges as $campusCollege) {
            $hasProjects = $campusCollege->projects()->where('is_archived', false)->exists();
            $hasAwards = $campusCollege->awards()->where('is_archived', false)->exists();
            $hasPartners = $campusCollege->internationalPartners()->where('is_archived', false)->exists();

            if ($hasProjects || $hasAwards || $hasPartners) {
                $hasRelatedData = true;
                break;
            }
        }

        if ($hasRelatedData) {
            return back()->withErrors([
                'deletion' => 'Cannot delete college that has active projects, awards, or international partnerships.'
            ]);
        }

        // Get the campus ID for redirect
        $campusCollege = CampusCollege::where('college_id', $college->id)->first();
        $campusId = $campusCollege ? $campusCollege->campus_id : null;

        // Delete logo file if exists
        if ($college->logo) {
            Storage::disk('public')->delete($college->logo);
        }

        // Delete CampusCollege relationships
        CampusCollege::where('college_id', $college->id)->delete();

        // Delete the college
        $college->delete();

        if ($campusId) {
            return redirect()
                ->route('admin.college.campus', ['campus' => $campusId])
                ->with('message', 'College deleted successfully!');
        } else {
            return redirect()
                ->route('admin.college.index')
                ->with('message', 'College deleted successfully!');
        }
    }
}
