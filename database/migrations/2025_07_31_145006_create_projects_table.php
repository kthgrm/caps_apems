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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(CampusCollege::class)->constrained()->cascadeOnDelete();

            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category')->nullable();
            $table->string('purpose')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('tags')->nullable();
            $table->string('leader')->nullable();
            $table->string('deliverables')->nullable();

            $table->string('agency_partner')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_address')->nullable();

            $table->enum('copyright', ['yes', 'no', 'pending'])->default('no');
            $table->text('ip_details')->nullable();

            $table->boolean('is_assessment_based')->default(false);
            $table->text('monitoring_evaluation_plan')->nullable();
            $table->text('sustainability_plan')->nullable();
            $table->integer('reporting_frequency')->nullable();

            $table->string('attachment_path')->nullable();
            $table->string('attachment_link')->nullable();

            $table->text('remarks')->nullable();

            $table->boolean('is_archived')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
