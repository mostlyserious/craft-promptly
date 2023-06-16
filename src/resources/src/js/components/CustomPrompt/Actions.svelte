<Actions actions={$actions} />

<script context="module">
    import { writable } from 'svelte/store';

    export const actions = writable([]);
</script>

<script>
    import Actions from '../partials/Actions';
</script>
