<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampusCollege extends Model
{
    protected $table = 'campus_college';

    protected $fillable = [
        'campus_id',
        'college_id',
    ];

    public function campus()
    {
        return $this->belongsTo(Campus::class);
    }

    public function college()
    {
        return $this->belongsTo(College::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function awards()
    {
        return $this->hasMany(Award::class);
    }

    public function internationalPartners()
    {
        return $this->hasMany(InternationalPartner::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
