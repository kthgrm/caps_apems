<?php

use App\Models\CampusCollege;
use App\Models\User;
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
        Schema::create('international_partners', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(CampusCollege::class)->constrained()->cascadeOnDelete();

            $table->string('agency_partner');
            $table->string('location');
            $table->string('activity_conducted');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('number_of_participants');
            $table->string('number_of_committee');
            $table->string('narrative');

            $table->string('attachment')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('international_partners');
    }
};
