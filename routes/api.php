<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MaintenancePlanController; 
use App\Http\Controllers\MaintenancePlanControllerB; 
use App\Http\Controllers\MaintenancePlanControllerC; 

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

Route::delete('/delete-maintenance-plan/{id}', [MaintenancePlanController::class, 'destroy']);


Route::get('/pmyear-latest', [MaintenancePlanController::class, 'latest']);

Route::post('/employeeChecklist/{employeeId}', [MaintenancePlanController::class, 'employeeChecklist']);

Route::post('/add-employee', [MaintenancePlanController::class, 'addEmployee']);

Route::post('/submit-checklist', [MaintenancePlanController::class, 'submitChecklist']);



// SET B

// ✅ Get available years
Route::get('/yearsB', [MaintenancePlanControllerB::class, 'getYearsB']);

// ✅ Fetch maintenance plans (YrId required)
Route::get('/maintenance-plansB', [MaintenancePlanControllerB::class, 'getMaintenancePlansB']);

// ✅ Save/Update maintenance plan (use `saveMaintenancePlan()`)
Route::post('/save-maintenance-planB', [MaintenancePlanControllerB::class, 'saveMaintenancePlanB']);

Route::post('/add-collegesB', [MaintenancePlanControllerB::class, 'addCollegeB']);

Route::get('/officesB', [MaintenancePlanControllerB::class, 'getOfficeB']);

Route::delete('/delete-maintenance-planB/{id}', [MaintenancePlanControllerB::class, 'destroyB']);



// SET c

// ✅ Get available years
Route::get('/yearsC', [MaintenancePlanControllerC::class, 'getYearsC']);

// ✅ Fetch maintenance plans (YrId required)
Route::get('/maintenance-plansC', [MaintenancePlanControllerC::class, 'getMaintenancePlansC']);

// ✅ Save/Update maintenance plan (use `saveMaintenancePlan()`)
Route::post('/save-maintenance-planC', [MaintenancePlanControllerC::class, 'saveMaintenancePlanC']);

Route::post('/add-collegesC', [MaintenancePlanControllerC::class, 'addCollegeC']);

Route::get('/officesC', [MaintenancePlanControllerC::class, 'getOfficeC']);

Route::delete('/delete-maintenance-planC/{id}', [MaintenancePlanControllerC::class, 'destroyC']);
