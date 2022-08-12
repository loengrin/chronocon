<?php

namespace App\Services;

use Mail;

/**
 * Class NotificationService
 * @package App\Services
 */
class NotificationService
{
    /**
     * @param int $mapId
     * @param array $user
     */
    public function notifyAddChronomapVersion($mapId, $mapName, $commitMessage, $user)
    {
        $this->notify('Add map version to map '.$mapName.'('.$mapId.'), user '.$user->name, $commitMessage);
    }

    /**
     * @param array $data
     * @param array $user
     */
    public function notifyCreateChronomap($data, $user)
    {
        unset($data['objects']);
        $this->notify('Create map '.$data['name'].', user '.$user->name, $this->convertArrayToMessage($data));
    }

    /**
     * @param array $data
     * @param array $user
     */
    public function notifyRegister($data, $user)
    {
        unset($data['password']);
        unset($data['passwordAgain']);
        $this->notify('Register '.$data['login'], $this->convertArrayToMessage($data));
    }

    /**
     * @param string $subject
     * @param string $messageText
     */
    private function notify($subject, $messageText)
    {
        Mail::raw($messageText, function ($message) use ($subject)  {
            $message->from('noreply@chronocon.org', 'noreply@chronocon.org');
            foreach($this->getEmails() as $email) {
                $message->to($email);
            }
            $message->subject($subject);
        });
    }

    /**
     * @param array $params
     * @return string
     */
    private function convertArrayToMessage($params)
    {
        $message = '';
        foreach($params as $key=>$value){
            $message.= $key.": ".(is_array($value) ? print_r($value, true) : $value)."\n";
        }
        return $message;
    }

    /**
     * @return array
     */
    private function getEmails()
    {
        return array('pavel@chronocon.org');
    }
}
