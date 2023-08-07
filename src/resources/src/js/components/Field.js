import snarkdown from '@bpmn-io/snarkdown';

const { Redactor } = window;

export default class Field {
    static $R = Redactor;

    static validTypes = [
        'craft\\fields\\PlainText',
        'craft\\redactor\\Field'
    ];

    static validAttributes = [
        'title'
    ];

    constructor(field) {
        this.el = field.querySelector(':where(input, textarea):not([readonly])');
        this.attribute = field.dataset.attribute;
        this.uuid = field.dataset.layoutElement;
        this.type = field.dataset.type;
        this._redactor = null;

        if (this.type === 'craft\\fields\\PlainText') {
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
            : this.el.value;
    }

    get textValue() {
        return this.redactor
            ? this.redactor.cleaner.getFlatText(this.value).trim()
            : this.value;
    }

    get isEmpty() {
        return !this.textValue;
    }

    get redactor() {
        if (this._redactor) {
            return this._redactor;
        }

        return this.el.dataset.redactorUuid && Field.$R
            ? (this._redactor = Field.$R(this.el))
            : null;
    }

    insert(value) {
        if (!value) {
            return;
        }

        if (this.redactor) {
            this.redactor.insertion.insertHtml(this._prepare(value));
        } else if (this.el) {
            this.insertAtCursor(this._prepare(value));
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

    insertAtCursor(value) {
        const { selectionStart, selectionEnd } = this.el;

        if (selectionStart || selectionStart === 0) {
            this.el.value = [
                this.el.value.substring(0, selectionStart),
                value,
                this.el.value.substring(selectionEnd, this.el.value.length)
            ].join('');
        } else {
            this.el.value += value;
        }
    }

    _prepare(value) {
        if (this.redactor) {
            value = this.redactor.cleaner.paragraphize(value);
            value = snarkdown(value);
            value = this.redactor.cleaner.input(value);
        }

        return value;
    }
}
