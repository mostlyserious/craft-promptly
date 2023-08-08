import init from './init';
import Field from './components/Field';

import.meta.glob('../{img,font,media}/**/*');

(ready => {
    if (document.readyState !== 'loading') {
        ready();
    } else {
        document.addEventListener('DOMContentLoaded', ready);
    }
})(() => {
    const { Garnish, Neo, Craft } = window;

    fetch(Craft.getActionUrl('promptly/access/fields'))
        .then(res => res.json())
        .then(res => {
            Field.enabledFields = res;

            if (Field.enabledFields === null || Field.enabledFields.length) {
                init(document.querySelector('#content'));

                Garnish.on(Craft.MatrixInput, 'afterInit', {}, event => {
                    event.target.on('blockAdded', event => {
                        init(event.$block.get(0));
                    });
                });

                Garnish.on(Neo.Input, 'afterInit', {}, event => {
                    event.target.on('addBlock', event => {
                        init(event.block.$contentContainer.get(0));
                    });
                });
            }
        });
});
