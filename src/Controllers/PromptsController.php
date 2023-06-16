<?php

namespace MostlySerious\Promptly\Controllers;

use Craft;
use craft\helpers\Db;
use MostlySerious\Promptly\Controllers\BaseController;
use MostlySerious\Promptly\Records\PromptlyCustomPromptRecord;

class PromptsController extends BaseController
{
    public function actionIndex()
    {
        $this->requireCpRequest();

        if (Craft::$app->request->isPost) {
            $label = Craft::$app->request->getBodyParam('label');
            $content = Craft::$app->request->getBodyParam('content');
            $description = Craft::$app->request->getBodyParam('description');

            $custom_prompt = new PromptlyCustomPromptRecord();
            $custom_prompt->userId = Craft::$app->user->identity->id;
            $custom_prompt->label = Db::prepareValueForDb($label);
            $custom_prompt->content = Db::prepareValueForDb($content);
            $custom_prompt->description = Db::prepareValueForDb($description);

            if ($custom_prompt->insert()) {
                $record = PromptlyCustomPromptRecord::find()
                    ->where(['userId' => Craft::$app->user->identity->id])
                    ->orderBy('dateCreated DESC')
                    ->one();

                return $this->asJson([
                    'id' => $record->id,
                    'label' => $record->label,
                    'handle' => $record->uid,
                    'description' => $record->description,
                    'prompt' => $record->content
                ]);
            }

            return $this->asJson([]);
        }

        return $this->asJson($this->getPrompts());
    }

    public function actionDelete()
    {
        $this->requireCpRequest();

        if (Craft::$app->request->isPost) {
            $id = Craft::$app->request->getBodyParam('id');

            $record = PromptlyCustomPromptRecord::find()
                ->where(['userId' => Craft::$app->user->identity->id])
                ->where(['id' => $id])
                ->one();

            $record->delete();

            return $this->asJson($this->getPrompts());
        }
    }

    protected function getPrompts()
    {
        $records = PromptlyCustomPromptRecord::find()
            ->where(['userId' => Craft::$app->user->identity->id])
            ->collect();

        return $records->map(function ($record) {
            return [
                'id' => $record->id,
                'label' => $record->label,
                'handle' => $record->uid,
                'description' => $record->description,
                'prompt' => $record->content
            ];
        });
    }
}
