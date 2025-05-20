<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\File; 
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function getOfficesAndDepartments()
    {
        $results = DB::select('CALL GetOfficesAndDepartments()');

        return response()->json($results);
    }

    public function AddOffice(Request $request)
    {
        $request->validate([
            'OfficeName' => 'required|string|max:255',
            'Code' => 'required|string|max:50',
            'Departments' => 'required|array|min:1', 
        ]);

        $officeName = $request->input('OfficeName');
        $code = $request->input('Code');
        $departments = implode(',', $request->input('Departments')); // convert to comma-separated

        try {
            DB::statement("CALL AddOfficeWithDepartments(?, ?, ?)", [
                $officeName,
                $code,
                $departments,
            ]);

            return response()->json(['message' => 'Office and departments added successfully.'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to insert data: ' . $e->getMessage()], 500);
        }
    }

    public function getPmYears()
    {
        $results = DB::select('CALL SelectYear()');

        return response()->json($results);
    }

    
public function AddYear(Request $request)
{
    $request->validate([
        'Name' => 'required|string|max:255',
        'Description' => 'required|string|max:255',
    ]);

    try {
        DB::statement('CALL AddYear(?, ?)', [
            $request->input('Name'),
            $request->input('Description')
        ]);

        return response()->json(['message' => 'Year added successfully'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to add year: ' . $e->getMessage()], 500);
    }
}
}