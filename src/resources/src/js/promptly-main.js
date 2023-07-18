/* global Redactor */

import * as store from './store';
import redactorPlugin from './redactor';
import FieldModal from './components/FieldModal';

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
});
