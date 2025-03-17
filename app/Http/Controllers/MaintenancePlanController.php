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
            $deptId = $request->query('departmentId'); // ✅ Extract deptId from query params
            Log::info("Received Office ID: $officeId, Year ID: $yrId, Dept ID: $deptId");
    
            // Fetch departments using stored procedure
            $departments = DB::select("CALL GetDepartmentsByOffice(?)", [$officeId]);
            Log::info('Departments:', ['data' => $departments]);
    
            if (empty($departments)) {
                throw new \Exception('No departments found for the given office ID');
            }
    
            // Extract PlanId
            $planId = $departments[0]->PlanId ?? null;
    
            // Fetch PM Year data
            $pmYear = $yrId ? DB::table('tbl_pmyear')->where('YrId', $yrId)->first() : null;
            $pmYearData = $pmYear ? (array) $pmYear : ['Name' => '', 'Description' => ''];
    
            // Fetch office data
            $office = DB::table('tbl_office')->where('OffId', $officeId)->first();
            $officeData = $office ? (array) $office : ['OfficeName' => '', 'OfficeDescription' => ''];
    
            return Inertia::render('OfficeUser', [
                'departments' => $departments,
                'pmYear' => $pmYearData ?? ['Name' => '', 'Description' => ''],
                'YrId' => $yrId ?? '',
                'PlanId' => $planId ?? '',
                'office' => $officeData ?? ['OfficeName' => '', 'OfficeDescription' => ''],
                'deptId' => $deptId , 
                'officeId' => $officeId ?? '',
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching office data: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Failed to fetch office data']);
        }
    }
    


public function employee(Request $request, int $departmentId)
{
    try {
        Log::info("🔍 Fetching employees for department ID: $departmentId");

        // Validate and cast query parameters
        $officeId = intval($request->query('officeId', 0));
        $yrId = intval($request->query('YrId', 0));

        // Call stored procedure to get employees
        $employees = DB::select('CALL GetEmployeesByDepartment(?)', [$departmentId]);

        Log::info("✅ Employees fetched from DB:", ['count' => count($employees)]);

        if (empty($employees)) {
            Log::warning("⚠️ No employees found for department ID: $departmentId");
        }

        // Convert employees data to an associative array
        $employeesArray = json_decode(json_encode($employees), true) ?? [];

        // Get first employee details safely
        $firstEmployee = $employees[0] ?? null;
        $planId = $firstEmployee?->PlanId ?? null;
        $employeeId = $firstEmployee?->employeeId ?? null;

        // Fetch PM Year data safely
        $pmYear = $yrId ? DB::table('tbl_pmyear')->where('YrId', $yrId)->first() : null;
        $pmYearData = $pmYear ? (array) $pmYear : ['Name' => '', 'Description' => ''];

        // Fetch Office details safely
        $office = $officeId ? DB::table('tbl_office')->where('OffId', $officeId)->first() : null;
        $officeData = $office ? (array) $office : ['OfficeName' => '', 'OfficeDescription' => ''];

        return Inertia::render('Usertable', [
            'employees' => $employeesArray,
            'deptId' => $departmentId,
            'officeId' => $officeId,
            'YrId' => $yrId,
            'PlanId' => $planId,
            'office' => $officeData,
            'employeeId' => $employeeId,
        ]);
    } catch (\Exception $e) {
        Log::error('❌ Error fetching employees: ' . $e->getMessage(), [
            'departmentId' => $departmentId,
            'officeId' => $officeId,
            'YrId' => $yrId
        ]);

        return redirect()->back()->withErrors(['error' => 'Failed to fetch employee data']);
    }
}

}

    


