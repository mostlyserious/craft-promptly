<button type="button" class="button"
    class:is-active={$category && $category.handle === action.handle}
    on:click={() => $category = action}>
    <slot></slot>
</button>

<script>
    import { category } from '../../store';

    export let action;
</script>

<style lang="postcss">
    .button {
        @apply transition duration-100;
        @apply text-left px-6 py-2 rounded;

        &.is-active {
            @apply bg-slate-600 text-white;
        }

        &:not(.is-active):hover {
            @apply bg-brand-blue text-white;
        }
    }
</style>
