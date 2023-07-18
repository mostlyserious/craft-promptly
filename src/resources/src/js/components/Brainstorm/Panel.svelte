{#if $answer}
    <Preview />
    {#key $answer}
        {#if multiAnswer}
            {#if !$isBusy}
                <p>Choose an option, then click "Insert Result".</p>
            {/if}

            <div class="promptly-answers" use:initAnswer>
                <Answer content={$answer} />
            </div>
        {:else}
            <div class="promptly-answer">
                <Answer content={$answer} />
            </div>
        {/if}
    {/key}
{:else}
    {#if $active.heading}
        <p class="heading">
            {$active.heading}
        </p>
    {/if}

    <Preview>
        <p class="promptly-panel">
            Block content is empty.
            {#if $active.requiresContex}
                Please provide content to submit first.
            {/if}
        </p>
    </Preview>
{/if}

{#if $isBusy}
    <Loading />
{:else if $hasContent || !$active.requiresContex}
    <Errors />
    {#if $active.options && $active.options.length}
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

            <svelte:component this={$active.action.component}
                disabled={!selection}
                {prompt}
                {$active}>
                {$active.action.label}
            </svelte:component>
        </div>
    {:else}
        <svelte:component this={$active.action.component}
            {$active}>
            {$active.action.label}
        </svelte:component>
    {/if}
{/if}


<script>
    import Errors from '../partials/Errors';
    import Answer from '../partials/Answer';
    import Preview from '../partials/Preview';
    import Loading from '../partials/Loading';
    import { answer } from '../partials/Generate';
    import { isBusy, hasContent, insertion, active } from '../../store';

    export let prompt;
    export let selection;

    $: multiAnswer = ![ 'outline', 'write' ].includes($active.handle);
    $: setPrompt(selection);

    $: if (!multiAnswer) {
        insertion.set($answer);
    }

    function setPrompt() {
        prompt = selection;
    }

    function initAnswer(el) {
        const items = el.querySelectorAll('li');

        Array.prototype.forEach.call(items, li => {
            li.setAttribute('tabindex', '0');

            li.addEventListener('click', event => {
                $insertion = event.target.innerHTML;

                Array.prototype.forEach.call(items, li => {
                    li.classList.remove('promptly-selection');
                });

                event.target.classList.add('promptly-selection');
            });
        });
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

    .promptly-answers {
        @apply mb-6;

        & :global(ol),
        & :global(ul) {
            @apply grid gap-4 p-0 m-0 list-none;
        }

        & :global(li[tabindex]) {
            @apply cursor-pointer hover:text-white hover:bg-[#0e85ff] transition;
            @apply px-6 py-3 bg-[#f3f7fd] rounded;
        }

        & :global(li[tabindex].promptly-selection) {
            @apply text-white bg-brand-green;
        }
    }
</style>
