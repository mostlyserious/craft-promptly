/* global Redactor */

// import { writable, readable } from 'svelte/store';

export default class Field {
    constructor(el) {
        this.observer = new MutationObserver(this._onMutation);
        this.el = el.querySelector('input, textarea');
        this.uuid = el.dataset.layoutElement;
        this.type = el.dataset.type;
        this.attribute = el.dataset.attribute;
        this.isEmpty;

        if (this.type === 'craft\\redactor\\Field') {
            this.observer.observe(this.el, { attributes: true });
        }
    }

    value() {
        return this.redactor
            ? this.redactor.source.getCode()
            : (this.el ? this.el.value : '');
    }

    isEmpty() {
        this.redactor && this.redactor.uuid
            ? !!(this.redactor.cleaner.getFlatText(this.redactor.source.getCode()).trim())
            : !!(this.el ? this.el.value : '');
    }

    prepare() {

    }

    insert() {

    }

    append() {

    }

    prepend() {

    }

    replace() {

    }

    _onMutation(mutations) {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'data-redactor-uuid') {
                this.redactor = Redactor(mutation.target); // eslint-disable-line new-cap
                this.observer = null;
            }
        });
    }
}
