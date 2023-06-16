{#if $answer}
    <Preview />
    <div class="promptly-answer">
        {@html snarkdown($answer)}
    </div>
{:else}
    {#if $active.id}
        <div class="options">
            {#if confirmDeletion}
                <span>Are you sure?</span>
                <button type="button" class="option" on:click={() => confirmDeletion = false}>Cancel</button>
                <button type="button" class="option delete" on:click={() => deletePrompt($active.id)}>Yes</button>
            {:else}
                <button type="button" class="option delete" on:click={() => confirmDeletion = true}>Delete</button>
            {/if}
        </div>
        <hr>
    {/if}

    {#if $active.handle !== 'new'}
        <Preview />
    {/if}

    {#if $isBusy}
        <Loading />
    {:else if $active.handle === 'new'}
        <NewPrompt />
    {:else}
        {#if $active.prompt}
            <p class="heading">
                {$active.prompt}
            </p>
        {/if}

        <Errors />
        <Generate>
            Generate
        </Generate>
    {/if}
{/if}

<script>
    /* global Craft */

    import { actions } from './Actions';
    import NewPrompt from './NewPrompt';
    import Errors from '../partials/Errors';
    import Preview from '../partials/Preview';
    import Loading from '../partials/Loading';
    import snarkdown from '@bpmn-io/snarkdown';
    import { isBusy, insertion, active } from '../../store';
    import Generate, { answer } from '../partials/Generate';

    let confirmDeletion = false;

    $: insertion.set($answer);

    function deletePrompt(id) {
        $isBusy = true;

        const args = {
            body: new URLSearchParams({ id, [Craft.csrfTokenName]: Craft.csrfTokenValue }),
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow'
        };

        fetch('/admin/actions/promptly/prompts/delete', args)
            .then(res => res.json())
            .then(res => {
                confirmDeletion = false;

                $isBusy = false;
                actions.set([ ...res, {
                    label: 'New Prompt',
                    handle: 'new',
                    description: '',
                    prompt: ''
                } ]);

                $active = $actions[0];
            });
    }
</script>

<style lang="postcss">
    hr {
        @apply my-4;
    }

    .options {
        @apply flex items-center gap-2 text-right;

        & span {
            @apply mr-auto;
        }
    }

    .option {
        @apply px-2 leading-6 bg-[#c2d1e1] rounded transition;
        @apply hover:bg-slate-600 hover:text-white;
    }

    .edit {

    }

    .delete {
        @apply hover:bg-[#d61f2b];
    }

    .heading {
        @apply font-light text-lg text-slate-500;
    }

    .promptly-answer {
        @apply px-6 py-3 text-white bg-[#22c55f] rounded;

        & :global(p) {
            @apply m-0;
        }
    }
</style>
