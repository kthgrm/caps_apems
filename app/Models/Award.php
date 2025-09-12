<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Award extends Model
{
    protected $fillable = [
        'award_name',
        'date_received',
        'description',
        'event_details',
        'awarding_body',
        'location',
        'people_involved',
        'attachment_link',
        'attachment_path',
        'is_archived',
    ];

    protected $casts = [
        'date_received' => 'date',
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
