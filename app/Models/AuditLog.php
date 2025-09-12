<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class AuditLog extends Model
{
    protected $fillable = [
        'user_type',
        'user_id',
        'action',
        'auditable_type',
        'auditable_id',
        'old_values',
        'new_values',
        'description'
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array'
    ];

    /**
     * Get the user that performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the auditable model.
     */
    public function auditable()
    {
        return $this->morphTo();
    }

    /**
     * Get a human-readable description of the action.
     */
    public function getActionDescriptionAttribute(): string
    {
        if ($this->description) {
            return $this->description;
        }

        $userName = $this->user ? $this->user->name : 'System';
        $modelName = $this->auditable_type ? class_basename($this->auditable_type) : 'record';

        return match ($this->action) {
            'create' => "{$userName} created a new {$modelName}",
            'update' => "{$userName} updated {$modelName}",
            'delete' => "{$userName} deleted {$modelName}",
            'archive' => "{$userName} archived {$modelName}",
            'login' => "{$userName} logged in",
            'logout' => "{$userName} logged out",
            default => "{$userName} performed {$this->action} on {$modelName}"
        };
    }

    /**
     * Create an audit log entry.
     */
    public static function log(
        string $action,
        ?Model $auditable = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $description = null
    ): self {
        $user = Auth::user();

        return self::create([
            'user_type' => $user ? get_class($user) : null,
            'user_id' => $user?->id,
            'action' => $action,
            'auditable_type' => $auditable ? get_class($auditable) : null,
            'auditable_id' => $auditable?->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'description' => $description
        ]);
    }
}
