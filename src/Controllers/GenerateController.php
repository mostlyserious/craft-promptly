<?php

namespace MostlySerious\Promptly\Controllers;

use Craft;
use Exception;
use MostlySerious\Promptly\Controllers\BaseController;
use MostlySerious\Promptly\Controllers\Traits\HasFetching;

class GenerateController extends BaseController
{
    use HasFetching;

    public function actionIndex()
    {
        $this->requireCpRequest();

        $prompt = Craft::$app->request->getBodyParam('prompt');
        $context = Craft::$app->request->getBodyParam('context');
        $keywords = Craft::$app->request->getBodyParam('keywords');
        $template = file_get_contents(dirname(__DIR__) . '/resources/system.txt');

        try {
            return $this->fetch('chat', [
                'stream' => true,
                'temperature' => 1,
                'frequency_penalty' => 0,
                'presence_penalty' => 0,
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
}
