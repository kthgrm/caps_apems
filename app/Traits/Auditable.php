<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

trait Auditable
{
    protected static function bootAuditable()
    {
        static::created(function (Model $model) {
            static::logActivity('create', $model, null, $model->getAttributes());
        });

        static::updated(function (Model $model) {
            static::logActivity('update', $model, $model->getOriginal(), $model->getChanges());
        });

        static::deleted(function (Model $model) {
            static::logActivity('delete', $model, $model->getAttributes(), null);
        });
    }

    protected static function logActivity(string $action, Model $model, ?array $oldValues, ?array $newValues)
    {
        // Skip if no changes for update
        if ($action === 'update' && empty($newValues)) {
            return;
        }

        // Skip automatic logging for archive operations (only is_archived field changed)
        if ($action === 'update' && $newValues && count($newValues) === 1 && isset($newValues['is_archived'])) {
            return;
        }

        // Check if the model should be audited
        if (!$model->shouldAudit($action, $newValues ?? [])) {
            return;
        }

        // Filter out sensitive fields and timestamps
        $excludedFields = ['updated_at', 'created_at', 'password', 'remember_token', 'email_verified_at'];

        if ($oldValues) {
            $oldValues = collect($oldValues)->except($excludedFields)->toArray();
        }

        if ($newValues) {
            $newValues = collect($newValues)->except($excludedFields)->toArray();
        }

        // Skip if only excluded fields were updated
        if ($action === 'update' && empty($newValues)) {
            return;
        }

        AuditLog::log(
            action: $action,
            auditable: $model,
            oldValues: $oldValues,
            newValues: $newValues,
            description: static::generateDescription($action, $model)
        );
    }

    protected static function generateDescription(string $action, Model $model): string
    {
        $modelName = class_basename($model);
        $user = Auth::user();
        $userName = $user ? $user->name : 'System';

        return match ($action) {
            'create' => "{$userName} created a new {$modelName}",
            'update' => "{$userName} updated {$modelName} #{$model->id}",
            'delete' => "{$userName} deleted {$modelName} #{$model->id}",
            default => "{$userName} performed {$action} on {$modelName}"
        };
    }

    /**
     * Get all audit logs for this model
     */
    public function auditLogs()
    {
        return $this->morphMany(AuditLog::class, 'auditable')->orderBy('created_at', 'desc');
    }

    /**
     * Get the latest audit log for this model
     */
    public function latestAuditLog()
    {
        return $this->morphOne(AuditLog::class, 'auditable')->latestOfMany();
    }

    /**
     * Get fields that should be considered significant for audit logging.
     * Override this method in your model to customize which fields trigger audit logs.
     */
    protected function getSignificantAuditFields(): array
    {
        // By default, exclude common timestamp and system fields
        $excludedFields = ['updated_at', 'created_at', 'password', 'remember_token', 'email_verified_at'];

        return collect($this->getFillable())
            ->reject(fn($field) => in_array($field, $excludedFields))
            ->values()
            ->toArray();
    }

    /**
     * Determine if the model should be audited for the given action.
     * Override this method in your model to add custom logic.
     */
    protected function shouldAudit(string $action, array $changes = []): bool
    {
        // Skip if this is an update with no significant changes
        if ($action === 'update') {
            $significantFields = $this->getSignificantAuditFields();
            $hasSignificantChanges = collect($changes)->keys()->intersect($significantFields)->isNotEmpty();

            return $hasSignificantChanges;
        }

        return true;
    }
}
