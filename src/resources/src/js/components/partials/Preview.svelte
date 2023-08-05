{#if plainText}
    <div class="wrapper"
        class:static={clientHeight <= 100}>
        <p class="label">Current Text</p>
        <div class="preview"
            style:height={clientHeight > 100 ? (expanded ? `${clientHeight}px` : '100px') : 'auto'}>
            <div class="preview-content"
                bind:clientHeight>
                {@html preview}
            </div>
        </div>
    </div>

    {#if clientHeight > 100}
        <button type="button"
            class="link"
            on:click={() => expanded = !expanded}>
            Show {expanded ? 'Less' : 'More'}
        </button>
    {/if}
{:else}
    <slot></slot>
{/if}

<script>
    import { redactor } from '../../store';

    const preview = $redactor
        ? $redactor.source.getCode()
        : '';
    const plainText = $redactor
        ? $redactor.cleaner.getFlatText(preview).trim()
        : preview;

    let expanded = false,
        clientHeight;
</script>

<style lang="postcss">
    .wrapper {
        @apply relative px-3 pt-4 border-2 rounded-lg;

        &.static {
            @apply mb-6;
        }

        & .label {
            @apply absolute left-4 top-0 px-2 pb-0.5 -translate-y-1/2 bg-white;
            @apply text-xs uppercase font-semibold tracking-wide text-slate-500;
        }
    }

    .preview {
        @apply box-content pb-4 overflow-hidden;
        @apply transition-all duration-400;
        mask-image: linear-gradient(to top, transparent 0, black 1rem, black 100%);

        & .preview-content {
            @apply prose prose-sm w-full max-w-full leading-5 min-h-0 h-max text-slate-500;

            & :global(p:last-of-type) {
                @apply mb-0;
            }
        }
    }

    .link {
        @apply block ml-auto mt-1 mb-6 text-blue-500;
    }
</style>
