<button type="button" class="button child-button"
    class:is-active={$active && $active.handle === action.handle}
    on:click={() => active.set(action)}>
    <slot></slot>
</button>

<script>
    import { active } from '../../store';

    export let action;
</script>

<style lang="postcss">
    .button {
        @apply text-left font-light px-6 py-3 bg-[#f3f7fd] rounded-md;
        @apply transition duration-100;

        &.is-active {
            @apply bg-slate-600 text-white;
        }

        &:not(.is-active):hover {
            @apply bg-brand-blue text-white;
        }
    }
</style>
