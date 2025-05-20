<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            // Get all years for filtering
            $years = DB::table('tbl_pmyear')->select('YrId', 'Name', 'Description')->get();
            $currentYear = $years->first() ? $years->first()->YrId : null;

            // Default empty data
            $stats = [
                'categoryTasks' => [
                    'computing' => 0,
                    'dataCenter' => 0,
                    'network' => 0
                ]
            ];
            
            $monthlyData = $this->getEmptyMonthlyData();
            
            // Only get actual data if we have a valid year
            if ($currentYear) {
                $stats = $this->getMaintenanceStats($currentYear);
                $monthlyData = $this->getMonthlyData($currentYear);
            }

            return Inertia::render('Dashboard', [
                'years' => $years,
                'currentYear' => $currentYear,
                'stats' => $stats,
                'monthlyData' => $monthlyData
            ]);
        } catch (\Exception $e) {
            Log::error('Error generating dashboard: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Failed to generate dashboard: ' . $e->getMessage()]);
        }
    }

    public function getDashboardData(Request $request)
    {
        try {
            $yearId = $request->input('yearId');

            if (!$yearId) {
                return response()->json([
                    'stats' => [
                        'categoryTasks' => [
                            'computing' => 0,
                            'dataCenter' => 0,
                            'network' => 0
                        ]
                    ],
                    'monthlyData' => $this->getEmptyMonthlyData()
                ]);
            }

            // Get stats for the selected year
            $stats = $this->getMaintenanceStats($yearId);
            
            // Get monthly data for charts
            $monthlyData = $this->getMonthlyData($yearId);

            return response()->json([
                'stats' => $stats,
                'monthlyData' => $monthlyData
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting dashboard data: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to get dashboard data: ' . $e->getMessage()], 500);
        }
    }

    private function getEmptyMonthlyData()
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $emptyData = [];
        
        foreach ($months as $month) {
            $emptyData[] = [
                'month' => $month,
                'computing' => 0,
                'dataCenter' => 0,
                'network' => 0
            ];
        }
        
        return $emptyData;
    }

    private function getMaintenanceStats($yearId)
    {
        try {
            // Computing Units Stats - Count from tbl_preventive_maintainance
            $computingStats = 0;
            try {
                $computingStats = DB::table('tbl_preventive_maintainance')
                    ->where('YrId', $yearId)
                    ->count();
            } catch (\Exception $e) {
                Log::error('Error counting computing stats: ' . $e->getMessage());
            }

            // Data Center Stats - Count from tbl_datacenter
            $dataCenterStats = 0;
            try {
                $dataCenterStats = DB::table('tbl_datacenter')
                    ->where('YrId', $yearId)
                    ->count();
            } catch (\Exception $e) {
                Log::error('Error counting data center stats: ' . $e->getMessage());
            }

            // Network Stats - For network, we'll count records from tbl_premainplan_details where CatId = 3
            $networkStats = 0;
            try {
                // Check if there's a network category (typically CatId = 3)
                $networkStats = DB::table('tbl_premainplan_details')
                    ->where('YrId', $yearId)
                    ->where('CatId', 3) // Assuming 3 is Network category
                    ->count();
            } catch (\Exception $e) {
                Log::error('Error counting network stats: ' . $e->getMessage());
            }

            return [
                'categoryTasks' => [
                    'computing' => $computingStats,
                    'dataCenter' => $dataCenterStats,
                    'network' => $networkStats
                ]
            ];
        } catch (\Exception $e) {
            Log::error('Error in getMaintenanceStats: ' . $e->getMessage());
            return [
                'categoryTasks' => [
                    'computing' => 0,
                    'dataCenter' => 0,
                    'network' => 0
                ]
            ];
        }
    }

    private function getMonthlyData($yearId)
    {
        try {
            $months = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
            $shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            $monthlyData = [];
            
            for ($i = 0; $i < count($months); $i++) {
                $month = $months[$i];
                $shortMonth = $shortMonths[$i];
                
                // Computing Units - Count tasks from Category 1
                $computingCount = 0;
                try {
                    $computingCount = DB::table('tbl_premainplan_details')
                        ->where('YrId', $yearId)
                        ->where('CatId', 1)
                        ->whereRaw("$month IS NOT NULL AND $month != ''")
                        ->count();
                } catch (\Exception $e) {
                    Log::error("Error counting computing tasks for $month: " . $e->getMessage());
                }
                
                // Data Center - Count tasks from Category 2
                $dataCenterCount = 0;
                try {
                    $dataCenterCount = DB::table('tbl_premainplan_details')
                        ->where('YrId', $yearId)
                        ->where('CatId', 2)
                        ->whereRaw("$month IS NOT NULL AND $month != ''")
                        ->count();
                } catch (\Exception $e) {
                    Log::error("Error counting data center tasks for $month: " . $e->getMessage());
                }
                
                // Network - Count tasks from Category 3
                $networkCount = 0;
                try {
                    $networkCount = DB::table('tbl_premainplan_details')
                        ->where('YrId', $yearId)
                        ->where('CatId', 3)
                        ->whereRaw("$month IS NOT NULL AND $month != ''")
                        ->count();
                } catch (\Exception $e) {
                    Log::error("Error counting network tasks for $month: " . $e->getMessage());
                }
                
                $monthlyData[] = [
                    'month' => $shortMonth,
                    'computing' => $computingCount,
                    'dataCenter' => $dataCenterCount,
                    'network' => $networkCount
                ];
            }
            
            return $monthlyData;
        } catch (\Exception $e) {
            Log::error('Error in getMonthlyData: ' . $e->getMessage());
            return $this->getEmptyMonthlyData();
        }
    }
}