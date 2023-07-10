<?php

namespace MostlySerious\Promptly\Controllers\Traits;

trait HasFetching
{
    protected $_headerSent;

    protected function fetch($endpoint, $args)
    {
        if (!isset($args['model']) || $args['model'] !== 'gpt-4') {
            header('Content-Type: application/json');
            isset($args['model']) && $args['stream'] = false;

            return $this->openai->$endpoint($args);
        }

        return $this->openai->$endpoint($args, function ($_, $data) {
            if (stripos($data, 'data:') === 0) {
                $this->raw($data);
            } else {
                $this->message(json_decode($data));
            }

            $this->flush();

            return strlen($data);
        });
    }

    public function event($name, $data = null)
    {
        $this->sendHeader();

        echo "event: {$name}\n";

        if ($data !== null) {
            $this->sendData($data);
        }

        echo "\n";
    }

    public function message($data)
    {
        $this->sendHeader();
        $this->sendData($data);

        echo "\n";
    }

    public function raw($data)
    {
        $this->sendHeader();

        echo $data;
        echo "\n";
    }

    public function id($id, $data = '')
    {
        $this->sendHeader();

        echo "id: {$id}\n";

        $this->sendData($data);

        echo "\n";
    }

    public function retry($time)
    {
        $this->sendHeader();

        echo "retry: {$time}\n\n";
    }

    public function flush()
    {
        $this->sendHeader();

        while (ob_get_level() > 0) {
            ob_end_flush();
        }

        flush();

        if (connection_aborted()) {
            exit();
        }
    }

    protected function sendHeader()
    {
        if (!$this->_headerSent && !headers_sent()) {
            $this->_headerSent = true;

            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
        }
    }

    protected function sendData($data)
    {
        $messages = explode("\n", json_encode($data));

        foreach ($messages as $message) {
            echo "data: {$message}\n";
        }
    }
}
