<Modal isOpen={$isActive}>
    <div class="sidebar" slot="sidebar">
        <div class="sidebar-inner">
            <SidebarItem action={customPrompt}>
                {customPrompt.label}
            </SidebarItem>
            <hr>
            {#each actions as action (action.handle)}
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

    <Footer slot="footer" bind:dropdownActive />
</Modal>

<script context="module">
    import Modal from './Modal';
    import Access from './Access/Access';
    import Footer from './partials/Footer';
    import categories from '../data/categories';
    import SidebarItem from './partials/SidebarItem';
    import { answer, controller } from './partials/Generate';
    import { actions as customPrompts } from './CustomPrompt/Actions';
    import { field, preview, category, isActive, isBusy, hasContent } from '../store';

    export const customPrompt = categories.filter(category => category.handle === 'custom').pop();
    export const actions = categories.filter(category => category.handle !== 'custom');

    const { Craft } = window;

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

    $: $field ? $field.value : null;

    $: $preview = $field && $isActive
        ? $field.value
        : '';

    $: if (!$isActive) {
        controller.abort();
        $answer = null;
        $isBusy = false;
        dropdownActive = false;
    }

    $: if ($isActive && !$category) {
        $category = $customPrompts.length > 1
            ? customPrompt
            : categories[1];
    }

    $: $hasContent = $field
        ? !$field.isEmpty
        : null;
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
