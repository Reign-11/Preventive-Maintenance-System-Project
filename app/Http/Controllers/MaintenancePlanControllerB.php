<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MaintenancePlanControllerB extends Controller
{
    public function getMaintenancePlansB(Request $request)
    {
        $YrId = $request->query('YrId');
        $CatId = $request->query('CatId', 2); 

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

    public function getYearsB()
    {
        $years = DB::table('tbl_pmyear')->select('YrId', 'Name', 'Description')->get();
        return response()->json($years);
    }

    public function saveMaintenancePlanB(Request $request)
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


    
    public function addCollegeB(Request $request)
    {
        $request->validate([
            'OfficeName'  => 'required|string|max:255',
            'ParentOffId' => 'nullable|integer|exists:tbl_office,OffId',
            'YrId'        => 'nullable|integer|exists:tbl_pmyear,YrId'
        ]);
    
        $officeName  = $request->input('OfficeName');
        $parentOffId = $request->filled('ParentOffId') ? $request->input('ParentOffId') : null;
        $yrId        = $request->filled('YrId') ? $request->input('YrId') : null;
        $catId       = 2; // Set the CatId to 2
    
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
            $result = DB::select("CALL AddOffice(?, ?, ?, ?)", [$officeName, $parentOffId, $yrId,$catId]);
    
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
    

    public function destroyB($id)
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

    public function getOfficeB()
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
}