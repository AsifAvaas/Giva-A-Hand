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
        return response()->json($this->noticeService->createNotice($request->admin_id, $request->notice_title, $request->notice_message, $request->notice_pic));
    }

    public function updateNotice(Request $request, $noticeId)
    {
        return response()->json($this->noticeService->updateNotice($noticeId, $request->admin_id, $request->notice_title, $request->notice_message, $request->notice_pic));
    }

    public function getAllNotices()
    {
        return response()->json(['success' => true, 'data' => $this->noticeService->getAllNotices()]);
    }

    public function getNoticeById($id)
    {
        return response()->json(['success' => true, 'data' => $this->noticeService->getNoticeById($id)]);
    }

    public function addUserToNotice(Request $request)
    {
        return response()->json($this->noticeService->addUserToNotice($request->notice_id, $request->user_id));
    }
}

