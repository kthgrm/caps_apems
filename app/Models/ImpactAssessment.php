<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImpactAssessment extends Model
{
    use Auditable, HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'beneficiary',
        'geographic_coverage',
        'num_direct_beneficiary',
        'num_indirect_beneficiary',
        'is_archived',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
