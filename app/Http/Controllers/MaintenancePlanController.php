<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MaintenancePlanController extends Controller
{
    public function getMaintenancePlans(Request $request)
    {
        $YrId = $request->query('YrId');
        $CatId = $request->query('CatId', 1); 

        if (empty($YrId)) {
            return response()->json(['error' => 'YrId is required'], 400);
        }

        try {
            $YrId = intval($YrId);
            $CatId = isset($CatId) ? intval($CatId) : null;

            $maintenancePlans = DB::select("CALL AddFilterByYrCat(?, ?)", [$YrId, $CatId]);

            return response()->json($maintenancePlans);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve maintenance plans',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function getYears()
    {
        $years = DB::table('tbl_pmyear')->select('YrId', 'Name', 'Description')->get();
        return response()->json($years);
    }

    public function saveMaintenancePlan(Request $request)
    {
        try {
            Log::info("Received data:", $request->all());

            $data = $request->validate([
                'PlanId'    => 'nullable|integer',
                'YrId'      => 'required|integer|exists:tbl_pmyear,YrId',
                'OffId'     => 'required|integer|exists:tbl_office,OffId',
                'CatId'     => 'required|integer|exists:tbl_pms_category,CatId',
                'January'   => 'nullable|string|max:10',
                'February'  => 'nullable|string|max:10',
                'March'     => 'nullable|string|max:10',
                'April'     => 'nullable|string|max:10',
                'May'       => 'nullable|string|max:10',
                'June'      => 'nullable|string|max:10',
                'July'      => 'nullable|string|max:10',
                'August'    => 'nullable|string|max:10',
                'September' => 'nullable|string|max:10',
                'October'   => 'nullable|string|max:10',
                'November'  => 'nullable|string|max:10',
                'December'  => 'nullable|string|max:10',
            ]);

            $prevPlan = DB::table('tbl_premainplan')->latest('PrevId')->first();
            $PrevId = $prevPlan ? $prevPlan->PrevId : 0; 

            Log::info("Validated data with PrevId:", array_merge($data, ['PrevId' => $PrevId]));

            DB::statement("CALL ValidateAndManagePlanDetails(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                $data['PlanId'] ?? null,
                $data['YrId'],
                $data['OffId'],
                $data['CatId'],
                $PrevId,
                $data['January'] ?? '',
                $data['February'] ?? '',
                $data['March'] ?? '',
                $data['April'] ?? '',
                $data['May'] ?? '',
                $data['June'] ?? '',
                $data['July'] ?? '',
                $data['August'] ?? '',
                $data['September'] ?? '',
                $data['October'] ?? '',
                $data['November'] ?? '',
                $data['December'] ?? '',
            ]);

            return response()->json(["message" => "Plan saved successfully"], 200);
        } catch (\Throwable $e) {
            Log::error("Error saving plan:", ['error' => $e->getMessage()]);
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }


    
    public function addCollege(Request $request)
    {
        $request->validate([
            'OfficeName'  => 'required|string|max:255',
            'ParentOffId' => 'nullable|integer|exists:tbl_office,OffId',
            'YrId'        => 'nullable|integer|exists:tbl_pmyear,YrId'
        ]);
    
        $officeName  = $request->input('OfficeName');
        $parentOffId = $request->filled('ParentOffId') ? $request->input('ParentOffId') : null;
        $yrId        = $request->filled('YrId') ? $request->input('YrId') : null;
        $catId       = 1; // Set the CatId to 2
    
        try {
            $existingOffice = DB::table('tbl_premainplan_details')
            ->join('tbl_office', 'tbl_office.OffId', '=', 'tbl_premainplan_details.OffId')
            ->where('tbl_office.OfficeName', $officeName)
            ->where('tbl_premainplan_details.YrId', $yrId)
            ->where('tbl_premainplan_details.CatId', $catId)
            ->exists();
        
    
            if ($existingOffice) {
                return response()->json([   
                    'message' => 'Office already exists for the selected year.'
                ], 409);
            }
    
            // Include CatId in the stored procedure call
            $result = DB::select("CALL AddOffice(?, ?, ?, ? )", [$officeName, $parentOffId, $yrId, $catId]);
    
            if (!empty($result) && isset($result[0]->NewOfficeID)) {
                return response()->json([
                    'message'  => 'Office recorded successfully in the selected year.',
                    'OfficeID' => $result[0]->NewOfficeID
                ]);
            }
    
            return response()->json([
                'message' => 'Failed to record office. No valid ID returned.'
            ], 500);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        }
    }
    

    public function destroy($id)
    {
        Log::info("Attempting to delete MaintenancePlan with ID: " . $id);

        $plan = MaintenancePlan::find($id);

        if (!$plan) {
            Log::warning("Plan not found for ID: " . $id);
            return response()->json(['message' => 'Plan not found'], 404);
        }

        try {
            $plan->delete();
            Log::info("Deleted MaintenancePlan ID: " . $id);
            return response()->json(['message' => 'Plan deleted successfully']);
        } catch (\Exception $e) {
            Log::error("Error deleting MaintenancePlan ID: " . $id, ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to delete plan', 'details' => $e->getMessage()], 500);
        }
    }

    public function getOffice()
    {
        try {
            $offices = DB::select('CALL SelectOffice()');
            return response()->json($offices);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve offices',
                'details' => $e->getMessage()
            ], 500);
        }
    }


    
    public function index(Request $request, int $officeId)
    {
        try {
            $yrId = $request->query('YrId');  
            $deptId = $request->query('departmentId'); 
            $PlanId  = $request->query('PlanId'); 
            $categoryId = $request->query('CatId', 1); // Default categoryId to 1


            Log::info('Yrd Data:', ['data' => $yrId]);
    
            // Fetch office data (which contains the correct PlanId)
            $office = DB::table('tbl_office')->where('OffId', $officeId)->first();
            Log::info('Office Data:', ['data' => $office]);
    
            // Fetch departments using the stored procedure
            $departmentData = DB::select("CALL GetDepartmentsByOffice(?)", [$officeId]); 
            Log::info("📢 Raw departments Data Before Filtering:", $departmentData  );

            // Filter departments based on PlanId, YrId, and OfficeId
            $departments = array_filter($departmentData, function ($department) use ($PlanId, $yrId, $officeId,$categoryId) {
                return $department->PlanId == $PlanId && $department->YrId == $yrId && $department->OffId == $officeId  &&  ($department->CatId == $categoryId || is_null($department->CatId));  ;
            });
    
            // Re-index to ensure departments is a clean array (not an object)
            $departments = array_values($departments);
    
            // Apply default values for missing fields
            foreach ($departments as $dept) {
                $dept->employeeId = $dept->employeeId ?? null; 
                $dept->employee_number = $dept->employee_number ?? 'N/A';
                $dept->emp_name = $dept->emp_name ?? 'No Employee';
                $dept->is_Active = $dept->is_Active ?? 0;
            }
    
            // Fetch PM Year data if YrId is provided
            $pmYear = $yrId ? DB::table('tbl_pmyear')->where('YrId', $yrId)->first() : null;
            $pmYearData = $pmYear ? (array) $pmYear : ['Name' => '', 'Description' => ''];
    
            // Return to Inertia with the required data
            return Inertia::render('OfficeUser', [
                'departments' => $departments,  
                'pmYear' => $pmYearData,
                'YrId' => $yrId ?? '',
                'PlanId' => $PlanId ?? '', 
                'office' => $office ?? [],
                'deptId' => $deptId ?? '', 
                'officeId' => $officeId ?? '',
                'categoryId' => $categoryId ?? 1,  // Ensure categoryId is 1 if missing

            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching office data: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Failed to fetch office data']);
        }
    }
    
     

    public function employee(Request $request, int $departmentId )
    {
    try {
        // Use route parameter directly
        $yrId = $request->query('YrId');  
        $PlanId  = $request->query('PlanId'); 
        $officeId  = $request->query('officeId'); 
        $employeeId = $request->query('employeeId');  
        $categoryId = $request->query('CatId', 1); 


        $department = DB::table('tbl_department')->where('deptId', $departmentId)->first();

        // Fetch employees using the stored procedure
        $employees = DB::select('CALL GetEmployeesByDepartment(?)', [$departmentId]);
        Log::info("📢 Raw Employees Data Before Filtering:", $employees);

            // Filter Employee based on PlanId, YrId, OfficeId, And Department

        $employee = array_filter($employees, function ($emp) use ($PlanId, $yrId, $officeId, $departmentId,$categoryId) {
            return $emp-> PlanId == $PlanId && $emp-> YrId == $yrId && $emp-> OffId == $officeId && $emp-> DeptId == $departmentId &&  ($emp->CatId == $categoryId || is_null($emp->CatId));
        });

        $employee = array_values($employee);
        
        Log::info("📢 Filtered Employees:", $employee);

        // Fetch additional data (PM Year & Office Details)
        $pmYearData = DB::table('tbl_pmyear')->get();

        return Inertia::render('Usertable', [
            'employee' => $employee,
            'officeId' => $officeId ?? '',
            'YrId' => $yrId ?? '',
            'employeeId' => $employeeId ?? '',
            'PlanId' => $PlanId ?? '', 
            'departmentId ' => $departmentId ?? '', 
            'department' => $department ?? [], 
            'categoryId' => $categoryId ?? 1,  // Ensure categoryId is 1 if missing
            'pmYearList' => $pmYearData, // Send array of all years
            'pmYear' => $pmYearData->first() ? (array) $pmYearData->first() : ['Name' => '', 'Description' => ''],
        ]);

    
    } catch (\Exception $e) {
        Log::error("❌ Error fetching employees:", ['error' => $e->getMessage()]);
        return redirect()->back()->withErrors(['error' => 'Failed to fetch employee data']);
    }
}


public function employees(Request $request, int $employeeId)
{
    try {
        // Extract query params
        $yrId = $request->query('YrId');  
        $PlanId = $request->query('PlanId'); 
        $officeId = $request->query('officeId'); 
        $categoryId = $request->query('CatId', 1)   ; 
        $departmentId = $request->query('DeptId'); 

        // Fetch employees using the stored procedure
        $employed = DB::select('CALL GetEquipmentDetailsByEmployeeId(?)', [$employeeId]);
        Log::info("📢 Raw Employees Data Before Filtering:", $employed);

        // Filter Employee based on PlanId, YrId, OfficeId, Dept, CatId, and employeeId
        $employees = array_filter($employed, function ($emp) use ($PlanId, $yrId, $officeId, $departmentId, $categoryId, $employeeId) {
            return 
                $emp->PlanId == $PlanId &&
                $emp->YrId == $yrId &&
                $emp->OffId == $officeId &&
                $emp->DeptId == $departmentId &&
                ($emp->CatId == $categoryId || is_null($emp->CatId)) &&
                $emp->employeeId == $employeeId;
        });

        $employees = array_values($employees);
        Log::info("📢 Filtered Employees:", $employees);

        // Get PM Year
        $pmYearData = DB::table('tbl_pmyear')->where('YrId', $yrId)->first();

        return Inertia::render('Employees', [
            'employees' => $employees,
            'officeId' => $officeId ?? '',
            'YrId' => $yrId ?? '',
            'employeeId' => $employeeId ?? '',
            'PlanId' => $PlanId ?? '', 
            'departmentId' => $departmentId ?? '',  // ✅ Fix variable name here
            'categoryId' => $categoryId ?? 1,
            'pmYear' => $pmYearData ? (array) $pmYearData : ['Name' => '', 'Description' => ''],
        ]);
    } catch (\Exception $e) {
        Log::error("❌ Error fetching employees:", ['error' => $e->getMessage()]);
        return redirect()->back()->withErrors(['error' => 'Failed to fetch employee data']);
    }
}



public function addEmployee(Request $request)
{
    $validatedData = $request->validate([
        'emp_name' => 'required|string|max:255',
        'employee_number' => 'required|string|max:50',
        'offId' => 'nullable|integer',
        'deptId' => 'nullable|integer'
    ]);

    try {
        DB::statement('CALL AddEmployee(?, ?, ?, ?)', [
            $validatedData['emp_name'],
            $validatedData['employee_number'],
            $validatedData['offId'] ?? 0,
            $validatedData['deptId'] ?? 0
        ]);

        return response()->json(['message' => 'Employee added successfully'], 201);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
    }
} 

public function employeeChecklist(Request $request)
{
    try {
        $currentTimestamp = now();
        $day = $currentTimestamp->format('d');
        $month = $currentTimestamp->format('m');
        $year = $currentTimestamp->format('y');

        // Generate Ticket Number
        $submissionOrder = DB::table('tbl_preventive_maintainance')
            ->whereDate('date', $currentTimestamp->toDateString())
            ->count() + 1;

        $generatedTicketNumber = str_pad($submissionOrder, 2, '0', STR_PAD_LEFT) . $day . $month . $year;

        // Validate Request
        $validated = $request->validate([
            'employeeId' => 'required|integer',
            'YrId' => 'required|integer',
            'pcName' => 'nullable|string|max:100',
            'equipment' => 'required|string|max:50',
            'dateAcquired' => 'required|date',
            'cpu_status' => 'nullable|integer',
            'keyboard_status' => 'nullable|integer',
            'printer_status' => 'nullable|integer',
            'monitor_status' => 'nullable|integer',
            'mouse_status' => 'nullable|integer',
            'ups_status' => 'nullable|integer',
            'avr_status' => 'nullable|integer',
            'windows10' => 'integer',
            'windows11' => 'integer',
            'license' => 'nullable|integer',
            'enrollment' => 'nullable|integer',
            'microsoft' => 'nullable|integer',
            'browser' => 'nullable|integer',
            'anti_virus' => 'nullable|integer',
            'word_processor' =>'nullable|integer',
            'adobe_reader'  => 'nullable|integer',
            'media_player' => 'nullable|integer',
            'other_equip' => 'nullable|max:255',
            'other_os' => 'nullable|max:255',
            'other_sys' => 'nullable|max:255',
            'processor_details' => 'nullable|string|max:255',
            'motherboard_details' => 'nullable|string|max:255',
            'memory_details' => 'nullable|string|max:255',
            'graphics_card_details' => 'nullable|string|max:255',
            'hard_disk_details' => 'nullable|string|max:255',
            'monitor_details' => 'nullable|string|max:255',
            'casing_details' => 'nullable|string|max:255',
            'power_supply_details' => 'nullable|string|max:255',
            'keyboard_details' => 'nullable|string|max:255',
            'mouse_details' => 'nullable|string|max:255',
            'avr_details' => 'nullable|string|max:255',
            'ups_details' => 'nullable|string|max:255',
            'printer_details' => 'nullable|string|max:255',
            'network_mac_ip_details' => 'nullable|string|max:255',
            'disposal' => 'nullable|integer|max:255',

            
        ]);

        // Prepare parameters for the stored procedure
        $parameters = [
            $validated['employeeId'],
            $validated['YrId'],
            $generatedTicketNumber,
            $validated['equipment'],
            $validated['pcName'],
            $validated['dateAcquired'],
            $validated['cpu_status'],
            $validated['keyboard_status'],
            $validated['printer_status'],
            $validated['monitor_status'],
            $validated['mouse_status'],
            $validated['ups_status'],
            $validated['avr_status'],
            $validated['windows10'],
            $validated['windows11'],
            $validated['license'],
            $validated['enrollment'],
            $validated['microsoft'],
            $validated['browser'],
            $validated['anti_virus'],
            $validated['word_processor'],
            $validated['adobe_reader'],
            $validated['media_player'],
            $validated['other_equip'],
            $validated['other_os'],
            $validated['other_sys'],
            $validated['processor_details'],
            $validated['motherboard_details'],
            $validated['memory_details'],
            $validated['graphics_card_details'],
            $validated['hard_disk_details'],
            $validated['monitor_details'],
            $validated['casing_details'],
            $validated['power_supply_details'],
            $validated['keyboard_details'],
            $validated['mouse_details'],
            $validated['avr_details'],
            $validated['ups_details'],
            $validated['printer_details'],
            $validated['network_mac_ip_details'],
            $validated['disposal'] , 

        ];

        // Log the parameters
        \Log::info('Parameters passed to stored procedure: ', $parameters);

        // Call Stored Procedure
        DB::statement("CALL InsertPreventiveMaintenanceChecklist(?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)", $parameters);

        // Get the saved record using the ticket number
        $savedData = DB::table('tbl_preventive_maintainance')
            ->where('ticketnumber', $generatedTicketNumber)
            ->first();

        return response()->json([
            'message' => 'Checklist submitted successfully',
            'data' => $savedData
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}



public function submitChecklist(Request $request)
{
    try {
        // Validate the request
        $validated = $request->validate([
            'mainId' => 'required|integer',
            'YrId' => 'required|integer',
            'task' => 'nullable|string',
            'details' => 'required|string',
            'summary' => 'required|string',
            'status' => 'required|integer',


        ]);

        // Log for debugging
        \Log::info('Checklist Payload:', $request->all());

        DB::statement('CALL InsertPreventiveChecklist(?, ?, ?, ?, ?,?)', [
            $request->mainId,
            $request->YrId,
            $request->task,
            $request->details,
            $request->summary,
            $request->status,

        ]);
        return response()->json(['message' => 'Checklist submitted successfully.'], 200);

    } catch (\Exception $e) {
        \Log::error('Checklist submission failed', [
            'error' => $e->getMessage()
        ]);

        return response()->json([
            'message' => 'Failed to submit checklist.',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function insertChecklist(Request $request)
{
    // Validate inputs
    $validated = $request->validate([
        'mainId' => 'required|integer',
        'YrId' => 'required|integer',

        // System Settings
        'System_Boot' => 'required|integer',
        'System_Log' => 'required|integer',

        // Network Settings
        'Network_Settings1' => 'required|integer',
        'Network_Settings2' => 'required|integer',
        'Network_Settings3' => 'required|integer',
        'Network_Settings4' => 'required|integer',
        'Network_Settings5' => 'required|integer',
        'Network_Settings6' => 'required|integer',

        // Computer Hardware Settings
        'Computer_Hardware_Settings1' => 'required|integer',
        'Computer_Hardware_Settings2' => 'required|integer',
        'Computer_Hardware_Settings3' => 'required|integer',
        'Computer_Hardware_Settings4' => 'required|integer',
        'Computer_Hardware_Settings5' => 'required|integer',
        'Computer_Hardware_Settings6' => 'required|integer',

        // Software Checks
        'Browser_Settings' => 'required|integer',
        'Proper_Software_Loads' => 'required|integer',

        // Virus/Malware Scanning
        'Viruses_Malware1' => 'required|integer',
        'Viruses_Malware2' => 'required|integer',

        // Clearance
        'Clearance1' => 'required|integer',
        'Clearance2' => 'required|integer',
        'Clearance3' => 'required|integer',
        'Clearance4' => 'required|integer',

        // Interior Cleaning
        'Interiors_Cleaning1' => 'required|integer',
        'Interiors_Cleaning2' => 'required|integer',
        'Interiors_Cleaning3' => 'required|integer',
        'Interiors_Cleaning4' => 'required|integer',
        'Interiors_Cleaning5' => 'required|integer',

        // Peripherals
        'Peripheral_Devices1' => 'required|integer',
        'Peripheral_Devices2' => 'required|integer',
        'Peripheral_Devices3' => 'required|integer',
        'Peripheral_Devices4' => 'required|integer',
        'Peripheral_Devices5' => 'required|integer',
        'Peripheral_Devices6' => 'required|integer',
        'Peripheral_Devices7' => 'required|integer',

        // Summary (String)
        'Summary' => 'required|string',
    ]);

    try {
        DB::statement('CALL InsertPreventiveChecklist2(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,? )', [
            $validated['mainId'],
            $validated['YrId'],

            $validated['System_Boot'],
            $validated['System_Log'],

            $validated['Network_Settings1'],
            $validated['Network_Settings2'],
            $validated['Network_Settings3'],
            $validated['Network_Settings4'],
            $validated['Network_Settings5'],
            $validated['Network_Settings6'],

            $validated['Computer_Hardware_Settings1'],
            $validated['Computer_Hardware_Settings2'],
            $validated['Computer_Hardware_Settings3'],
            $validated['Computer_Hardware_Settings4'],
            $validated['Computer_Hardware_Settings5'],
            $validated['Computer_Hardware_Settings6'],

            $validated['Browser_Settings'],

            $validated['Proper_Software_Loads'],

            $validated['Viruses_Malware1'],
            $validated['Viruses_Malware2'],

            $validated['Clearance1'],
            $validated['Clearance2'],
            $validated['Clearance3'],
            $validated['Clearance4'],

            $validated['Interiors_Cleaning1'],
            $validated['Interiors_Cleaning2'],
            $validated['Interiors_Cleaning3'],
            $validated['Interiors_Cleaning4'],
            $validated['Interiors_Cleaning5'],

            $validated['Peripheral_Devices1'],
            $validated['Peripheral_Devices2'],
            $validated['Peripheral_Devices3'],
            $validated['Peripheral_Devices4'],
            $validated['Peripheral_Devices5'],
            $validated['Peripheral_Devices6'],
            $validated['Peripheral_Devices7'],
            
            $validated['Summary'],
        ]);

        return response()->json(['message' => 'Checklist inserted successfully.'], 200);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to insert checklist.',
            'details' => $e->getMessage()
        ], 500);
    }
}



public function department(Request $request, int $departmentId )
{
try {
    // Use route parameter directly
    $yrId = $request->query('YrId');  
    $PlanId  = $request->query('PlanId'); 
    $officeId  = $request->query('officeId'); 
    $categoryId = $request->query('CatId', 1); 



    $dept = DB::select('CALL GetDepartmentPlanDetails(?)', [$departmentId]);

    $depts = array_filter($dept, function ($depart) use ($PlanId, $yrId, $officeId, $departmentId,$categoryId) {
        return $depart-> PlanId == $PlanId 
        && $depart-> YrId == $yrId
        && $depart-> OffId == $officeId
        && $depart-> deptId == $departmentId
        &&  ($depart->CatId == $categoryId || is_null($depart->CatId));
    });


    $depts = array_values ($depts);

    $pmYearData = DB::table('tbl_pmyear')->get();


    return Inertia::render('Equipment', [
        'departments' => $depts,
        'YrId' => $yrId ?? '',
        'PlanId' => $PlanId ?? '',
        'officeId' => $officeId ?? '',
        'CatId' => $categoryId ?? 1,
        'pmYearList' => $pmYearData, 
        'pmYear' => $pmYearData->first() ? (array) $pmYearData->first() : ['Name' => '', 'Description' => ''],

    ]);

} catch (\Exception $e) {
    Log::error("❌ Error fetching department:", ['error' => $e->getMessage()]);
    return redirect()->back()->withErrors(['error' => 'Failed to fetch department data']);
}
}


  
public function departmentChecklist(Request $request)
{
    try {
        $currentTimestamp = now();
        $day = $currentTimestamp->format('d');
        $month = $currentTimestamp->format('m');
        $year = $currentTimestamp->format('y');

        // Generate Ticket Number
        $submissionOrder = DB::table('tbl_preventive_maintainance')
            ->whereDate('date', $currentTimestamp->toDateString())
            ->count() + 1;

        $generatedTicketNumber = str_pad($submissionOrder, 2, '0', STR_PAD_LEFT) . $day . $month . $year;

        // Validate Request
        $validated = $request->validate([
            'employeeId' => 'nullable|integer',
            'deptId' => 'required|integer', 
            'YrId' => 'required|integer',
            'pcName' => 'required|string|max:100',
            'equipment' => 'required|string|max:50',
            'dateAcquired' => 'required|date',
            'cpu_status' => 'nullable|integer',
            'keyboard_status' => 'nullable|integer',
            'printer_status' => 'nullable|integer',
            'monitor_status' => 'nullable|integer',
            'mouse_status' => 'nullable|integer',
            'ups_status' => 'nullable|integer',
            'avr_status' => 'nullable|integer',
            'windows10' => 'nullable|integer',
            'windows11' => 'nullable|integer',
            'license' => 'nullable|integer',
            'enrollment' => 'nullable|integer',
            'microsoft' => 'nullable|integer',
            'browser' => 'nullable|integer',
            'anti_virus' => 'nullable|integer',
            'word_processor' => 'nullable|integer',
            'adobe_reader' => 'nullable|integer',
            'media_player' => 'nullable|integer',
            'other_equip' => 'nullable|string|max:255',
            'other_os' => 'nullable|string|max:255',
            'other_sys' => 'nullable|string|max:255',
            'processor_details' => 'nullable|string|max:255',
            'motherboard_details' => 'nullable|string|max:255',
            'memory_details' => 'nullable|string|max:255',
            'graphics_card_details' => 'nullable|string|max:255',
            'hard_disk_details' => 'nullable|string|max:255',
            'monitor_details' => 'nullable|string|max:255',
            'casing_details' => 'nullable|string|max:255',
            'power_supply_details' => 'nullable|string|max:255',
            'keyboard_details' => 'nullable|string|max:255',
            'mouse_details' => 'nullable|string|max:255',
            'avr_details' => 'nullable|string|max:255',
            'ups_details' => 'nullable|string|max:255',
            'printer_details' => 'nullable|string|max:255',
            'network_mac_ip_details' => 'nullable|string|max:255',
        ]);

        // Prepare parameters for the stored procedure
        $parameters = [
            $validated['employeeId'] ?? null,
            $validated['deptId'], 
            $validated['YrId'],
            $generatedTicketNumber,
            $validated['equipment'],
            $validated['pcName'],
            $validated['dateAcquired'],
            $validated['cpu_status'],
            $validated['keyboard_status'],
            $validated['printer_status'],
            $validated['monitor_status'],
            $validated['mouse_status'],
            $validated['ups_status'],
            $validated['avr_status'],
            $validated['windows10'],
            $validated['windows11'],
            $validated['license'],
            $validated['enrollment'],
            $validated['microsoft'],
            $validated['browser'],
            $validated['anti_virus'],
            $validated['word_processor'],
            $validated['adobe_reader'],
            $validated['media_player'],
            $validated['other_equip'],
            $validated['other_os'],
            $validated['other_sys'],
            $validated['processor_details'],
            $validated['motherboard_details'],
            $validated['memory_details'],
            $validated['graphics_card_details'],
            $validated['hard_disk_details'],
            $validated['monitor_details'],
            $validated['casing_details'],
            $validated['power_supply_details'],
            $validated['keyboard_details'],
            $validated['mouse_details'],
            $validated['avr_details'],
            $validated['ups_details'],
            $validated['printer_details'],
            $validated['network_mac_ip_details'],
        ];

        // Log the parameters
        \Log::info('Parameters passed to stored procedure: ', $parameters);

        // Call the Stored Procedure
        DB::statement("CALL InsertPreventiveMaintenance(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)", $parameters);

        $savedData = DB::table('tbl_preventive_maintainance')
        ->where('ticketnumber', $generatedTicketNumber)
        ->first();

    return response()->json([
        'message' => 'Checklist submitted successfully',
        'data' => $savedData
    ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


public function getChecklistByYrId($YrId)
{
    try {
        $results = DB::select('CALL GetChecklistByYrId(?)', [$YrId]);

        return response()->json([
            'success' => true,
            'data' => $results
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error retrieving checklist.',
            'error' => $e->getMessage()
        ], 500);
    }
}

}



