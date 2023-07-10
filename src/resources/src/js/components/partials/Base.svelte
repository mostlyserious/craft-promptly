<div class="main">
    <div class="main-left">
        {#if !$screen.isLg}
            <div class="select-wrapper">
                <div class="select">
                    <select bind:value={selected}>
                        {#each options as option (option.handle)}
                            <option value={option.handle}>
                                {option.label}
                            </option>
                        {/each}
                    </select>
                </div>
            </div>
            <hr>
        {:else if label}
            <h2>{label}</h2>
        {/if}
            <svelte:component this={Actions} />
    </div>
    <div class="main-right">
        {#if $active}
            {#key $active}
                <svelte:component this={Panel} bind:prompt selection="" />
            {/key}
        {/if}
    </div>
</div>

<script>
    import { answer } from './Generate';
    import { customPrompt, categories } from '../FieldModal';
    import { errors, active, category, screen } from '../../store';

    export let label;
    export let Actions;
    export let Panel;

    const options = [ customPrompt, ...categories ];

    let prompt,
        selected;

    $: reset($active);
    $: onSelected(selected);

    if (!selected) {
        selected = $category.handle;
    }

    function reset() {
        $errors = [];
        $answer = '';
    }

    function onSelected() {
        $category = options.find(option => option.handle === selected);
    }
</script>

<style lang="postcss">
    .main {
        @apply flex;
    }

    .main-left {
        @apply grid gap-3 content-start w-[40%] shrink-0 -my-6 py-6 pr-6 min-w-36 md:min-w-64 border-solid border-r border-[#d2dbe5];
        @apply overflow-auto;
        @apply -ml-1 pl-1;
    }

    .main-right {
        @apply p-[--content-padding] grow overflow-auto;
        @apply m-[calc(var(--content-padding)*-1)] ml-0;
    }

    .select,
    select {
        @apply w-full;
    }

    hr {
        @apply my-2;
    }
</style>
