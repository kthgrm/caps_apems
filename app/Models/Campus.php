<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campus extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'logo',
    ];

    public function colleges()
    {
        return $this->belongsToMany(College::class);
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

    public function internationalPartners()
    {
        return $this->hasManyThrough(InternationalPartner::class, CampusCollege::class);
    }
}
