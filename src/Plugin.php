<?php

namespace MostlySerious\Promptly;

use Craft;
use yii\base\Event;
use craft\base\Model;
use craft\services\Plugins;
use craft\helpers\UrlHelper;
use craft\events\PluginEvent;
use craft\base\Plugin as BasePlugin;
use MostlySerious\Promptly\Models\Settings;

/**
 * Class Plugin
 *
 * Main plugin class.
 *
 * @package MostlySerious\Promptly
 */
class Plugin extends BasePlugin
{
    /**
     * @var Plugin|null Instance of this plugin.
     */
    public static ?Plugin $plugin = null;

    /**
     * @var string Schema version of the plugin.
     */
    public string $schemaVersion = '1.0.0';

    /**
     * @var bool Defines if the plugin has control panel settings.
     */
    public bool $hasCpSettings = true;

    /**
     * Initialize the plugin.
     */
    public function init()
    {
        parent::init();
        self::$plugin = $this;

        if (Craft::$app->getRequest()->getIsConsoleRequest()) {
            $this->controllerNamespace = 'MostlySerious\\Promptly\\Console\\Controllers';
        } else {
            $this->controllerNamespace = 'MostlySerious\\Promptly\\Controllers';
        }

        Event::on(Plugins::class, Plugins::EVENT_AFTER_INSTALL_PLUGIN, [
            $this, 'afterInstallPlugin'
        ]);

        Craft::$app->onInit(function () {
            if ($this->getSettings()->openAiKey && Craft::$app->user->identity) {
                $this->initAssets();
            }
        });
    }

    /**
     * After install plugin handler.
     *
     * @param PluginEvent $event The plugin event.
     */
    public function afterInstallPlugin(PluginEvent $event)
    {
        $isCpRequest = Craft::$app->getRequest()->isCpRequest;

        // Redirect to plugin settings page if this plugin is installed
        if ($event->plugin === $this && $isCpRequest) {
            Craft::$app->controller->redirect(UrlHelper::cpUrl('settings/plugins/promptly'))->send();
        }
    }

    /**
     * Get plugin settings, applying config file overrides.
     *
     * @return Model|null The plugin settings.
     */
    public function getSettings(): ?Model
    {
        $settings = parent::getSettings();
        $config = Craft::$app->config->getConfigFromFile('promptly');

        // Apply config file overrides to settings
        foreach ($settings as $settingName => $settingValue) {
            $settingValueOverride = null;
            foreach ($config as $configName => $configValue) {
                if ($configName === $settingName) {
                    $settingValueOverride = $configValue;
                }
            }
            $settings->$settingName = $settingValueOverride ?? $settingValue;
        }

        return $settings;
    }

    /**
     * Initialize plugin assets.
     */
    protected function initAssets()
    {
        if (Craft::$app->request->getIsCpRequest()) {
            $view = Craft::$app->getView();

            if (Vitepack::isDev()) {
                foreach (Vitepack::entry() as $entry) {
                    $view->registerJsFile($entry, [
                        'type' => 'module',
                        'crossorigin' => true
                    ]);
                }
            } else {
                $view->registerAssetBundle(Assets::class);
            }
        }
    }

    /**
     * Create the settings model.
     *
     * @return Model|null The settings model.
     */
    protected function createSettingsModel(): ?Model
    {
        return new Settings();
    }

    /**
     * Render the settings HTML.
     *
     * @return string|null The settings HTML.
     */
    protected function settingsHtml(): ?string
    {
        return Craft::$app->view->renderTemplate('promptly/_settings', [
            'settings' => $this->getSettings()
        ]);
    }
}
