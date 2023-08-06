<input type="text"
    class="text fullwidth"
    placeholder={$hasContent ? 'Additional Keywords (optional)' : 'Keywords'}
    bind:value={$keywords}>
<Generate {active} {prompt} {disabled}>
    <slot></slot>
</Generate>

<script context="module">
    import { writable } from 'svelte/store';
    import { hasContent } from '../../store';

    export const keywords = writable('');
</script>

<script>
    import Generate from './Generate';

    export let prompt;
    export let active;
    export let disabled;
</script>

<style lang="postcss">
    input {
        @apply mb-2;
    }
</style>
