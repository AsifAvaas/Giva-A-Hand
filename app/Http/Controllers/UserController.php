<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    
    public function getAllUsers()
    {
        try {
            $volunteers = DB::table('users')
                ->select('users.user_id', 'users.name', 'users.email', 'users.phone', 'users.address', 'users.approved',
                    DB::raw('(SELECT skills FROM volunteers WHERE volunteers.user_id = users.user_id) AS skills'),
                    DB::raw('(SELECT availability FROM volunteers WHERE volunteers.user_id = users.user_id) AS availability')
                )
                ->whereIn('users.user_id', function ($query) {
                    $query->select('user_id')->from('volunteers');
                })
                ->get();

            $doctors = DB::table('users')
                ->join('doctors', 'users.user_id', '=', 'doctors.user_id')
                ->select('users.user_id', 'users.name', 'users.email', 'users.phone', 'users.address', 'users.approved', 'doctors.specialization', 'doctors.freeTime', 'doctors.chamber_Location')
                ->get();

            $bloodDonors = DB::table('users')
                ->join('blood_donors', 'users.user_id', '=', 'blood_donors.user_id')
                ->select('users.user_id', 'users.name', 'users.email', 'users.phone', 'users.address', 'users.approved', 'blood_donors.blood_group', 'blood_donors.last_donation')
                ->get();

            return response()->json([
                'success' => true,
                'volunteers' => $volunteers,
                'doctors' => $doctors,
                'bloodDonors' => $bloodDonors
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Server Error', 'error' => $e->getMessage()], 500);
        }
    }

  
    public function getVolunteers()
    {
        try {
            $volunteers = DB::table('users')
                ->select('users.user_id', 'users.name', 'users.email', 'users.phone', 'users.address',
                    DB::raw('(SELECT skills FROM volunteers WHERE volunteers.user_id = users.user_id) AS skills'),
                    DB::raw('(SELECT availability FROM volunteers WHERE volunteers.user_id = users.user_id) AS availability')
                )
                ->whereIn('users.user_id', function ($query) {
                    $query->select('user_id')->from('volunteers');
                })
                ->where('users.approved', true)
                ->get();

            return response()->json(['success' => true, 'volunteers' => $volunteers], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    
    public function getDoctors()
    {
        try {
            $doctors = DB::table('users')
                ->join('doctors', 'users.user_id', '=', 'doctors.user_id')
                ->select('users.user_id', 'users.name', 'users.email', 'users.phone', 'users.address', 'doctors.specialization', 'doctors.freeTime', 'doctors.chamber_Location')
                ->where('users.approved', true)
                ->get();

            return response()->json(['success' => true, 'doctors' => $doctors], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    
    public function getDonors()
    {
        try {
            $bloodDonors = DB::table('users')
                ->join('blood_donors', 'users.user_id', '=', 'blood_donors.user_id')
                ->select('users.user_id', 'users.name', 'users.email', 'users.phone', 'users.address', 'blood_donors.blood_group', 'blood_donors.last_donation')
                ->where('users.approved', true)
                ->get();

            return response()->json(['success' => true, 'bloodDonors' => $bloodDonors], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Server Error', 'error' => $e->getMessage()], 500);
        }
    }
}
