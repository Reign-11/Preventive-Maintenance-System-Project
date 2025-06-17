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
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;


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
            'Details' => 'required|string|max:250',

            'Departments' => 'required|array|min:1', 
            'Emails' => 'nullable|string|max:250',
        ]);

        $officeName = $request->input('OfficeName');

        $code = $request->input('Code');
        $details = $request->input('Details');
        $emails = $request->input('Emails');

        $departments = implode(',', $request->input('Departments')); // convert to comma-separated

        try {
            DB::statement("CALL AddOfficeWithDepartments(?, ?, ?, ?, ?)", [
                $officeName,

                $code,
                $details,
                $emails,
                $departments,
            ]);

            return response()->json(['message' => 'Office and departments added successfully.'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to insert data: ' . $e->getMessage()], 500);
        }
    }

    public function getPmYears()
    {
        $results = DB::select('CALL SelectYears()');

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

public function getLogs()
{
    $results = DB::select('CALL GetLogs()');

    return response()->json($results);
}


public function stores(Request $request)
{
    // Validate the input
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6|confirmed',
        'role' => [
            'required',
            Rule::in(['Admin', 'User']), 
        ],
    ]);

    // Hash the password
    $hashedPassword = Hash::make($validated['password']);

    try {
        // Call stored procedure
        DB::statement("CALL AddUser(?, ?, ?, ?)", [
            $validated['name'],
            $validated['email'],
            $hashedPassword,
            $validated['role'],
        ]);

        return response()->json(['message' => 'User created successfully'], 201);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to create user',
            'message' => $e->getMessage()
        ], 500);
    }
}

public function getUser()
{
    $results = DB::select('CALL GetUser()');

    return response()->json($results);
}

public function updateUser(Request $request,$id)
{
    // Validate input
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'role' => 'required|in:Admin,User',
        'password' => 'nullable|string|min:6',
    ]);

    try {
        // If password is provided, hash it; else pass empty string
        $hashedPassword = $request->filled('password') ? Hash::make($request->password) : '';

        // Call stored procedure
        DB::statement('CALL UpdateUser(?, ?, ?, ?, ?)', [
            $id,
            $request->name,
            $request->email,
            $hashedPassword,
            $request->role
        ]);

        return response()->json(['message' => 'User updated successfully.'], 200);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


public function PmYears()
{
    $years = DB::table('tbl_pmyear')->select('YrId', 'Name', 'Description')->get();
    return response()->json($years);
}



public function getLicenseCount(Request $request)
{
$yearId = $request->query('YrId');
    if (!$yearId) {
        return response()->json(['error' => 'Year ID is required.'], 400);
    }

    try {
        $data = DB::select('CALL ShowLicenseCountByYear(?)', [$yearId]);

        if (empty($data)) {
            return response()->json(['pieChart' => []]); 
        }

        $row = $data[0]; 

        $colors = ['#28a745', '#dc3545']; // green and red

        $pieChart = [
            [
                'label' => 'Licensed',
                'value' => $row->licensed_count ?? 0,
                'color' => $colors[0]
            ],
            [
                'label' => 'Unlicensed',
                'value' => $row->unlicensed_count ?? 0,
                'color' => $colors[1]
            ]
        ];

        return response()->json([
            'pieChart' => $pieChart
        ]);

    } catch (\Throwable $e) {
        \Log::error("Error in getLicenseCount: " . $e->getMessage());
        return response()->json([
            'error' => 'Server error: ' . $e->getMessage()
        ], 500);
    }
}

public function getEquipmentCount(Request $request)
{
    $yearId = $request->query('YrId');
    if (!$yearId) {
        return response()->json(['error' => 'Year ID is required.'], 400);
    }

    try {
        $data = DB::select('CALL ShowEquipmentCountByYear(?)', [$yearId]);

        if (empty($data)) {
            return response()->json(['barChart' => []]); // Return empty array if no data
        }

        $row = $data[0]; // Single row returned

        $barChart = [
            [
                'label' => 'Active Computer',
                'value' => $row->equipment_count ?? 0,
                'color' => '#007bff' // Blue
            ],
            [
                'label' => 'Disposed Computer', 
                'value' => $row->disposal_count ?? 0,
                'color' => '#dc3545' // Red
            ]
        ];

        return response()->json([
            'barChart' => $barChart
        ]);

    } catch (\Throwable $e) {
        \Log::error("Error in getEquipmentCount: " . $e->getMessage());
        return response()->json([
            'error' => 'Server error: ' . $e->getMessage()
        ], 500);
    }
}

public function toggleYearStatus(Request $request)
{
    $yearId = $request->input('id');

    // Call the stored procedure
    DB::statement('CALL ToggleYearActiveStatus(?)', [$yearId]);

    return response()->json(['message' => 'Status toggled successfully!']);
}

public function updateYear(Request $request,$YrId)
{
    // Validate input
    $validated = $request->validate([
        'Name' => 'required|string|max:255',
        'Description' => 'required|string|max:255',

    ]);

    try {
    

        // Call stored procedure
        DB::statement('CALL UpdateYear( ?,?, ?)', [
            $YrId,
            $request->Name,
            $request->Description,
       
        ]);

        return response()->json(['message' => 'User updated successfully.'], 200);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

}