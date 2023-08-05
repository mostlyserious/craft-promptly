<div class:is-busy={$isBusy}>
    {@html format(content)}
</div>

<script>
    import { isBusy, redactor } from '../../store';

    export let content;

    function format(string) {
        return $redactor
            ? $redactor.cleaner.paragraphize(string)
            : string;
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
