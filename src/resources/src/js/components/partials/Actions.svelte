{#each actions as action (action.handle)}
    <Button {action}>
        <p class="child-label">{action.label}</p>
        <p>{action.description}</p>
    </Button>
{/each}

<script>
    import Button from './Button';
    import { controller } from './Generate';
    import { active, isBusy } from '../../store';

    export let actions = [];

    $active = actions[0];

    $: setComponent($active);

    function setComponent() {
        if ($isBusy) {
            $isBusy = false;
            controller.abort();
        }

        if (!$active) {
            $active = actions[0];
        }
    }
</script>

<style lang="postcss">
    .child-label {
        @apply text-md md:text-lg mb-1;
    }

    p {
        @apply m-0;

        &:not(.child-label) {
            @apply max-lg:hidden;
        }
    }
</style>
