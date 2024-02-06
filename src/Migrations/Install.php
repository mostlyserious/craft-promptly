<?php

namespace MostlySerious\Promptly\Migrations;

use craft\db\Migration;
use MostlySerious\Promptly\Records\PromptlyAccessRecord;
use MostlySerious\Promptly\Records\PromptlyCustomPromptRecord;

class Install extends Migration
{
    public static function ensure()
    {
        return (new static())->safeUp();
    }
    /**
     * @inheritdoc
     */
    public function safeUp(): bool
    {
        if (!$this->db->tableExists(PromptlyAccessRecord::tableName())) {
            $this->createTable(PromptlyAccessRecord::tableName(), [
                'id' => $this->primaryKey(),
                'userId' => $this->integer()->notNull(),
                'dateCreated' => $this->dateTime()->notNull(),
                'uid' => $this->uid(),
            ]);

            $this->addForeignKey(
                $this->db->getForeignKeyName(PromptlyAccessRecord::tableName(), 'userId'),
                PromptlyAccessRecord::tableName(),
                'userId',
                '{{%users}}',
                'id',
                'CASCADE',
                'CASCADE'
            );
        }

        if (!$this->db->tableExists(PromptlyCustomPromptRecord::tableName())) {
            $this->createTable(PromptlyCustomPromptRecord::tableName(), [
                'id' => $this->primaryKey(),
                'userId' => $this->integer()->notNull(),
                'label' => $this->string(32)->notNull(),
                'content' => $this->text()->notNull(),
                'description' => $this->string(255)->defaultValue(''),
                'dateCreated' => $this->dateTime()->notNull(),
                'dateUpdated' => $this->dateTime()->notNull(),
                'uid' => $this->uid(),
            ]);

            $this->addForeignKey(
                $this->db->getForeignKeyName(PromptlyCustomPromptRecord::tableName(), 'userId'),
                PromptlyCustomPromptRecord::tableName(),
                'userId',
                '{{%users}}',
                'id',
                'CASCADE',
                'CASCADE'
            );
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public function safeDown(): bool
    {
        $this->dropTableIfExists(PromptlyAccessRecord::tableName());
        $this->dropTableIfExists(PromptlyCustomPromptRecord::tableName());

        return true;
    }
}
