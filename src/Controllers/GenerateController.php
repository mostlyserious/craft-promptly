<?php

namespace MostlySerious\Promptly\Controllers;

use Craft;
use MostlySerious\Promptly\Controllers\BaseController;

class GenerateController extends BaseController
{
    public function actionIndex()
    {
        $this->requireCpRequest();

        $prompt = Craft::$app->request->getBodyParam('prompt');
        $context = Craft::$app->request->getBodyParam('context');
        $keywords = Craft::$app->request->getBodyParam('keywords');
        $template = file_get_contents(dirname(__DIR__) . '/resources/system.txt');

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
    }

    protected function fetch($endpoint, $args)
    {
        header('Cache-Control: no-cache');

        $passed_args = array_merge($this->default_args, $args);

        if ($passed_args['model'] !== 'gpt-4') {
            $passed_args['stream'] = false;

            return $this->openai->$endpoint($passed_args);
        }

        header('Content-type: text/event-stream');

        return $this->openai->$endpoint($passed_args, function ($_, $data) {
            echo $data;

            ob_flush();
            flush();

            return strlen($data);
        });
    }
}
