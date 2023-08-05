<Modal isOpen={$isActive}>
    <div class="sidebar" slot="sidebar">
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

    {#if $redactor}
        <Footer slot="footer" bind:dropdownActive />
    {/if}
</Modal>

<script context="module">
    /* global Craft */

    import Modal from './Modal';
    import Edit from './Edit/Edit';
    import Access from './Access/Access';
    import Footer from './partials/Footer';
    import Brainstorm from './Brainstorm/Brainstorm';
    import SidebarItem from './partials/SidebarItem';
    import CustomPrompt from './CustomPrompt/CustomPrompt';
    import { answer, controller } from './partials/Generate';
    import { actions as customPrompts } from './CustomPrompt/Actions';
    import { redactor, category, isActive, isBusy, hasContent } from '../store';

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

    fetch(Craft.getActionUrl('promptly/prompts'))
        .then(res => res.json())
        .then(res => customPrompts.set(res.concat([ {
            label: 'New Prompt',
            handle: 'new',
            description: '',
            prompt: ''
        } ])));
</script>

<script>
    let dropdownActive = false;

    $: preview = $redactor
        ? $redactor.source.getCode()
        : '';

    $: if (!$isActive) {
        controller.abort();
        $answer = null;
        $isBusy = false;
        dropdownActive = false;
    }

    $: if (!$category) {
        $category = categories[0];
    }

    $: if ($redactor && $redactor.uuid) {
        $hasContent = !!$redactor.cleaner.getFlatText(preview).trim();
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
