<?php

namespace MostlySerious\Promptly\Controllers;

use Craft;
use craft\elements\Asset;
use craft\helpers\Assets;
use MostlySerious\Promptly\Controllers\Traits\HasFetching;

class ImageController extends BaseController
{
    use HasFetching;

    public function actionIndex()
    {
        $this->requireCpRequest();

        $prompt = Craft::$app->request->getBodyParam('prompt');
        $size = Craft::$app->request->getBodyParam('size');

        return $this->fetch('image', [
           'prompt' => $prompt,
           'size' => $size,
           'response_format' => 'url'
        ]);
    }

    public function actionSave()
    {
        $this->requireCpRequest();

        $source = Craft::$app->request->getBodyParam('source');
        $asset = $this->asset($source);

        if (Craft::$app->elements->saveElement($asset)) {
            return $this->asJson($asset);
        } else {
            return $this->asJson([
                'error' => 'There was an issue saving your generated image.'
            ]);
        }
    }

    protected function asset($source)
    {
        $filename = strtolower(pathinfo($source, PATHINFO_FILENAME));

        $tmp_path = Craft::$app->path->tempPath . '/' . $filename;

        $ch = curl_init($source);
            $fp = fopen($tmp_path, 'wb');
            curl_setopt($ch, CURLOPT_FILE, $fp);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_exec($ch);
            curl_close($ch);
        fclose($fp);

        $folder = Craft::$app->assets->findFolder([
            'id' => 1
        ]);

        $asset = new Asset();
        $asset->tempFilePath = $tmp_path;
        $asset->filename = Assets::prepareAssetName(implode('.', [
            $filename, $this->extension($tmp_path)
        ]));
        $asset->newFolderId = $folder->id;
        $asset->volumeId = $folder->volumeId;
        $asset->avoidFilenameConflicts = true;
        $asset->setScenario(Asset::SCENARIO_CREATE);

        return $asset;
    }

    protected function extension($filepath)
    {
        switch (exif_imagetype($filepath)) {
            case IMAGETYPE_PNG:
                return 'png';
            case IMAGETYPE_JPEG:
                return 'jpg';
            case IMAGETYPE_GIF:
                return 'gif';
            case IMAGETYPE_SWF:
                return 'swf';
            case IMAGETYPE_PSD:
                return 'psd';
            case IMAGETYPE_BMP:
                return 'bmp';
            case IMAGETYPE_TIFF_II:
                return 'tiff_ii';
            case IMAGETYPE_TIFF_MM:
                return 'tiff_mm';
            case IMAGETYPE_JPC:
                return 'jpc';
            case IMAGETYPE_JP2:
                return 'jp2';
            case IMAGETYPE_JPX:
                return 'jpx';
            case IMAGETYPE_JB2:
                return 'jb2';
            case IMAGETYPE_SWC:
                return 'swc';
            case IMAGETYPE_IFF:
                return 'iff';
            case IMAGETYPE_WBMP:
                return 'wbmp';
            case IMAGETYPE_XBM:
                return 'xbm';
            case IMAGETYPE_ICO:
                return 'ico';
            case IMAGETYPE_WEBP:
                return 'webp';
        }

        return 'png';
    }
}
