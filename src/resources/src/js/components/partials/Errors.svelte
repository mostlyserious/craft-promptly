{#if $errors.length}
    <ul>
        {#each $errors as error}
            <li>{error}</li>
        {/each}
    </ul>
{/if}

<script>
    import { errors } from '../../store';
</script>

<style lang="postcss">
    ul {
        @apply grid gap-2 my-6;
    }

    li {
        @apply px-2 py-1 bg-[#d61f2b] text-white rounded;
    }
</style>
