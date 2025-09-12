<?php

namespace App\Listeners;

use App\Models\AuditLog;
use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LogSuccessfulLogin
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        // Check if we already logged this user's login in the last few seconds to prevent duplicates
        $recentLoginLog = AuditLog::where('action', 'login')
            ->where('user_id', $event->user->id)
            ->where('created_at', '>', now()->subSeconds(5))
            ->exists();

        if ($recentLoginLog) {
            return; // Skip duplicate login log
        }

        AuditLog::log(
            action: 'login',
            description: $event->user->name . ' logged into the system'
        );
    }
}
