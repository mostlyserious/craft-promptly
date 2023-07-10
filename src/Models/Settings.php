<?php

namespace MostlySerious\Promptly\Models;

use craft\base\Model;
use craft\helpers\App;
use yii\validators\RangeValidator;
use craft\validators\StringValidator;
use craft\behaviors\EnvAttributeParserBehavior;

/**
 * Class Settings
 * Represents the settings for the Promptly plugin.
 *
 * @package MostlySerious\Promptly\Models
 */
class Settings extends Model
{
    /**
     * @var string The OpenAI API key
     */
    public $openAiKey = '';

    /**
     * @var string The GPT model to be used
     */
    public $gptModel = '';

    /**
     * @var string The Organization ID
     */
    public $organizationId = '';

    /**
     * Gets the GPT model.
     *
     * @return string
     */
    public function getGptModel(): string
    {
        return $this->gptModel;
    }

    /**
     * Gets the parsed OpenAI API key from the environment.
     *
     * @return string
     */
    public function getOpenAiKey(): string
    {
        return App::parseEnv($this->openAiKey);
    }

    /**
     * Gets the parsed Organization ID from the environment.
     *
     * @return string
     */
    public function getOrganizationId(): string
    {
        return App::parseEnv($this->organizationId);
    }

    /**
     * Defines the behaviors for the Settings model.
     *
     * @return array
     */
    protected function defineBehaviors(): array
    {
        return [
            'parser' => [
                'class' => EnvAttributeParserBehavior::class,
                'attributes' => [ 'openAiKey', 'organizationId' ],
            ],
        ];
    }

    /**
     * Defines the validation rules for the Settings model.
     *
     * @return array
     */
    protected function defineRules(): array
    {
        return [
            [ [ 'openAiKey', 'gptModel' ], 'required' ],
            [ [ 'openAiKey', 'gptModel', 'organizationId' ], StringValidator::class ],
            [ [ 'gptModel' ], RangeValidator::class, 'range' => [ 'gpt-3.5-turbo', 'gpt-4' ] ]
        ];
    }
}
