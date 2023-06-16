<?php

namespace MostlySerious\Promptly\Controllers;

use Craft;
use MostlySerious\Promptly\Controllers\BaseController;
use MostlySerious\Promptly\Records\PromptlyAccessRecord;

class AccessController extends BaseController
{
    public function actionIndex()
    {
        $this->requireCpRequest();

        if (Craft::$app->request->isPost) {
            $access = new PromptlyAccessRecord();
            $access->userId = Craft::$app->user->identity->id;

            return $this->asJson([
                'access' => $access->insert()
                    ? $this->default_model
                    : false
            ]);
        }

        $record = PromptlyAccessRecord::find()
            ->where(['userId' => Craft::$app->user->identity->id])
            ->one();

        if (!$record) {
            return $this->asJson([
                'access' => false
            ]);
        }

        return $this->asJson([
            'access' => $this->default_model
        ]);
    }
}
