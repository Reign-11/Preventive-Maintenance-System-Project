<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MaintenancePlanController; 
use App\Http\Controllers\MaintenancePlanControllerB; 
use App\Http\Controllers\MaintenancePlanControllerC; 
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdminController;

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

Route::post('/departmentChecklist', [MaintenancePlanController::class, 'departmentChecklist']);

Route::post('/insertChecklist', [MaintenancePlanController::class, 'insertChecklist']);

Route::get('/getChecklistByYrId/{YrId}', [MaintenancePlanController::class, 'getChecklistByYrId']);

Route::put('/preventive-maintenance/{mainId}', [MaintenancePlanController::class, 'updatePreventiveMaintenance']);

Route::get('/employees', [MaintenancePlanController::class, 'getAllEmployees']);

Route::post('/duplicate', [MaintenancePlanController::class, 'duplicate']);

Route::post('/detach/{id}', [MaintenancePlanController::class, 'detach']);

Route::get('/monthly-counts', [MaintenancePlanController::class, 'getMonthlyCounts']);

Route::get('/maintenance-category-count', [MaintenancePlanController::class, 'getCategoryTaskCount']);

Route::get('/technicians', [MaintenancePlanController::class, 'getTechnicians']);


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

Route::post('/add-checkilist', [MaintenancePlanControllerB::class, 'addCollegeB']);

Route::post('/addDatacenter', [MaintenancePlanControllerB::class, 'addDatacenter']);

Route::get('/getAvailableMonths/{PlanId}/{departmentId}/{OffId}', [MaintenancePlanControllerB::class, 'getAvailableMonths']);

Route::post('/duplicates', [MaintenancePlanControllerB::class, 'duplicates']);

Route::post('/detached/{id}', [MaintenancePlanControllerB::class, 'detached']);

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

Route::post('/checklistC', [MaintenancePlanControllerC::class, 'checklistC']);

Route::post('/copy', [MaintenancePlanControllerC::class, 'copy']);

Route::post('/detaches/{id}', [MaintenancePlanControllerC::class, 'detaches']);

//Analytics Dashboard Routes
Route::post('/api/analytics/dashboard-data', [DashboardController::class, 'getDashboardData'])
    ->middleware('auth:sanctum');

    // Admin 

Route::get('/offices-with-departments', [AdminController::class, 'getOfficesAndDepartments']);

Route::post('/AddOffice', [AdminController::class, 'AddOffice']);