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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/main', function () {
    return Inertia::render('Main');
})->middleware(['auth', 'verified'])->name('main');
Route::get('/setb', function () {
    return Inertia::render('Setb');
})->middleware(['auth', 'verified'])->name('setb');
Route::get('/setc', function () {
    return Inertia::render('Setc');
})->middleware(['auth', 'verified'])->name('setc');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/preventive-maintenance', function () {
    return Inertia::render('PreventiveMaintenance');
})->middleware(['auth', 'verified'])->name('preventive-maintenance');



Route::get('/officeuser/{officeId}', [MaintenancePlanController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('officeuser');


Route::get('/department-employees/{departmentId}', [MaintenancePlanController::class, 'employee'])
    ->middleware(['auth', 'verified'])
    ->name('department-employees');

    
Route::get('/datacenter', function () {
    return Inertia::render('Datacenter');
})->middleware(['auth', 'verified'])->name('datacenter');




require __DIR__.'/auth.php';
