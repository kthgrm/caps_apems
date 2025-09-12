<?php

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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('user_type')->nullable(); // e.g., 'User', 'Admin'
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('action'); // e.g., 'create', 'update', 'delete', 'login', 'logout'
            $table->string('auditable_type')->nullable(); // Model name (e.g., 'Project', 'Award')
            $table->unsignedBigInteger('auditable_id')->nullable(); // Model ID
            $table->json('old_values')->nullable(); // Previous values for updates
            $table->json('new_values')->nullable(); // New values for creates/updates
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('description')->nullable(); // Human-readable description
            $table->timestamps();

            $table->index(['user_id', 'user_type']);
            $table->index(['auditable_id', 'auditable_type']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
