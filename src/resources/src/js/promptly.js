import init from './init';

import.meta.glob('../{img,font,media}/**/*');

(ready => {
    if (document.readyState !== 'loading') {
        ready();
    } else {
        document.addEventListener('DOMContentLoaded', ready);
    }
})(() => {
    const { Garnish, Neo, Craft } = window;

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
});
