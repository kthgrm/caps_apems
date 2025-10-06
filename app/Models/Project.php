<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use Auditable, HasFactory;
    protected $fillable = [
        'name',
        'description',
        'category',
        'purpose',
        'start_date',
        'end_date',
        'tags',
        'leader',
        'deliverables',
        'agency_partner',
        'contact_person',
        'contact_email',
        'contact_phone',
        'contact_address',
        'copyright',
        'ip_details',
        'is_assessment_based',
        'monitoring_evaluation_plan',
        'sustainability_plan',
        'reporting_frequency',
        'attachment_path',
        'attachment_link',
        'remarks',
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

    public function impactAssessment()
    {
        return $this->hasOne(ImpactAssessment::class);
    }

    public function modalities()
    {
        return $this->hasMany(Modalities::class);
    }
}
