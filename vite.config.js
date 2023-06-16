import vitepack from '@mostlyserious/vitepack';

const args = {
    base: '/dist/',
    outDir: 'src/resources/dist'
};

export default vitepack(args, config => {
    if (process.env.VITEPACK_COMMAND === 'dev') {
        config.build.rollupOptions = {
            input: 'src/resources/src/js/promptly-main.js'
        };
    } else {
        config.build.lib = {
            entry: 'src/resources/src/js/promptly-main.js',
            fileName: 'promptly',
            name: 'promptly',
            formats: [ 'iife' ]
        };
    }

    return config;
});
