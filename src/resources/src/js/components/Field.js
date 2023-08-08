import markup from '../modules/markup';
import snarkdown from '@bpmn-io/snarkdown';

const { Redactor, ClassicEditor } = window;

export default class Field {
    static $R = Redactor;

    static $CK = ClassicEditor;

    static validTypes = [
        'craft\\fields\\PlainText',
        'craft\\redactor\\Field',
        'craft\\ckeditor\\Field'
    ];

    static validAttributes = [
        'title'
    ];

    constructor(field) {
        this.field = field;
        this.el = field.querySelector(':where(input, textarea):not([readonly])');
        this.attribute = field.dataset.attribute;
        this.uuid = field.dataset.layoutElement;
        this.type = field.dataset.type;
        this._redactor = null;
        this._ckeditor = null;

        if (this.type === 'craft\\fields\\PlainText') {
            this.el.style.paddingRight = '34px';
        }
    }

    get isEnabled() {
        return Field.validTypes.includes(this.type)
            || Field.validAttributes.includes(this.attribute);
    }

    get value() {
        if (this.redactor) {
            return this.redactor.source.getCode();
        }

        if (this.ckeditor) {
            return this.ckeditor.getData();
        }

        return this.el.value;
    }

    get textValue() {
        if (this.redactor) {
            return this.redactor.cleaner.getFlatText(this.value).trim();
        }

        if (this.ckeditor) {
            return this.value.trim()
                ? markup(this.value, {}, true).textContent.trim()
                : '';
        }

        return this.value;
    }

    get isEmpty() {
        return !this.textValue;
    }

    get redactor() {
        if (this._redactor) {
            return this._redactor;
        }

        if (this.type !== 'craft\\ckeditor\\Field') {
            return null;
        }

        return this.el.dataset.redactorUuid && Field.$R
            ? (this._redactor = Field.$R(this.el))
            : null;
    }

    get ckeditor() {
        if (this._ckeditor) {
            return this._ckeditor;
        }

        if (this.type !== 'craft\\ckeditor\\Field') {
            return null;
        }

        return (editor => editor && editor.ckeditorInstance
            ? (this._ckeditor = editor.ckeditorInstance)
            : null)(this.field.querySelector('.ck[contenteditable="true"]'));
    }

    insert(value) {
        if (!value) {
            return null;
        }

        if (this.redactor) {
            this.redactor.insertion.insertHtml(this._prepare(value));
        } else if (this.ckeditor) {
            const { model, data } = this.ckeditor;
            const position = model.document.selection.getFirstPosition();

            value = data.processor.toView(this._prepare(value));
            value = data.toModel(value);

            model.insertContent(value, position);
        } else if (this.el) {
            this.insertAtCursor(this._prepare(value));
        }

        return true;
    }

    append(value) {
        if (!value) {
            return null;
        }

        value = [
            this.value,
            this._prepare(value)
        ].join(`\n`);

        if (this.redactor) {
            this.redactor.insertion.set(value);
        } else if (this.ckeditor) {
            this.ckeditor.setData(value);
        } else if (this.el) {
            this.el.value = value;
        }

        return true;
    }

    prepend(value) {
        if (!value) {
            return null;
        }

        value = [
            this._prepare(value),
            this.value
        ].join(`\n`);

        if (this.redactor) {
            this.redactor.insertion.set(value);
        } else if (this.ckeditor) {
            this.ckeditor.setData(value);
        } else if (this.el) {
            this.el.value = value;
        }

        return true;
    }

    replace(value) {
        if (!value) {
            return null;
        }

        if (this.redactor) {
            this.redactor.insertion.set(this._prepare(value));
        } else if (this.ckeditor) {
            this.ckeditor.setData(this._prepare(value));
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

        if (this.ckeditor) {
            value = snarkdown(value);
        }

        return value;
    }
}
