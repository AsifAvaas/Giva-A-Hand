<?php

namespace App\Notifications;


use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;

class RequestApprovedNotification extends Notification
{
    use Queueable;

    protected $request;
    protected $approver;

    public function __construct($request, $approver)
    {
        $this->request = $request;
        $this->approver = $approver;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => "{$this->approver->name} has approved your help request.",
            'request_id' => $this->request->request_id,
            'approver_id' => $this->approver->user_id,
        ];
    }


}
