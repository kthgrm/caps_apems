<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class ImpactAssessment extends Model
{
    use Auditable;

    protected $fillable = [
        'user_id',
        'beneficiary',
        'geographic_coverage',
        'num_direct_beneficiary',
        'num_indirect_beneficiary',
        'project_id',
        'is_archived',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function campusCollege()
    {
        return $this->belongsTo(CampusCollege::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
