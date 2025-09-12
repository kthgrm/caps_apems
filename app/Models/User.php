<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, Auditable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'is_active',
        'campus_college_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function campusCollege()
    {
        return $this->belongsTo(CampusCollege::class);
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

    /**
     * Override to be more selective about when to audit user changes
     */
    protected function shouldAudit(string $action, array $changes = []): bool
    {
        // Always audit create and delete actions
        if (in_array($action, ['create', 'delete'])) {
            return true;
        }

        // For updates, only audit significant field changes
        if ($action === 'update') {
            $significantFields = ['name', 'email', 'is_admin', 'is_active', 'campus_college_id'];
            $hasSignificantChanges = collect($changes)->keys()->intersect($significantFields)->isNotEmpty();

            // Don't audit if current user is updating themselves with insignificant changes
            $currentUser = Auth::user();
            if ($currentUser && $this->id === $currentUser->id && !$hasSignificantChanges) {
                return false;
            }

            return $hasSignificantChanges;
        }

        return true;
    }
}
