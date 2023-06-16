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
     * @var string|null The OpenAI API key
     */
    public $openAiKey;

    /**
     * @var string|null The GPT model to be used
     */
    public $gptModel;

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
     * Defines the behaviors for the Settings model.
     *
     * @return array
     */
    protected function defineBehaviors(): array
    {
        return [
            'parser' => [
                'class' => EnvAttributeParserBehavior::class,
                'attributes' => [ 'openAiKey' ],
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
            [ [ 'openAiKey', 'gptModel' ], StringValidator::class ],
            [ [ 'gptModel' ], RangeValidator::class, 'range' => [ 'gpt-3.5-turbo', 'gpt-4' ] ]
        ];
    }
}
