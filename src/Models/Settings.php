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
     * @var array|null The list of enabled fields
     */
    public $enabledFields = null;

    /**
     * Retrieves the GPT model value.
     *
     * @return string
     */
    public function getGptModel(): string
    {
        return $this->gptModel;
    }

    /**
     * Retrieves the parsed OpenAI API key from the environment.
     *
     * @return string
     */
    public function getOpenAiKey(): string
    {
        return App::parseEnv($this->openAiKey);
    }

    /**
     * Retrieves the parsed Organization ID from the environment.
     *
     * @return string
     */
    public function getOrganizationId(): string
    {
        return App::parseEnv($this->organizationId);
    }

    /**
     * Retrieves the list of enabled fields.
     *
     * @return array|null
     */
    public function getEnabledFields(): array|null
    {
        return $this->enabledFields;
    }

    /**
     * Defines the behaviors for the Settings model.
     *
     * Currently only has the parser behavior that assists with parsing environment attributes.
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
     * Provides validation rules for the Settings model.
     *
     * The rules enforce:
     * 1. `openAiKey` and `gptModel` are required.
     * 2. `openAiKey`, `gptModel`, and `organizationId` are strings.
     * 3. `gptModel` is within the specified range of acceptable values.
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
