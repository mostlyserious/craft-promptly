<svelte:window on:keydown={onKeydown} />

{#if $isActive === redactor.uuid}
    <div class="modal-bg garnish-js-aria"
        aria-hidden="true"
        on:click={() => $isActive = false}
        transition:fade={{ duration: 200 }}>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal elementselectormodal"
        aria-labelledby="modal-promptly-heading"
        aria-modal="true"
        role="dialog"
        in:fade={{ duration: 200, delay: 100 }}
        out:fade={{ duration: 200 }}
        on:click={() => dropdownActive = false}>
        <h1 id="modal-promptly-heading" class="visually-hidden">
            Promptly
        </h1>
        <div class="body has-sidebar">
            <div class="content"
                class:has-sidebar={$screen.isLg}>
                <div class="sidebar"
                    class:no-access={!$hasAccess}>
                    <div class="sidebar-inner">
                        <SidebarItem action={customPrompt}>
                            {customPrompt.label}
                        </SidebarItem>
                        <hr>
                        {#each categories as action (action.handle)}
                            <SidebarItem {action}>
                                {action.label}
                            </SidebarItem>
                        {/each}
                    </div>
                </div>
                {#if $category}
                    <Access>
                        <svelte:component this={$category.component} label={$category.label} />
                    </Access>
                {/if}
            </div>
        </div>
        <Footer bind:dropdownActive />
    </div>
{/if}

<script context="module">
    import Edit from './Edit/Edit';
    import { setContext } from 'svelte';
    import Access from './Access/Access';
    import Footer from './partials/Footer';
    import { fade } from 'svelte/transition';
    import Brainstorm from './Brainstorm/Brainstorm';
    import SidebarItem from './partials/SidebarItem';
    import CustomPrompt from './CustomPrompt/CustomPrompt';
    import { answer, controller } from './partials/Generate';
    import { actions as customPrompts } from './CustomPrompt/Actions';
    import { category, isActive, isBusy, hasContent, hasAccess, screen } from '../store';

    export const customPrompt = {
        label: '⚡ Custom Prompt',
        handle: 'custom',
        component: CustomPrompt
    };

    export const categories = [
        {
            label: '🧠 Brainstorm',
            handle: 'brainstorm',
            component: Brainstorm
        },
        {
            label: '✍️ Edit',
            handle: 'edit',
            component: Edit
        }
    ];
</script>

<script>
    export let redactor;

    const preview = redactor.source.getCode();

    let dropdownActive = false;

    $: if (!$isActive) {
        controller.abort();
        $answer = null;
        $isBusy = false;
        dropdownActive = false;
    }

    $: if (!$category) {
        $category = categories[0];
    }

    $hasContent = !!redactor.cleaner.getFlatText(preview).trim();

    setContext('redactor', redactor);

    fetch('/admin/actions/promptly/prompts')
        .then(res => res.json())
        .then(res => $customPrompts = res.concat([ {
            label: 'New Prompt',
            handle: 'new',
            description: '',
            prompt: ''
        } ]));

    function onKeydown(event) {
        if (event.code === 'Escape') {
            $isActive = false;
        }
    }
</script>

<style lang="postcss">
    h2 {
        @apply font-normal;
    }

    hr {
        @apply my-2;
    }

    .modal-bg {
        @apply fixed transform inset-0 z-[100] block w-full h-full;
        background-color: rgb(123 135 147 / 0.35);
    }

    .modal {
        @apply fixed transform inset-center;
        @apply w-[calc(100dvw-1.5rem)] md:w-dvw-80 h-dvh-70 max-md:min-w-0 max-w-[1150px] !important;
    }

    .body {
        @apply max-md:overflow-x-auto;
    }

    .content {
        @apply min-w-[600px];
    }

    .sidebar-inner {
        @apply grid gap-2 content-start px-3;
    }

    .no-access {
        @apply opacity-50 pointer-events-none;
    }

    .buttons {
        @apply relative;
    }
</style>
