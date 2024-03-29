const plugin = require('tailwindcss/plugin');
const typography = require('@tailwindcss/typography');
const { inset } = require('@mostlyserious/tailwindcss-util');
const { clamp } = require('@mostlyserious/tailwindcss-util');
const { viewport } = require('@mostlyserious/tailwindcss-util');
const { textStroke } = require('@mostlyserious/tailwindcss-util');
const { stateVariant } = require('@mostlyserious/tailwindcss-util');

module.exports = {
    content: [
        'src/**/*.{js,php,twig,svelte}'
    ].flat(),
    theme: {
        screens: {
            '2xs': '380px',
            'xs': '460px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px'
        },
        fontSize: {
            '9xl': [ '8rem', '1' ],
            '8xl': [ '6rem', '1' ],
            '7xl': [ '4.5rem', '1' ],
            '6xl': [ '3.75rem', '1' ],
            '5xl': [ '3rem', '1' ],
            '4xl': [ '2.25rem', '1.11' ],
            '3xl': [ '1.875rem', '1.2' ],
            '2xl': [ '1.5rem', '1.33' ],
            'xl': [ '1.25rem', '1.4' ],
            'lg': [ '1.125rem', '1.55' ],
            'md': [ '1rem', '1.5' ],
            'sm': [ '0.875rem', '1.43' ],
            'xs': [ '0.75rem', '1.33' ],
            '2xs': [ '0.66rem', '1.11' ]
        },
        extend: {
            colors: {
                brand: {
                    blue: '#0e85ff',
                    green: '#22c55f',
                    purple: {
                        DEFAULT: '#a635cf',
                        dark: '#661fe0'
                    }
                }
            },
            fontFamily: {

            },
            minHeight: theme => theme('height'),
            maxHeight: theme => theme('height'),
            minWidth: theme => ({ ...theme('width'), '8xl': '88rem', '9xl': '92rem' }),
            maxWidth: theme => ({ ...theme('width'), '8xl': '88rem', '9xl': '92rem' }),
            borderWidth: {
                '0.5': '0.5px',
                '3': '3px',
                '6': '6px'
            },
            transitionDelay: {
                '400': '400ms',
                '600': '600ms',
                '800': '800ms',
                '900': '900ms'
            },
            transitionDuration: {
                '400': '400ms',
                '600': '600ms',
                '800': '800ms',
                '900': '900ms'
            },
            zIndex: {
                '1': 1,
                '2': 2,
                '3': 3,
                '4': 4,
                '5': 5
            }
        }
    },
    plugins: [
        inset,
        clamp,
        viewport,
        textStroke,
        typography,
        stateVariant('active'),
        plugin(({ matchUtilities, addComponents, addUtilities, theme }) => {
            addUtilities({
                '.appearance-none': {
                    '-webkit-appearance': 'none',
                    '-moz-appearance': 'none'
                }
            });
        })
    ],
    corePlugins: {
        container: false
    }
};
