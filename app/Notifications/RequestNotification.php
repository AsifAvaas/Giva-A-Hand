<?php

namespace App\Notifications;


use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;

class RequestNotification extends Notification
{
    use Queueable;

    protected $request;
    protected $sender;

    public function __construct($request, $sender)
    {
        $this->request = $request;
        $this->sender = $sender;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => "{$this->sender->name} has sent you a help request.",
            'request_id' => $this->request->request_id,
            'sender_id' => $this->sender->user_id,
        ];
    }


}
