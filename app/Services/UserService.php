<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class UserService
{
    public function getAllUsers()
    {
        try {
            $volunteers = DB::table('users')
                ->select(
                    'users.user_id',
                    'users.name',
                    'users.email',
                    'users.phone',
                    'users.address',
                    'users.approved',
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

            return [
                'success' => true,
                'volunteers' => $volunteers,
                'doctors' => $doctors,
                'bloodDonors' => $bloodDonors
            ];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Server Error', 'error' => $e->getMessage()];
        }
    }

    public function getVolunteers()
    {
        try {
            $volunteers = DB::table('users')
                ->select(
                    'users.user_id',
                    'users.name',
                    'users.email',
                    'users.phone',
                    'users.address',
                    DB::raw('(SELECT volunteer_id FROM volunteers WHERE volunteers.user_id = users.user_id) AS volunteer_id'),
                    DB::raw('(SELECT skills FROM volunteers WHERE volunteers.user_id = users.user_id) AS skills'),
                    DB::raw('(SELECT availability FROM volunteers WHERE volunteers.user_id = users.user_id) AS availability')
                )
                ->whereIn('users.user_id', function ($query) {
                    $query->select('user_id')->from('volunteers');
                })
                ->where('users.approved', true)
                ->get();

            return ['success' => true, 'volunteers' => $volunteers];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Server Error', 'error' => $e->getMessage()];
        }
    }

    public function getDoctors()
    {
        try {
            $doctors = DB::table('users')
                ->join('doctors', 'users.user_id', '=', 'doctors.user_id')
                ->select('users.user_id', 'users.name', 'users.email', 'users.phone', 'users.address', 'doctors.doctor_id', 'doctors.specialization', 'doctors.freeTime', 'doctors.chamber_Location')
                ->where('users.approved', true)
                ->get();

            return ['success' => true, 'doctors' => $doctors];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Server Error', 'error' => $e->getMessage()];
        }
    }

    public function getDonors()
    {
        try {
            $bloodDonors = DB::table('users')
                ->join('blood_donors', 'users.user_id', '=', 'blood_donors.user_id')
                ->select('users.user_id', 'users.name', 'users.email', 'users.phone', 'users.address', 'blood_donors.blood_donor_id', 'blood_donors.blood_group', 'blood_donors.last_donation')
                ->where('users.approved', true)
                ->get();

            return ['success' => true, 'bloodDonors' => $bloodDonors];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Server Error', 'error' => $e->getMessage()];
        }
    }
}
