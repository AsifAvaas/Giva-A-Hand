<?php

namespace App\Http\Controllers;

use App\Models\BloodDonor;
use App\Models\Doctor;
use App\Models\Volunteer;
use DB;
use Illuminate\Http\Request;
use Validator;

class RequestController extends Controller
{
    public function Request(Request $request)
    {
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

        // Create Request
        $helpRequest = \App\Models\Request::create([
            'seeker_id' => $request->seeker_id,
            'helper_id' => $request->helper_id,
            'helper_type' => $helperType,
            'message' => $request->message,
        ]);

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

        // Check if the approver_id matches the helper_id
        if ($helpRequest->helper_id != $request->approver_id) {
            return response()->json(['success' => false, 'message' => 'You are not authorized to approve or disapprove this request'], 403);
        }

        // Update the status of the request (approved or disapproved)
        $update = DB::table('requests')
            ->where('request_id', $request->request_id)
            ->update([
                'status' => $request->status,  // 'approved' or 'disapproved'
                'updated_at' => now()
            ]);

        if ($update) {
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
            ->with(['volunteer', 'doctor', 'bloodDonor']) // Eager load the relations
            ->get();
        $userRequests = $userRequests->map(function ($request) {
            if ($request->helper_type == 'volunteers' && $request->volunteer) {
                $request->helper_data = $request->volunteer; // Add volunteer data
            } elseif ($request->helper_type == 'doctors' && $request->doctor) {
                $request->helper_data = $request->doctor; // Add doctor data
            } elseif ($request->helper_type == 'blood_donors' && $request->bloodDonor) {
                $request->helper_data = $request->bloodDonor; // Add blood donor data
            } else {
                $request->helper_data = null; // No helper data found
            }

            // Remove the loaded relationships to avoid sending extra data
            unset($request->volunteer, $request->doctor, $request->bloodDonor);

            return $request;
        });

        return response()->json([
            'success' => true,
            'data' => $userRequests
        ], 200);
    }

    public function HelperRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'helper_id' => 'required|integer',

        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $helperRequests = \App\Models\Request::where('helper_id', $request->helper_id)->get();

        return response()->json([
            'success' => true,
            'data' => $helperRequests
        ], 201);
    }

}
