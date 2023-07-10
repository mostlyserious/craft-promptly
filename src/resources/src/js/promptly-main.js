/* global Redactor */

import * as store from './store';
import redactorPlugin from './redactor';
import FieldModal from './components/FieldModal';
import AssetModal from './components/AssetModal';
import AssetButton from './components/AssetButton';

import.meta.glob('../{img,font,media}/**/*');

(ready => {
    if (document.readyState !== 'loading') {
        ready();
    } else {
        document.addEventListener('DOMContentLoaded', ready);
    }
})(() => {
    if (typeof Redactor !== 'undefined') {
        redactorPlugin({ FieldModal, isActive: store.isActive });
    }

    if (window.location.search.substring(0, 14) === '?source=volume') {
        const target = document.querySelector('#action-buttons');
        const anchor = target ? target.querySelector('[data-icon="upload"]') : null;

        if (target && anchor) {
            new AssetButton({ store, target, anchor });
            new AssetModal({ store, target: document.body });
        }
    }
});
