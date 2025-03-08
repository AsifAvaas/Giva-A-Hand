<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\NoticeService;

class NoticeController extends Controller
{
    protected $noticeService;

    public function __construct(NoticeService $noticeService)
    {
        $this->noticeService = $noticeService;
    }

    public function createNotice(Request $request)
    {
        // Validate request
        $request->validate([
            'admin_id' => 'required|integer',
            'notice_title' => 'required|string|max:255',
            'notice_message' => 'required|string',
            'notice_pic' => 'nullable|string',
        ]);

        // Call the service to create notice and send notifications
        $response = $this->noticeService->createNotice(
            $request->admin_id,
            $request->notice_title,
            $request->notice_message,
            $request->notice_pic
        );

        return response()->json($response, 201);
    }

    public function updateNotice(Request $request, $noticeId)
    {
        return response()->json($this->noticeService->updateNotice($noticeId, $request->admin_id, $request->notice_title, $request->notice_message, $request->notice_pic), 201);
    }

    public function getAllNotices()
    {
        return response()->json(['success' => true, 'data' => $this->noticeService->getAllNotices()], 201);
    }

    public function getNoticeById($id)
    {
        return response()->json(['success' => true, 'data' => $this->noticeService->getNoticeById($id)], 201);
    }

    public function addUserToNotice(Request $request)
    {
        return response()->json($this->noticeService->addUserToNotice($request->notice_id, $request->user_id), 201);
    }
}

