<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;




class MaintenancePlanController extends Controller

    {
      public function getMaintenancePlans(Request $request)
      {
          $YrId = $request->query('YrId');
          $CatId = $request->query('CatId',1); // Allow NULL if not provided
      
          if (empty($YrId)) {
              return response()->json(['error' => 'YrId is required'], 400);
          }
      
          try {
              // Ensure values are integers or NULL
              $YrId = intval($YrId);
              $CatId = isset($CatId) ? intval($CatId) : null; // Convert to NULL if not set
      
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

        // Fetch the last valid PrevId from tbl_premainplan
        $prevPlan = DB::table('tbl_premainplan')->latest('PrevId')->first();
        $PrevId = $prevPlan ? $prevPlan->PrevId : 0; // Ensure it exists in tbl_premainplan

        Log::info("Validated data with PrevId:", array_merge($data, ['PrevId' => $PrevId]));

        DB::statement("CALL ValidateAndManagePlanDetails(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            $data['PlanId'] ?? null,
            $data['YrId'],
            $data['OffId'],
            $data['CatId'],
            $PrevId,  // Now correctly fetched from tbl_premainplan
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
        // ✅ Check if the office already exists for the year
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

        // ✅ Call the stored procedure
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



public function getOffice()
{
    $offices = DB::select('CALL SelectOffice()'); // Call the stored procedure
    return response()->json($offices);
}
    }