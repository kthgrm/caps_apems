<?php

use App\Http\Controllers\Admin\AwardController;
use App\Http\Controllers\Admin\CampusController;
use App\Http\Controllers\Admin\CollegeController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ImpactAssessmentController;
use App\Http\Controllers\Admin\InternationalPartnerController;
use App\Http\Controllers\Admin\ModalitiesController as AdminModalitiesController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ResolutionController;
use App\Http\Controllers\Admin\TechnologyTransferController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\User\AwardController as UserAwardController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\InternationalPartnerController as UserInternationalPartnerController;
use App\Http\Controllers\User\ImpactAssessmentController as UserImpactAssessmentController;
use App\Http\Controllers\User\ModalitiesController;
use App\Http\Controllers\User\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['middleware' => 'auth'], function () {
    // Admin Routes
    Route::group([
        'prefix' => 'admin',
        'middleware' => 'is_admin',
        'as' => 'admin.'
    ], function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])
            ->name('dashboard');

        // Projects Routes
        Route::group([
            'prefix' => 'technology-transfer',
            'as' => 'technology-transfer.'
        ], function () {
            Route::get('/', [TechnologyTransferController::class, 'campuses'])
                ->name('index');
            Route::get('{campus}', [TechnologyTransferController::class, 'colleges'])
                ->name('colleges');
            Route::get('{campus}/{college}/projects', [TechnologyTransferController::class, 'projects'])
                ->name('projects');
            Route::get('projects/{project}', [TechnologyTransferController::class, 'projectDetails'])
                ->name('project');
            Route::get('projects/{project}/edit', [TechnologyTransferController::class, 'projectEdit'])
                ->name('project.edit');
            Route::put('projects/{project}', [TechnologyTransferController::class, 'projectUpdate'])
                ->name('projects.update');
            Route::patch('projects/{project}/archive', [TechnologyTransferController::class, 'archive'])
                ->name('projects.archive');
        });

        // Impact Assessment Routes
        Route::group([
            'prefix' => 'impact-assessment',
            'as' => 'impact-assessment.'
        ], function () {
            Route::get('/', [ImpactAssessmentController::class, 'campuses'])
                ->name('campuses');
            Route::get('{campus}', [ImpactAssessmentController::class, 'colleges'])
                ->name('colleges');
            Route::get('{campus}/{college}/assessments', [ImpactAssessmentController::class, 'assessments'])
                ->name('assessments');
            Route::get('assessments/{impactAssessment}', [ImpactAssessmentController::class, 'assessmentDetails'])
                ->name('assessment');
            Route::get('assessments/{impactAssessment}/edit', [ImpactAssessmentController::class, 'assessmentEdit'])
                ->name('assessments.edit');
            Route::put('assessments/{impactAssessment}', [ImpactAssessmentController::class, 'assessmentUpdate'])
                ->name('assessments.update');
            Route::patch('{impactAssessment}/archive', [ImpactAssessmentController::class, 'archive'])
                ->name('assessments.archive');
        });

        // Modalities Routes
        Route::group([
            'prefix' => 'modalities',
            'as' => 'modalities.'
        ], function () {
            Route::get('/', [AdminModalitiesController::class, 'campuses'])
                ->name('campuses');
            Route::get('{campus}', [AdminModalitiesController::class, 'colleges'])
                ->name('colleges');
            Route::get('{campus}/{college}/modalities', [AdminModalitiesController::class, 'modalities'])
                ->name('modalities');
            Route::get('{modality}/details', [AdminModalitiesController::class, 'modalityDetails'])
                ->name('modality');
            Route::get('{modality}/edit', [AdminModalitiesController::class, 'modalityEdit'])
                ->name('modality.edit');
            Route::put('{modality}', [AdminModalitiesController::class, 'modalityUpdate'])
                ->name('modality.update');
            Route::patch('{modality}/archive', [AdminModalitiesController::class, 'archive'])
                ->name('modality.archive');
        });

        // Awards Routes
        Route::group([
            'prefix' => 'awards-recognition',
            'as' => 'awards-recognition.'
        ], function () {
            Route::get('/', [AwardController::class, 'campuses'])
                ->name('campuses');
            Route::get('{campus}', [AwardController::class, 'colleges'])
                ->name('colleges');
            Route::get('{campus}/{college}/awards', [AwardController::class, 'awards'])
                ->name('awards');
            Route::get('awards/{award}', [AwardController::class, 'awardDetails'])
                ->name('award');
            Route::get('awards/{award}/edit', [AwardController::class, 'awardEdit'])
                ->name('award.edit');
            Route::put('awards/{award}', [AwardController::class, 'awardUpdate'])
                ->name('award.update');
            Route::patch('awards/{award}/archive', [AwardController::class, 'archive'])
                ->name('award.archive');
        });

        // International Partner Routes
        Route::group([
            'prefix' => 'international-partners',
            'as' => 'international-partners.'
        ], function () {
            Route::get('/', [InternationalPartnerController::class, 'campuses'])
                ->name('campuses');
            Route::get('{campus}', [InternationalPartnerController::class, 'colleges'])
                ->name('colleges');
            Route::get('{campus}/{college}/partnerships', [InternationalPartnerController::class, 'partnerships'])
                ->name('partnerships');
            Route::get('partnerships/{partnership}', [InternationalPartnerController::class, 'partnershipDetails'])
                ->name('partnership');
            Route::get('partnerships/{partnership}/edit', [InternationalPartnerController::class, 'partnershipEdit'])
                ->name('partnership.edit');
            Route::put('partnerships/{partnership}', [InternationalPartnerController::class, 'partnershipUpdate'])
                ->name('partnership.update');
            Route::patch('partnerships/{partnership}/archive', [InternationalPartnerController::class, 'archive'])
                ->name('partnership.archive');
        });

        // Resolution Routes
        Route::group([
            'prefix' => 'resolutions',
            'as' => 'resolutions.'
        ], function () {
            Route::get('/', [ResolutionController::class, 'index'])
                ->name('index');
            Route::get('create', [ResolutionController::class, 'create'])
                ->name('create');
            Route::post('/', [ResolutionController::class, 'store'])
                ->name('store');
            Route::get('{resolution}', [ResolutionController::class, 'show'])
                ->name('show');
            Route::get('{resolution}/edit', [ResolutionController::class, 'edit'])
                ->name('edit');
            Route::put('{resolution}', [ResolutionController::class, 'update'])
                ->name('update');
            Route::patch('{resolution}/archive', [ResolutionController::class, 'archive'])
                ->name('archive');
        });

        // User Management Routes
        Route::patch('users/bulk-activate', [AdminUserController::class, 'bulkActivate'])
            ->name('users.bulk-activate');
        Route::patch('users/bulk-deactivate', [AdminUserController::class, 'bulkDeactivate'])
            ->name('users.bulk-deactivate');
        Route::patch('users/{user}/toggle-admin', [AdminUserController::class, 'toggleAdmin'])
            ->name('users.toggle-admin');
        Route::resource('users', AdminUserController::class);

        // Reports Routes
        Route::group([
            'prefix' => 'report',
            'as' => 'report.'
        ], function () {
            Route::get('audit-trail', [ReportController::class, 'auditTrail'])
                ->name('audit-trail');
            Route::get('audit-trail/pdf', [ReportController::class, 'auditTrailPdf'])
                ->name('audit-trail.pdf');
            Route::get('projects', [ReportController::class, 'projects'])
                ->name('projects');
            Route::get('projects/pdf', [ReportController::class, 'projectsPdf'])
                ->name('projects.pdf');
            Route::get('awards', [ReportController::class, 'awards'])
                ->name('awards');
            Route::get('awards/pdf', [ReportController::class, 'awardsPdf'])
                ->name('awards.pdf');
            Route::get('international-partners', [ReportController::class, 'internationalPartners'])
                ->name('international-partners');
            Route::get('international-partners/pdf', [ReportController::class, 'internationalPartnersPdf'])
                ->name('international-partners.pdf');
            Route::get('users', [ReportController::class, 'users'])
                ->name('users');
            Route::get('users/pdf', [ReportController::class, 'usersPdf'])
                ->name('users.pdf');
            Route::get('modalities', [ReportController::class, 'modalities'])
                ->name('modalities');
            Route::get('modalities/pdf', [ReportController::class, 'modalitiesPdf'])
                ->name('modalities.pdf');
            Route::get('resolutions', [ReportController::class, 'resolutions'])
                ->name('resolutions');
            Route::get('resolutions/pdf', [ReportController::class, 'resolutionsPdf'])
                ->name('resolutions.pdf');
            Route::get('impact-assessments', [ReportController::class, 'impactAssessments'])
                ->name('impact-assessments');
            Route::get('impact-assessments/pdf', [ReportController::class, 'impactAssessmentsPdf'])
                ->name('impact-assessments.pdf');
        });

        // Campus Routes
        Route::group([
            'prefix' => 'campus',
            'as' => 'campus.'
        ], function () {
            Route::get('/', [CampusController::class, 'index'])
                ->name('index');
            Route::get('create', [CampusController::class, 'create'])
                ->name('create');
            Route::get('{campus}', [CampusController::class, 'show'])
                ->name('show');
            Route::post('/', [CampusController::class, 'store'])
                ->name('store');
            Route::get('{campus}/edit', [CampusController::class, 'edit'])
                ->name('edit');
            Route::patch('{campus}', [CampusController::class, 'update'])
                ->name('update');
            Route::delete('{campus}', [CampusController::class, 'destroy'])
                ->name('destroy');
        });

        // College Routes
        Route::group([
            'prefix' => 'college',
            'as' => 'college.'
        ], function () {
            Route::get('/', [CollegeController::class, 'index'])
                ->name('index');
            Route::get('create', [CollegeController::class, 'create'])
                ->name('create');
            Route::post('/', [CollegeController::class, 'store'])
                ->name('store');

            // Individual college routes (using campus_college ID for show)
            Route::get('{campusCollege}', [CollegeController::class, 'show'])
                ->name('show')
                ->where('campusCollege', '[0-9]+');
            Route::get('college/{college}/edit', [CollegeController::class, 'edit'])
                ->name('edit')
                ->where('college', '[0-9]+');
            Route::put('college/{college}', [CollegeController::class, 'update'])
                ->name('update')
                ->where('college', '[0-9]+');
            Route::delete('college/{college}', [CollegeController::class, 'destroy'])
                ->name('destroy')
                ->where('college', '[0-9]+');

            // Campus filtering route
            Route::get('campus/{campus}', [CollegeController::class, 'filterByCampus'])
                ->name('campus')
                ->where('campus', '[0-9]+');
        });
    });

    // User Routes
    Route::group([
        'prefix' => 'user',
        'as' => 'user.',
        'middleware' => 'is_user',
    ], function () {
        Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');

        // Project Routes
        Route::group([
            'prefix' => 'technology-transfer',
            'as' => 'technology-transfer.'
        ], function () {
            Route::get('/', [ProjectController::class, 'index'])
                ->name('index');
            Route::get('project/create', [ProjectController::class, 'create'])
                ->name('create');
            Route::get('project/{project}', [ProjectController::class, 'show'])
                ->name('show');
            Route::post('project', [ProjectController::class, 'store'])
                ->name('store');
            Route::get('project/{project}/edit', [ProjectController::class, 'edit'])
                ->name('edit');
            Route::put('project/{project}', [ProjectController::class, 'update'])
                ->name('update');
            Route::patch('project/{project}/archive', [ProjectController::class, 'archive'])
                ->name('archive');
        });

        // International Partner Routes
        Route::group([
            'prefix' => 'international-partners',
            'as' => 'international-partners.'
        ], function () {
            Route::get('/', [UserInternationalPartnerController::class, 'index'])
                ->name('index');
            Route::get('create', [UserInternationalPartnerController::class, 'create'])
                ->name('create');
            Route::get('{partner}', [UserInternationalPartnerController::class, 'show'])
                ->name('show');
            Route::post('/', [UserInternationalPartnerController::class, 'store'])
                ->name('store');
            Route::get('{partner}/edit', [UserInternationalPartnerController::class, 'edit'])
                ->name('edit');
            Route::put('{partner}', [UserInternationalPartnerController::class, 'update'])
                ->name('update');
            Route::patch('{partner}/archive', [UserInternationalPartnerController::class, 'archive'])
                ->name('archive');
        });

        // Awards Routes
        Route::group([
            'prefix' => 'awards',
            'as' => 'awards.'
        ], function () {
            Route::get('/', [UserAwardController::class, 'index'])
                ->name('index');
            Route::get('create', [UserAwardController::class, 'create'])
                ->name('create');
            Route::get('{award}/edit', [UserAwardController::class, 'edit'])
                ->name('edit');
            Route::get('{award}', [UserAwardController::class, 'show'])
                ->name('show');
            Route::post('/', [UserAwardController::class, 'store'])
                ->name('store');
            Route::get('{award}/edit', [UserAwardController::class, 'edit'])
                ->name('edit');
            Route::put('{award}', [UserAwardController::class, 'update'])
                ->name('update');
            Route::patch('{award}/archive', [UserAwardController::class, 'archive'])
                ->name('archive');
        });

        // Impact Assessment Routes
        Route::group([
            'prefix' => 'impact-assessments',
            'as' => 'impact-assessments.'
        ], function () {
            Route::get('/', [UserImpactAssessmentController::class, 'index'])
                ->name('index');
            Route::get('create', [UserImpactAssessmentController::class, 'create'])
                ->name('create');
            Route::get('{assessment}/edit', [UserImpactAssessmentController::class, 'edit'])
                ->name('edit');
            Route::get('{assessment}', [UserImpactAssessmentController::class, 'show'])
                ->name('show');
            Route::post('/', [UserImpactAssessmentController::class, 'store'])
                ->name('store');
            Route::get('{assessment}/edit', [UserImpactAssessmentController::class, 'edit'])
                ->name('edit');
            Route::put('{assessment}', [UserImpactAssessmentController::class, 'update'])
                ->name('update');
            Route::patch('{assessment}/archive', [UserImpactAssessmentController::class, 'archive'])
                ->name('archive');
        });

        // Modalities Routes
        Route::group([
            'prefix' => 'modalities',
            'as' => 'modalities.'
        ], function () {
            Route::get('/', [ModalitiesController::class, 'index'])
                ->name('index');
            Route::get('create', [ModalitiesController::class, 'create'])
                ->name('create');
            Route::get('{modality}', [ModalitiesController::class, 'show'])
                ->name('show');
            Route::post('/', [ModalitiesController::class, 'store'])
                ->name('store');
            Route::get('{modality}/edit', [ModalitiesController::class, 'edit'])
                ->name('edit');
            Route::put('{modality}', [ModalitiesController::class, 'update'])
                ->name('update');
            Route::patch('{modality}/archive', [ModalitiesController::class, 'archive'])
                ->name('archive');
        });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
