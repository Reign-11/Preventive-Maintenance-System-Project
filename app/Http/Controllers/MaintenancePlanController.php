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

        try {
            $existingOffice = DB::table('tbl_premainplan_details')
                ->join('tbl_office', 'tbl_office.OffId', '=', 'tbl_premainplan_details.OffId')
                ->where('tbl_office.OfficeName', $officeName)
                ->where('tbl_premainplan_details.YrId', $yrId)
                ->exists();

            if ($existingOffice) {
                return response()->json([
                    'message' => 'Office already exists for the selected year.'
                ], 409);
            }

            $result = DB::select("CALL AddOffice(?, ?, ?)", [$officeName, $parentOffId, $yrId]);

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
        $pmYearData = DB::table('tbl_pmyear')->where('YrId', $yrId)->first();

        return Inertia::render('Usertable', [
            'employee' => $employee,
            'officeId' => $officeId ?? '',
            'YrId' => $yrId ?? '',
            'employeeId' => $employeeId ?? '',
            'PlanId' => $PlanId ?? '', 
            'departmentId ' => $departmentId ?? '', 
            'department' => $department ?? [], 
            'categoryId' => $categoryId ?? 1,  // Ensure categoryId is 1 if missing

            'pmYear' => $pmYearData ? (array) $pmYearData : ['Name' => '', 'Description' => ''],
        ]);

    
    } catch (\Exception $e) {
        Log::error("❌ Error fetching employees:", ['error' => $e->getMessage()]);
        return redirect()->back()->withErrors(['error' => 'Failed to fetch employee data']);
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
            'pcName' => 'required|string|max:100',
            'dateAcquired' => 'required|date',
            'cpu_status' => 'required|integer',
            'keyboard_status' => 'required|integer',
            'printer_status' => 'required|integer',
            'monitor_status' => 'required|integer',
            'mouse_status' => 'required|integer',
            'ups_status' => 'required|integer',
            'avr_status' => 'required|integer',
            'windows10' => 'integer',
            'windows11' => 'integer',
            'license' => 'required|integer',
            'enrollment' => 'required|integer',
            'microsoft' => 'required|integer',
            'browser' => 'required|integer',
            'anti_virus' => 'required|integer',
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
            'checklist' => 'required|array',
            'checklist.*.task' => 'required|string|max:255',
            'checklist.*.details' => 'required|string',
            'checklist.*.status' => 'required|array',
            'checklist.*.status.*' => 'integer|min:0|max:1',
        ]);

        // Convert checklist array to JSON
        $checklistJson = json_encode($validated['checklist']);

        // Call Stored Procedure
        DB::statement("CALL InsertPreventiveMaintenance(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            $validated['employeeId'],
            $generatedTicketNumber,
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
            $checklistJson,  // Store checklist as JSON
        ]);

        return response()->json(['message' => 'Checklist submitted successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
}

    


