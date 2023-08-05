import * as store from './store';
import FieldButton from './components/FieldButton';

import.meta.glob('../{img,font,media}/**/*');

(ready => {
    if (document.readyState !== 'loading') {
        ready();
    } else {
        document.addEventListener('DOMContentLoaded', ready);
    }
})(() => {
    const els = document.querySelectorAll('#content .field[data-type]');

    Array.from(els).forEach(el => {
        new FieldButton({
            store,
            target: el.querySelector('.input'),
            props: { el }
        });
    });
});
