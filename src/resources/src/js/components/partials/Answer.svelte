<div class:is-busy={$isBusy}>
    {@html format(content)}
</div>

<script>
    import { isBusy } from '../../store';
    import { getContext } from 'svelte';

    export let content;

    const redactor = getContext('redactor');

    function format(string) {
        return redactor.cleaner.paragraphize(string);
    }
</script>

<style lang="postcss">
    div {
        & :global(p:not(:first-child)) {
            @apply mt-4;
        }

        & > :global(ol) {
            @apply pl-4;

            & :global(ol) {
                @apply pl-10;
            }

            & > :global(li > ol) {
                @apply list-[lower-alpha];

                & > :global(li > ol) {
                    @apply list-[lower-roman];
                }
            }
        }
    }

    .is-busy {
        @apply pointer-events-none;
    }
</style>
