<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Award extends Model
{
    use HasFactory;
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
        'attachment_paths',
        'is_archived',
    ];

    protected $casts = [
        'date_received' => 'date',
        'attachment_paths' => 'array',
        'is_archived' => 'boolean',
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
