<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Controllers\Admin\MainController;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\MaintenancePlanController;
use App\Http\Controllers\MaintenancePlanControllerB;
use App\Http\Controllers\MaintenancePlanControllerC;
use App\Http\Controllers\WordExportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdminController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/', function () {  
    return redirect()->route('login');  
});  



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified', 'role:User'])->group(function () {

    Route::get('/preventive-maintenance', function () {
        return Inertia::render('PreventiveMaintenance');
    })->name('preventive-maintenance');

    Route::get('/officeuser/{officeId}', [MaintenancePlanController::class, 'index'])->name('officeuser');

    Route::get('/equipment/{departmentId}', [MaintenancePlanController::class, 'department'])->name('equipment');

    Route::get('/department-employees/{departmentId}', [MaintenancePlanController::class, 'employee'])->name('department-employees');

    Route::get('/employees/{employeeId}', [MaintenancePlanController::class, 'employees'])->name('employees');

    Route::get('/datacenter/{officeId}', [MaintenancePlanControllerB::class, 'data'])->name('datacenter');

    Route::get('/prevoffice/{officeId}', [MaintenancePlanControllerC::class, 'prev'])->name('prevoffice');

    Route::get('/viewdata/{departmentId}', [MaintenancePlanControllerB::class, 'departments'])->name('viewdata');

    Route::get('/network/{departmentId}', [MaintenancePlanControllerC::class, 'network'])->name('network');

    Route::get('/dashboard', function () {  return Inertia::render('Dashboard'); })->name('dashboard');

    Route::get('/main', function () {return Inertia::render('Main'); })->name('main');

    Route::get('/setb', function () { return Inertia::render('Setb'); })->name('setb');

    Route::get('/setc', function () {return Inertia::render('Setc'); })->name('setc');
});

    Route::middleware(['auth', 'verified', 'role:Admin'])->group(function () {

    Route::get('/admin', function () {return Inertia::render('Admin'); })->name('admin');
    Route::get('/addoffice', function () { return Inertia::render('AddOffice'); })->name('addoffice');
    Route::get('/addyear', function () { return Inertia::render('AddYear'); })->name('addyear');
    Route::get('/logs', function () { return Inertia::render('Logs'); })->name('logs');


});
require __DIR__.'/auth.php';