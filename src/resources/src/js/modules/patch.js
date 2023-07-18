export default function(Class, method, handler) {
    const original = Class.prototype[method];

    Class.prototype[method] = function(...args) {
        console.log('PATCHED:', method);
        // eslint-disable-next-line prefer-rest-params
        original.apply(this, ...args);
        handler.call(this);
    };
}
