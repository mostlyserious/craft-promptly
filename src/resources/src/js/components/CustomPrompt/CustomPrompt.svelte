<svelte:component this={Base} {label} {Actions} {Panel} />

<script>
    import Panel from './Panel';
    import Actions from './Actions';
    import Base from '../partials/Base';

    export let label;
</script>
