<?php

namespace MostlySerious\Promptly\Records;

use craft\db\ActiveRecord;

class PromptlyAccessRecord extends ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName(): string
    {
        return '{{%promptly_access}}';
    }
}
