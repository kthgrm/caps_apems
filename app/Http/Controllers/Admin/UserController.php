<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campus;
use App\Models\CampusCollege;
use App\Models\College;
use App\Models\User;
use App\Notifications\WelcomeNewUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $query = User::with(['campusCollege.campus', 'campusCollege.college'])
            ->orderBy('created_at', 'desc');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by admin status
        if ($request->filled('is_admin')) {
            $query->where('is_admin', $request->is_admin === 'true');
        }

        // Filter by campus
        if ($request->filled('campus_id')) {
            $query->whereHas('campusCollege', function ($q) use ($request) {
                $q->where('campus_id', $request->campus_id);
            });
        }

        // Filter by college
        if ($request->filled('college_id')) {
            $query->whereHas('campusCollege', function ($q) use ($request) {
                $q->where('college_id', $request->college_id);
            });
        }

        // Filter by campus college (keep for backward compatibility)
        if ($request->filled('campus_college_id')) {
            $query->where('campus_college_id', $request->campus_college_id);
        }

        $users = $query->paginate(10)->withQueryString();

        $campusColleges = CampusCollege::with(['campus', 'college'])
            ->orderBy('id')
            ->get();

        $campuses = Campus::orderBy('name')->get();
        $colleges = College::orderBy('name')->get();

        // Calculate stats for all users (not just paginated results)
        $totalUsers = User::count();
        $adminUsers = User::where('is_admin', true)->count();
        $regularUsers = User::where('is_admin', false)->count();
        $activeUsers = User::where('is_active', true)->count();
        $inactiveUsers = User::where('is_active', false)->count();

        return Inertia::render('admin/user-management/index', [
            'users' => $users,
            'campusColleges' => $campusColleges,
            'campuses' => $campuses,
            'colleges' => $colleges,
            'stats' => [
                'total' => $totalUsers,
                'admin' => $adminUsers,
                'regular' => $regularUsers,
                'active' => $activeUsers,
                'inactive' => $inactiveUsers,
            ],
            'filters' => $request->only(['search', 'is_admin', 'campus_id', 'college_id', 'campus_college_id'])
        ]);
    }

    /**
     * Show the form for creating a new user
     */
    public function create()
    {
        $campusColleges = CampusCollege::with(['campus', 'college'])
            ->orderBy('id')
            ->get();

        return Inertia::render('admin/user-management/create', [
            'campusColleges' => $campusColleges
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'is_admin' => 'boolean',
            'is_active' => 'boolean',
            'campus_college_id' => 'required|exists:campus_college,id',
        ]);

        // Generate a temporary password
        $temporaryPassword = Str::random(12);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($temporaryPassword),
            'is_admin' => $request->boolean('is_admin', false),
            'is_active' => $request->boolean('is_active', true),
            'campus_college_id' => $request->campus_college_id,
        ]);

        // Send welcome email with temporary password
        $user->notify(new WelcomeNewUser($temporaryPassword));

        return redirect()->route('admin.users.index')
            ->with('message', 'User created successfully. A welcome email with login instructions has been sent to ' . $user->email);
    }

    /**
     * Display the specified user
     */
    public function show(User $user)
    {
        $user->load(['campusCollege.campus', 'campusCollege.college', 'projects']);

        return Inertia::render('admin/user-management/show', [
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified user
     */
    public function edit(User $user)
    {
        $campusColleges = CampusCollege::with(['campus', 'college'])
            ->orderBy('id')
            ->get();

        return Inertia::render('admin/user-management/edit', [
            'user' => $user->load(['campusCollege.campus', 'campusCollege.college']),
            'campusColleges' => $campusColleges
        ]);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'is_admin' => 'boolean',
            'is_active' => 'boolean',
            'campus_college_id' => 'required|exists:campus_college,id',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'is_admin' => $request->boolean('is_admin', false),
            'is_active' => $request->boolean('is_active', true),
            'campus_college_id' => $request->campus_college_id,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->route('admin.users.index')
            ->with('message', 'User updated successfully.');
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user)
    {
        // Prevent deletion of self
        if ($user->id === Auth::id()) {
            return redirect()->route('admin.users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Toggle admin status of a user
     */
    public function toggleAdmin(User $user)
    {
        // Prevent toggling self admin status
        if ($user->id === Auth::id()) {
            return redirect()->route('admin.users.index')
                ->with('message', 'You cannot change your own admin status.');
        }

        $user->update(['is_admin' => !$user->is_admin]);

        $status = $user->is_admin ? 'granted' : 'removed';

        return redirect()->route('admin.users.index')
            ->with('message', "Admin privileges {$status} for {$user->name}.");
    }

    /**
     * Bulk activate users
     */
    public function bulkActivate(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        // Exclude current user from bulk operations
        $userIds = array_filter($request->user_ids, function ($id) {
            return $id != Auth::id();
        });

        if (empty($userIds)) {
            return redirect()->route('admin.users.index')
                ->with('message', 'No valid users selected for activation.');
        }

        // Only activate users who are currently inactive
        $inactiveUsers = User::whereIn('id', $userIds)
            ->where('is_active', false)
            ->get();

        if ($inactiveUsers->isEmpty()) {
            return redirect()->route('admin.users.index')
                ->with('message', 'All selected users are already activated.');
        }

        User::whereIn('id', $inactiveUsers->pluck('id'))->update(['is_active' => true]);

        $count = $inactiveUsers->count();
        return redirect()->route('admin.users.index')
            ->with('message', "{$count} user(s) activated successfully.");
    }

    /**
     * Bulk deactivate users
     */
    public function bulkDeactivate(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        // Exclude current user from bulk operations
        $userIds = array_filter($request->user_ids, function ($id) {
            return $id != Auth::id();
        });

        if (empty($userIds)) {
            return redirect()->route('admin.users.index')
                ->with('message', 'No valid users selected for deactivation.');
        }

        // Only deactivate users who are currently active
        $activeUsers = User::whereIn('id', $userIds)
            ->where('is_active', true)
            ->get();

        if ($activeUsers->isEmpty()) {
            return redirect()->route('admin.users.index')
                ->with('message', 'All selected users are already deactivated.');
        }

        User::whereIn('id', $activeUsers->pluck('id'))->update(['is_active' => false]);

        $count = $activeUsers->count();
        return redirect()->route('admin.users.index')
            ->with('message', "{$count} user(s) deactivated successfully.");
    }
}
