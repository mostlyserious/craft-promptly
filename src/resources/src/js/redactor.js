/* global Redactor */

import * as store from './store';
import markup from './modules/markup';
import icon from '../img/icon.svg?raw';

export default function redactorPlugin(Promptly) {
    if (typeof Redactor === 'undefined') {
        return setTimeout(redactorPlugin, 5);
    }

    Redactor.add('plugin', 'promptly', {
        init(app) {
            this.app = app;
        },
        start() {
            this.app.toolbar.addButton('promptly-button', {
                title: 'Promptly',
                icon: markup(icon, { style: 'height: 1em; width: 1rem;' }),
                api: 'plugin.promptly.open'
            });

            new Promptly.FieldModal({
                store,
                target: document.body,
                props: { redactor: this.app }
            });
        },
        open() {
            Promptly.isActive.set(this.app.uuid);
        }
    });
}
