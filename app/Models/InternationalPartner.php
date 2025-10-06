<?php

namespace App\Models;

use App\Models\CampusCollege;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternationalPartner extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'campus_college_id',
        'agency_partner',
        'location',
        'activity_conducted',
        'start_date',
        'end_date',
        'number_of_participants',
        'number_of_committee',
        'narrative',
        'attachment_path',
        'attachment_link',
        'is_archived',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function campusCollege()
    {
        return $this->belongsTo(CampusCollege::class);
    }
}
