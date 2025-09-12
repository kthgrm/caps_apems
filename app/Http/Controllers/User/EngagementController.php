<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Engagement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EngagementController extends Controller
{
    public function index()
    {
        $engagements = Engagement::where('user_id', Auth::id())->get();
        return Inertia::render('user/engagement/index', [
            'engagements' => $engagements
        ]);
    }

    public function show(Engagement $engagement)
    {
        $engagement->load('user');
        return Inertia::render('user/engagement/show', [
            'engagement' => $engagement
        ]);
    }

    public function create()
    {
        // Logic to show the form for creating a new engagement
        return Inertia::render('user/engagement/create');
    }
}
