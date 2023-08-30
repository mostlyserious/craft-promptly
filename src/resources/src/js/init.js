import * as store from './store';
import FieldButton from './components/FieldButton';

export default scope => {
    if (scope) {
        const els = scope.querySelectorAll('.field[data-attribute]');

        Array.from(els).forEach(el => {
            new FieldButton({
                store,
                target: el.querySelector('.input'),
                props: { el }
            });
        });
    }
};
