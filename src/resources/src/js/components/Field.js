import snarkdown from '@bpmn-io/snarkdown';

const { Redactor } = window;

export default class Field {
    static $R = Redactor;

    static validTypes = [
        'craft\\fields\\PlainText',
        'craft\\redactor\\Field'
    ];

    static validAttributes = [
        // 'title'
    ];

    constructor(el) {
        this.observer = new MutationObserver(this._onMutation);
        this.el = el.querySelector('input, textarea');
        this.uuid = el.dataset.layoutElement;
        this.type = el.dataset.type;
        this.attribute = el.dataset.attribute;

        if (this.type === 'craft\\redactor\\Field') {
            this.observer.observe(this.el, { attributes: true });
        } else if (this.type === 'craft\\fields\\PlainText') {
            this.el.style.paddingRight = '34px';
        }
    }

    get isEnabled() {
        return Field.validTypes.includes(this.type)
            || Field.validAttributes.includes(this.attribute);
    }

    get value() {
        return this.redactor
            ? this.redactor.source.getCode()
            : (this.el ? this.el.value : '');
    }

    get isEmpty() {
        this.redactor
            ? !!(this.redactor.cleaner.getFlatText(this.value).trim())
            : !!(this.value);
    }

    insert(value) {
        if (!value) {
            return;
        }

        if (this.redactor) {
            this.redactor.insertion.insertHtml(this._prepare(value));
        } else if (this.el) {
            // TODO: Insert at cursor.
            this.el.value = this._prepare(value);
        }

        return true;
    }

    append(value) {
        if (!value) {
            return;
        }

        value = [
            this.value,
            this._prepare(value)
        ].join(`\n`);

        if (this.redactor) {
            this.redactor.insertion.set(value);
        } else if (this.el) {
            this.el.value = value;
        }

        return true;
    }

    prepend(value) {
        if (!value) {
            return;
        }

        value = [
            this._prepare(value),
            this.value
        ].join(`\n`);

        if (this.redactor) {
            this.redactor.insertion.set(value);
        } else if (this.el) {
            this.el.value = value;
        }

        return true;
    }

    replace(value) {
        if (!value) {
            return;
        }

        if (this.redactor) {
            this.redactor.insertion.set(this._prepare(value));
        } else if (this.el) {
            this.el.value = this._prepare(value);
        }

        return true;
    }

    _prepare(value) {
        if (this.redactor) {
            value = this.redactor.cleaner.paragraphize(value);
            value = snarkdown(value);
            value = this.redactor.cleaner.input(value);
        }

        return value;
    }

    _onMutation(mutations) {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'data-redactor-uuid') {
                this.redactor = Field.$R ? Field.$R(mutation.target) : null;
                delete this.observer;
            }
        });
    }
}
