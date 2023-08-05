{#if types.includes(el.dataset.type)}
    <button type="button" class="btn">
        {@html markup(icon, {
            class: 'icon'
        })}
        <span class="tooltip">Promptly</span>
    </button>
{/if}

<script context="module">
    import { writable } from 'svelte/store';

    const fields = writable({});
</script>

<script>
    import markup from '../modules/markup';
    import icon from '../../img/icon.svg?raw';

    export let el;
    // export let attribute;

    const types = [
        'craft\\fields\\PlainText',
        'craft\\redactor\\Field'
    ];

    const observer = new MutationObserver((mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-redactor-uuid') {
                console.log(
                    mutation.target.dataset.redactorUuid,
                    mutation.target.closest('.field')
                );
            }
        });
    }));

    if (types.includes(el.dataset.type)) {
        $fields = Object.assign($fields, { [el.dataset.layoutElement]: el });
    }

    if (el.dataset.type === 'craft\\redactor\\Field') {
        const textarea = el.querySelector('textarea');

        observer.observe(textarea, { attributes: true });
    }

    el.addEventListener('mouseenter', () => el.classList.add('hover'));
    el.addEventListener('mouseleave', () => el.classList.remove('hover'));
</script>

<style lang="postcss">
    :global(#content .field:focus-within > .input) > .btn {
        @apply opacity-100;
    }

    .btn {
        @apply p-1.5 h-auto text-xs leading-none ml-auto rounded;
        @apply absolute top-1 right-1 transition;
        @apply text-white bg-[#a635cf] hover:bg-[#661fe0];
        @apply opacity-0;

        & :global(.icon) {
            @apply w-3.5 h-3.5;
        }

        & .tooltip {
            @apply px-1.5 py-1 bg-black/80 text-white rounded-[3px] opacity-0;
            @apply absolute transform right-full mr-1 inset-y-center transition;
        }

        &:hover .tooltip {
            @apply opacity-100;
        }
    }

    :global(.field.hover > .input) > .btn {
        @apply opacity-100;
    }
</style>
