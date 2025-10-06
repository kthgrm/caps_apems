<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Modalities extends Model
{
    use Auditable, HasFactory;
    use Auditable;

    protected $fillable = [
        'user_id',
        'project_id',
        'modality',
        'tv_channel',
        'radio',
        'online_link',
        'time_air',
        'period',
        'partner_agency',
        'hosted_by',
        'is_archived',
    ];

    /**
     * Get the user that owns the modality.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the project that this modality belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
