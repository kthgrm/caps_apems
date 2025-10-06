<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class College extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'code',
        'logo'
    ];

    public function campuses()
    {
        return $this->belongsToMany(Campus::class, 'campus_college');
    }

    public function campusColleges()
    {
        return $this->hasMany(CampusCollege::class);
    }

    public function projects()
    {
        return $this->hasManyThrough(Project::class, CampusCollege::class);
    }

    public function awards()
    {
        return $this->hasManyThrough(Award::class, CampusCollege::class);
    }

    public function international_partners()
    {
        return $this->hasManyThrough(InternationalPartner::class, CampusCollege::class);
    }

    public function partnerships()
    {
        return $this->hasManyThrough(InternationalPartner::class, CampusCollege::class);
    }

    public function impactAssessments()
    {
        return $this->hasManyThrough(ImpactAssessment::class, Project::class);
    }
}
