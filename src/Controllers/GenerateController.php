<?php

namespace MostlySerious\Promptly\Controllers;

use Craft;
use Exception;
use MostlySerious\Promptly\Controllers\BaseController;

class GenerateController extends BaseController
{
    private $_headerSent;

    public function actionIndex()
    {
        $this->requireCpRequest();

        $prompt = Craft::$app->request->getBodyParam('prompt');
        $context = Craft::$app->request->getBodyParam('context');
        $keywords = Craft::$app->request->getBodyParam('keywords');
        $template = file_get_contents(dirname(__DIR__) . '/resources/system.txt');

        try {
            return $this->fetch('chat', [
                'model' => $this->default_model,
                'messages' => array_values(array_filter([
                    [
                        'role' => 'system',
                        'content' => $template
                    ],
                    trim($context) ? [
                        'role' => 'user',
                        'content' => sprintf('We are currently working on this section of text: %s', $context)
                    ] : null,
                    [
                        'role' => 'user',
                        'content' => implode(PHP_EOL, array_filter([
                            $prompt,
                            trim($keywords)
                                ? sprintf('Also account for the following keywords: %s', $keywords)
                                : null
                        ]))
                    ]
                ]))
            ]);
        } catch (Exception $e) {
            return $this->asJson($e->getMessage());
        }
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

    protected function fetch($endpoint, $args)
    {
        $passed_args = array_merge($this->default_args, $args);

        if ($passed_args['model'] !== 'gpt-4') {
            $passed_args['stream'] = false;

            return $this->openai->$endpoint($passed_args);
        }

        return $this->openai->$endpoint($passed_args, function ($_, $data) {
            if (stripos($data, 'data:') === 0) {
                $this->raw($data);
            } else {
                $this->message(json_decode($data));
            }

            $this->flush();

            return strlen($data);
        });
    }

    protected function sendData($data)
    {
        $messages = explode("\n", json_encode($data));

        foreach ($messages as $message) {
            echo "data: {$message}\n";
        }
    }

    private function sendHeader()
    {
        if (!$this->_headerSent && !headers_sent()) {
            $this->_headerSent = true;

            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
        }
    }
}
