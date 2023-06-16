<?php

namespace MostlySerious\Promptly\Records;

use craft\db\ActiveRecord;

class PromptlyCustomPromptRecord extends ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName(): string
    {
        return '{{%promptly_custom_prompts}}';
    }
}
