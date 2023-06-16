<?php

namespace MostlySerious\Promptly;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use MostlySerious\Promptly\Vitepack;

class Assets extends AssetBundle
{
    public function init()
    {
        $this->sourcePath = '@MostlySerious/Promptly/resources/dist';
        $this->depends = [ CpAsset::class ];
        $this->js = Vitepack::entry();

        parent::init();
    }
}
