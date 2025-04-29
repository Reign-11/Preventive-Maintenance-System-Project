<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MaintenancePlanControllerC extends Controller
{
    public function getMaintenancePlansC(Request $request)
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

    public function getYearsC()
    {
        $years = DB::table('tbl_pmyear')->select('YrId', 'Name', 'Description')->get();
        return response()->json($years);
    }

    public function saveMaintenancePlanC(Request $request)
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


    
    public function addCollegeC(Request $request)
    {
        $request->validate([
            'OfficeName'  => 'required|string|max:255',
            'ParentOffId' => 'nullable|integer|exists:tbl_office,OffId',
            'YrId'        => 'nullable|integer|exists:tbl_pmyear,YrId'
        ]);
    
        $officeName  = $request->input('OfficeName');
        $parentOffId = $request->filled('ParentOffId') ? $request->input('ParentOffId') : null;
        $yrId        = $request->filled('YrId') ? $request->input('YrId') : null;
        $catId       = 3; // Set the CatId to 2
    
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
    
    public function copy(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'oldYrId' => 'required|integer',
            'oldCatId' => 'required|integer',
            'newYrId' => 'required|integer',
        ]);

        try {
            // Call the stored procedure
            DB::statement('CALL DuplicatePremainPlanDetails(?, ?, ?)', [
                $validated['oldYrId'],
                $validated['oldCatId'],
                $validated['newYrId']
            ]);

            return response()->json([
                'message' => 'Premain plan details duplicated successfully!'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to duplicate premain plan details.',
                'details' => $e->getMessage()
            ], 500);
        }
    }


    public function detaches($id)
    {
        DB::table('tbl_premainplan_details')
            ->where('PlanId', $id)
            ->update(['detached' => 0]); 
        return response()->json(['message' => 'Plan detached successfully']);
    }



    public function getOfficeC()
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
    
    public function prev(Request $request, int $officeId)
    {
        try {
            $yrId = $request->query('YrId');  
            $deptId = $request->query('departmentId'); 
            $PlanId  = $request->query('PlanId'); 
            $categoryId = $request->query('CatId', 3); 


            Log::info('Yrd Data:', ['data' => $yrId]);
    
            // Fetch office data (which contains the correct PlanId)
            $office = DB::table('tbl_office')->where('OffId', $officeId)->first();
            Log::info('Office Data:', ['data' => $office]);
    
            // Fetch departments using the stored procedure
            $departmentData = DB::select("CALL GetDepartmentsByOffice2(?)", [$officeId]); 
            Log::info("📢 Raw departments Data Before Filtering:", $departmentData  );

            // Filter departments based on PlanId, YrId, and OfficeId

            $departments = array_filter($departmentData, function ($dept) use ($PlanId, $yrId, $officeId,$categoryId) {
                return $dept->PlanId == $PlanId && $dept->YrId == $yrId && $dept->OffId == $officeId  &&  ($dept->CatId == $categoryId || is_null($dept->CatId));
            });
    
            // Re-index to ensure departments is a clean array (not an object)
            $departments = array_values($departments);
    

    
            // Fetch PM Year data if YrId is provided
            $pmYear = $yrId ? DB::table('tbl_pmyear')->where('YrId', $yrId)->first() : null;
            $pmYearData = $pmYear ? (array) $pmYear : ['Name' => '', 'Description' => ''];
    
            // Return to Inertia with the required data
            return Inertia::render('Prevoffice', [
                'departments' => $departments,  
                'pmYear' => $pmYearData,
                'YrId' => $yrId ?? '',
                'PlanId' => $PlanId ?? '', 
                'office' => $office ?? [],
                'deptId' => $deptId ?? '', 
                'officeId' => $officeId ?? '',
                'categoryId' => $categoryId ?? 3,  

            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching office data: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Failed to fetch office data']);
        }
    }

    public function checklistC(Request $request)
    {
        $validated = $request->validate([
            'Offid' => 'nullable|integer',
            'deptId' => 'nullable|integer',
            'YrId' => 'nullable|integer',
            'equipmentnumber' => 'nullable|string|max:255',
            'date_acquired' => 'nullable|date',
            'router_status' => 'nullable|integer',
            'switch_status' => 'nullable|integer',
            'access_point_status' => 'nullable|integer',
            'modem_status' => 'nullable|integer',
            'network_cable_status' => 'nullable|integer',
            'patch_panel' => 'nullable|integer',
            'other_equipment' => 'nullable|string|max:255',
            'networking_monitoring_tool_status' => 'nullable|integer',
            'firewall_status' => 'nullable|integer',
            'vpn_client_status' => 'nullable|integer',
            'network_config_tool_status' => 'nullable|integer',
            'manageable_software_status' => 'nullable|integer',
            'anti_virus_status' => 'nullable|integer',
            'other_software' => 'nullable|string|max:255',
            'access_point_details' => 'nullable|string|max:255',
            'modem_details' => 'nullable|string|max:255',
            'number_ports' => 'nullable|string|max:255',
            'ip_details' => 'nullable|string|max:255',
            'mac_details' => 'nullable|string|max:255',
            'dns_details' => 'nullable|string|max:25',
            'wifi_name' => 'nullable|string|max:25',
            'password_details' => 'nullable|string|max:255',
            'vlan_details' => 'nullable|string',
            'wifiband_details' => 'nullable|string|max:25',
            'dhcp_details' => 'nullable|string|max:255',
            'gateway_details' => 'nullable|string|max:255',
            'ipv4_details' => 'nullable|string|max:255',
            'ipv6_details' => 'nullable|string|max:25',
        ]);

        DB::statement('CALL InsertPremainPlanSetC(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            $validated['Offid'],
            $validated['deptId'],
            $validated['YrId'],
            $validated['equipmentnumber'],
            $validated['date_acquired'],
            $validated['router_status'],
            $validated['switch_status'],
            $validated['access_point_status'],
            $validated['modem_status'],
            $validated['network_cable_status'],
            $validated['patch_panel'],
            $validated['other_equipment'],
            $validated['networking_monitoring_tool_status'],
            $validated['firewall_status'],
            $validated['vpn_client_status'],
            $validated['network_config_tool_status'],
            $validated['manageable_software_status'],
            $validated['anti_virus_status'],
            $validated['other_software'],
            $validated['access_point_details'],
            $validated['modem_details'],
            $validated['number_ports'],
            $validated['ip_details'],
            $validated['mac_details'],
            $validated['dns_details'],
            $validated['wifi_name'],
            $validated['password_details'],
            $validated['vlan_details'],
            $validated['wifiband_details'],
            $validated['dhcp_details'],
            $validated['gateway_details'],
            $validated['ipv4_details'],
            $validated['ipv6_details'],
        ]);

        return response()->json(['message' => 'Record inserted successfully.']);
    }

    public function network(Request $request, int $departmentId )
    {
    try {
        // Use route parameter directly
        $yrId = $request->query('YrId');  
        $PlanId  = $request->query('PlanId'); 
        $officeId  = $request->query('officeId'); 
        $categoryId = $request->query('CatId', 3); 
    
    
    
        $network = DB::select('CALL GetNetworkRouterData(?)', [$departmentId]);
    
        $networks = array_filter($network, function ($net) use ($yrId, $officeId, $departmentId,$PlanId) {
            return $net-> YrId == $yrId        
            && $net-> PlanId == $PlanId
            && $net-> Offid == $officeId
            && $net-> deptId == $departmentId;
    
        });
    
    
        $networks = array_values ($networks);
    
        $pmYearData = DB::table('tbl_pmyear')->get();
    
    
        return Inertia::render('Networkdata', [
            'departments' => $networks,
            'YrId' => $yrId ?? '',
            'PlanId' => $PlanId ?? '',
            'officeId' => $officeId ?? '',
            'CatId' => $categoryId ?? 3,
            'pmYearList' => $pmYearData, 
            'pmYear' => $pmYearData->first() ? (array) $pmYearData->first() : ['Name' => '', 'Description' => ''],
    
        ]);
    
    } catch (\Exception $e) {
        Log::error("❌ Error fetching department:", ['error' => $e->getMessage()]);
        return redirect()->back()->withErrors(['error' => 'Failed to fetch department data']);
    }
    }

}