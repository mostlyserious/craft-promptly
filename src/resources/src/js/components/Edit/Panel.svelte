{#if $answer}
    <Preview />
    <div class="promptly-answer">
        <Answer content={$answer} />
    </div>
{:else}
    {#if $active.heading}
        <p class="heading">
            {$active.heading}
        </p>
    {/if}

    <Preview>
        <p>Block content is empty. Please provide content to edit first.</p>
    </Preview>
{/if}

{#if $isBusy}
    <Loading />
{:else if $hasContent}
    <Errors />
    {#if $active.options.length}
        <div class="select-wrapper">
            <div class="select">
                <select bind:value={selection}>
                    <option value="">-- Select One ---</option>
                    {#each $active.options as option (option.label)}
                        <option value={option.prompt}>
                            {option.label}
                        </option>
                    {/each}
                </select>
            </div>

            <Generate {prompt} disabled={!selection}>
                {$active.action}
            </Generate>
        </div>
    {:else}
        <Generate {prompt}>
            Generate Correction
        </Generate>
    {/if}
{/if}

<script>
    import Answer from '../partials/Answer';
    import Errors from '../partials/Errors';
    import Preview from '../partials/Preview';
    import Loading from '../partials/Loading';
    import Generate, { answer } from '../partials/Generate';
    import { isBusy, hasContent, insertion, active } from '../../store';

    export let prompt;
    export let selection;

    $: setPrompt(selection);

    $: insertion.set($answer);

    function setPrompt() {
        prompt = selection;
    }
</script>

<style lang="postcss">
    .heading {
        @apply font-light text-lg text-slate-500 lg:hidden;
    }

    .select {
        @apply grow;
    }

    .select select {
        @apply w-full;
    }

    .select-wrapper {
        @apply flex items-center gap-6 mt-4;
    }

    .promptly-answer {
        @apply mb-6 px-6 py-3 text-white bg-brand-green rounded;

        & :global(p) {
            @apply m-0;
        }
    }
</style>
