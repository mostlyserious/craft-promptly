<?php

namespace MostlySerious\Promptly\Controllers;

use craft\web\Controller;
use Orhanerday\OpenAi\OpenAi;
use MostlySerious\Promptly\Plugin;

abstract class BaseController extends Controller
{
    public $openai;

    public $default_model;

    public function init(): void
    {
        $this->default_model = Plugin::$plugin->settings->getGptModel();
        $this->openai = new OpenAi(Plugin::$plugin->settings->getOpenAiKey());

        if ($org_id = Plugin::$plugin->settings->getOrganizationId()) {
            $this->openai->setORG($org_id);
        }

        parent::init();
    }

    protected function debug($value)
    {
        file_put_contents(__DIR__ . '/debug.json', json_encode($value, 128) . PHP_EOL, FILE_APPEND);

        return $value;
    }
}
