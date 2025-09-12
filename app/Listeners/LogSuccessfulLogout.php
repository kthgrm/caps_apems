<?php

namespace App\Listeners;

use App\Models\AuditLog;
use Illuminate\Auth\Events\Logout;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LogSuccessfulLogout
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
    public function handle(Logout $event): void
    {
        // Check if we already logged this user's logout in the last few seconds to prevent duplicates
        $recentLogoutLog = AuditLog::where('action', 'logout')
            ->where('user_id', $event->user->id)
            ->where('created_at', '>', now()->subSeconds(5))
            ->exists();

        if ($recentLogoutLog) {
            return; // Skip duplicate logout log
        }

        AuditLog::log(
            action: 'logout',
            description: $event->user->name . ' logged out of the system'
        );
    }
}
