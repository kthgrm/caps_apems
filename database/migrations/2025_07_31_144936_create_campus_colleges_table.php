<?php

use App\Models\Campus;
use App\Models\CampusCollege;
use App\Models\College;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('campus_college', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Campus::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(College::class)->constrained()->cascadeOnDelete();

            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignIdFor(CampusCollege::class, 'campus_college_id')->nullable()->constrained('campus_college')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campus_colleges');
    }
};
