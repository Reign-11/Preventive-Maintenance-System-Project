<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MaintenancePlanController; 

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ✅ Get available years
Route::get('/years', [MaintenancePlanController::class, 'getYears']);

// ✅ Fetch maintenance plans (YrId required)
Route::get('/maintenance-plans', [MaintenancePlanController::class, 'getMaintenancePlans']);

// ✅ Save/Update maintenance plan (use `saveMaintenancePlan()`)
Route::post('/save-maintenance-plan', [MaintenancePlanController::class, 'saveMaintenancePlan']);

Route::post('/add-colleges', [MaintenancePlanController::class, 'addCollege']);


Route::get('/offices', [MaintenancePlanController::class, 'getOffice']);
