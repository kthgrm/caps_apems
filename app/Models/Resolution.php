<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resolution extends Model
{
    use Auditable, HasFactory;
    use Auditable;

    protected $fillable = [
        'user_id',
        'resolution_number',
        'year_of_effectivity',
        'expiration',
        'contact_person',
        'contact_number_email',
        'partner_agency_organization',
        'is_archived',
    ];

    protected $casts = [
        'year_of_effectivity' => 'date',
        'expiration' => 'date',
        'is_archived' => 'boolean',
    ];

    /**
     * Get the user that submitted the resolution.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
