<?php

namespace MostlySerious\Promptly\Controllers;

use craft\web\Controller;
use Orhanerday\OpenAi\OpenAi;
use MostlySerious\Promptly\Plugin;

abstract class BaseController extends Controller
{
    public $openai;

    public $default_model;

    public $default_args = [
        'stream' => true,
        'temperature' => 1,
        'frequency_penalty' => 0,
        'presence_penalty' => 0,
    ];

    public function init(): void
    {
        $this->default_model = Plugin::$plugin->settings->getGptModel();
        $this->openai = new OpenAi(Plugin::$plugin->settings->getOpenAiKey());

        parent::init();
    }

    protected function debug($value)
    {
        file_put_contents(__DIR__ . '/debug.json', json_encode($value, 128) . PHP_EOL, FILE_APPEND);

        return $value;
    }
}
