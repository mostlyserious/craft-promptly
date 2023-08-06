{#if types.includes(field.type)}
    <button type="button" class="btn" on:click={onClick}>
        {@html markup(icon, { class: 'icon' })}
        <span class="tooltip">Promptly</span>
    </button>
{/if}

<script context="module">
    import Field from './Field';
    import * as store from '../store';
    import FieldModal from './FieldModal';
    import markup from '../modules/markup';
    // import { writable } from 'svelte/store';
    import icon from '../../img/icon.svg?raw';

    // const fields = writable({});

    new FieldModal({
        store, target: document.body
    });
</script>

<script>
    export let el;

    const types = [
        'craft\\fields\\PlainText',
        'craft\\redactor\\Field'
    ];

    const field = new Field(el);

    // if (types.includes(el.dataset.type)) {
    //     $fields = Object.assign($fields, { [el.dataset.layoutElement]: el });
    // }

    el.addEventListener('mouseenter', () => el.classList.add('hover'));
    el.addEventListener('mouseleave', () => el.classList.remove('hover'));

    function onClick() {
        store.field.set(field);
        store.isActive.set(true);
    }
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
