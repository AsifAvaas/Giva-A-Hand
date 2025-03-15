<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ProfileService;

class ProfileController extends Controller
{
    protected $profileService;

    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    public function getProfile(Request $request)
    {
        return $this->profileService->getProfile($request);
    }

    public function updateProfile(Request $request)
    {
        return $this->profileService->updateProfile($request);
    }

    public function getVolunteerProfile(Request $request)
    {
        return $this->profileService->getVolunteerProfile($request);
    }

    public function updateVolunteerProfile(Request $request)
    {
        return $this->profileService->updateVolunteerProfile($request);
    }

    public function getBloodDonorProfile(Request $request)
    {
        return $this->profileService->getBloodDonorProfile($request);
    }

    public function updateBloodDonorProfile(Request $request)
    {
        return $this->profileService->updateBloodDonorProfile($request);
    }

    public function getDoctorProfile(Request $request)
    {
        return $this->profileService->getDoctorProfile($request);
    }

    public function updateDoctorProfile(Request $request)
    {
        return $this->profileService->updateDoctorProfile($request);
    }

    public function updateAdminProfile(Request $request)
    {
        return $this->profileService->updateAdminProfile($request);
    }

    public function approveUser(Request $request, $status)
    {
        return $this->profileService->approveUser($request, $status);
    }
}
