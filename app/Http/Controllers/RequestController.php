<?php

namespace App\Http\Controllers;

use App\Models\BloodDonor;
use App\Models\Doctor;
use App\Models\User;
use App\Models\Volunteer;
use DB;
use Illuminate\Http\Request;
use App\Notifications\RequestApprovedNotification;
use App\Notifications\RequestNotification;
use Validator;

class RequestController extends Controller
{
    public function Request(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'seeker_id' => 'required|integer',
            'helper_id' => 'required|integer',
            'helper_type' => 'required|string|in:volunteers,doctors,blood_donors',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Map helper_type to the correct model and ID field
        $helperModels = [
            'volunteers' => ['model' => Volunteer::class, 'id_column' => 'volunteer_id'],
            'doctors' => ['model' => Doctor::class, 'id_column' => 'doctor_id'],
            'blood_donors' => ['model' => BloodDonor::class, 'id_column' => 'blood_donor_id'],
        ];

        $helperType = $request->helper_type;
        $helperModel = $helperModels[$helperType]['model'];
        $idColumn = $helperModels[$helperType]['id_column'];

        // Check if helper exists in the respective table
        if (!$helperModel::where($idColumn, $request->helper_id)->exists()) {
            return response()->json(['success' => false, 'message' => 'Helper not found'], 404);
        }
        $helpRequest = \App\Models\Request::create([
            'seeker_id' => $request->seeker_id,
            'helper_id' => $request->helper_id,
            'helper_type' => $helperType,
            'message' => $request->message,
        ]);
        $helperRecord = $helperModel::where($idColumn, $request->helper_id)->first();

        if (!$helperRecord) {
            return response()->json(['success' => false, 'message' => 'Helper not found'], 404);
        }
        $helperUserId = $helperRecord->user_id;


        // Find sender (seeker)
        $sender = User::where('user_id', $request->seeker_id)->first();

        if (!$sender) {
            return response()->json(['message' => 'Seeker not found'], 404);
        }

        // Find the helper in the Users table
        $helperUser = User::where('user_id', $helperUserId)->first();

        if (!$helperUser) {
            return response()->json(['message' => 'Helper User not found'], 404);
        }

        // Send notification to the correct User
        $helperUser->notify(new RequestNotification($helpRequest, $sender));

        return response()->json([
            'success' => true,
            'message' => 'Request sent successfully',
            'data' => $helpRequest
        ], 201);
    }


    public function ApproveRequest(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'approver_id' => 'required|integer', // ID of the approver (helper)
            'request_id' => 'required|integer',  // ID of the request to approve/disapprove
            'status' => 'required|boolean', // Approval status
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Retrieve the request to approve/disapprove
        $helpRequest = DB::table('requests')->where('request_id', $request->request_id)->first();

        if (!$helpRequest) {
            return response()->json(['success' => false, 'message' => 'Request not found'], 404);
        }

        // Determine the helper type and fetch the corresponding record
        $helperModels = [
            'volunteers' => ['model' => Volunteer::class, 'id_column' => 'volunteer_id'],
            'doctors' => ['model' => Doctor::class, 'id_column' => 'doctor_id'],
            'blood_donors' => ['model' => BloodDonor::class, 'id_column' => 'blood_donor_id'],
        ];

        $helperType = $helpRequest->helper_type; // This should be stored in the `requests` table
        if (!isset($helperModels[$helperType])) {
            return response()->json(['success' => false, 'message' => 'Invalid helper type'], 400);
        }

        $helperModel = $helperModels[$helperType]['model'];
        $idColumn = $helperModels[$helperType]['id_column'];

        // Find the helper record
        $helperRecord = $helperModel::where($idColumn, $request->approver_id)->first();

        if (!$helperRecord) {
            return response()->json(['success' => false, 'message' => 'Approver not found'], 404);
        }

        // Fetch the user associated with the helper
        $approverUser = User::where('user_id', $helperRecord->user_id)->first();

        if (!$approverUser) {
            return response()->json(['success' => false, 'message' => 'Approver user not found'], 404);
        }

        // Update the status of the request (approved or disapproved)
        $update = DB::table('requests')
            ->where('request_id', $request->request_id)
            ->update([
                'status' => $request->status,
                'updated_at' => now()
            ]);

        if ($update) {
            $seeker = User::where('user_id', $helpRequest->seeker_id)->first();

            if ($seeker) {
                $seeker->notify(new RequestApprovedNotification($helpRequest, $approverUser));
            } else {
                return response()->json(['success' => false, 'message' => 'Seeker not found'], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Request status updated successfully',
                'data' => [
                    'request_id' => $request->request_id,
                    'status' => $request->status
                ]
            ], 201);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to update the request status'
        ], 500);
    }


    public function UserRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'seeker_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $userRequests = \App\Models\Request::where('seeker_id', $request->seeker_id)
            ->with(['volunteer', 'doctor', 'bloodDonor'])
            ->get();

        $userRequests = $userRequests->map(function ($request) {
            $helperData = null;

            if ($request->helper_type == 'volunteers' && $request->volunteer) {
                $helperData = $request->volunteer;
            } elseif ($request->helper_type == 'doctors' && $request->doctor) {
                $helperData = $request->doctor;
            } elseif ($request->helper_type == 'blood_donors' && $request->bloodDonor) {
                $helperData = $request->bloodDonor;
            }

            if ($helperData && isset($helperData->user_id)) {
                $user = User::select('name', 'phone', 'email', 'profile_pic')
                    ->where('user_id', $helperData->user_id)
                    ->first();
            } else {
                $user = null;
            }

            return [
                'message' => $request->message,
                'status' => $request->status,
                'helper_data' => $user,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $userRequests
        ], 201);
    }


    public function HelperRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'helper_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Get all requests for the given helper_id
        $helperRequests = \App\Models\Request::where('helper_id', $request->helper_id)->get();

        // Modify the response for each request
        $helperRequests = $helperRequests->map(function ($request) {
            // Fetch user details based on seeker_id
            $user = \App\Models\User::where('user_id', $request->seeker_id)->first();

            // If user exists, get the necessary fields
            if ($user) {
                $request->user_details = [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'profile_pic' => $user->profile_pic,
                ];
            }

            // Return the relevant data, including the request_id
            return [
                'request_id' => $request->request_id,  // Adding request_id to the response
                'status' => $request->status,
                'message' => $request->message,
                'user_details' => $request->user_details ?? null,  // If no user found, return null
            ];
        });

        // Return the modified requests data
        return response()->json([
            'success' => true,
            'data' => $helperRequests
        ], 201);
    }


}
