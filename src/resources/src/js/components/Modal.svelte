<svelte:window on:keydown={onKeydown} />

{#if isOpen}
    <div class="modal-bg"
        aria-hidden="true"
        on:click={() => isOpen = false}
        transition:fade={{ duration: 200 }}>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
    <div class="modal"
        aria-labelledby="modal-promptly-heading"
        aria-modal="true"
        role="dialog"
        class:has-footer={$$slots.footer}
        in:fade={{ duration: 200, delay: 100 }}
        out:fade={{ duration: 200 }}>
        <h2 id="modal-promptly-heading" class="visually-hidden">
            Promptly
        </h2>
        <div class="body" class:has-sidebar={$$slots.sidebar && $screen.isLg}>
            <div class="element-index content" class:has-sidebar={$$slots.sidebar && $screen.isLg}>
                <slot name="sidebar" />
                <slot />
            </div>
        </div>
        <slot name="footer" />
    </div>
{/if}

<script context="module">
    import { fade } from 'svelte/transition';
</script>

<script>
    import { screen, isActive } from '../store';

    export let isOpen;

    $: if (!isOpen) {
        $isActive = false;
    }

    function onKeydown(event) {
        if (event.code === 'Escape') {
            isOpen = false;
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
        --content-padding: 24px;
        -webkit-user-select: none;
        user-select: none;

        &.has-footer {
            padding-bottom: 50px;
        }
    }

    .body {
        @apply max-md:overflow-x-auto;
        @apply relative h-full min-w-[600px];
        @apply overflow-hidden p-[--content-padding];
    }

    .content {
        @apply min-w-[600px];
        @apply my-[calc(var(--content-padding)*-1)];
        @apply h-[calc(100%+calc(var(--content-padding)*2))];
    }

    .modal :global(.sidebar) {
        @apply ml-[-249px] h-full;
        @apply absolute left-0;
    }

    .modal :global(.sidebar-inner) {
        @apply grid gap-2 content-start px-3 min-h-full;
    }

    .modal :global(.main) {
        @apply relative h-full m-[-24px] overflow-auto p-[--content-padding];
    }

    .modal :global(.required) {
        @apply inline-block m-0 -translate-y-1 -translate-x-1.5;
    }

    .no-access {
        @apply opacity-50 pointer-events-none;
    }

    .buttons {
        @apply relative;
    }
</style>
