{#if $hasAccess}
    <slot></slot>
{:else}
    <svelte:component this={Base} label="" {Actions} {Panel} />
{/if}

<script>
    /* global Craft */

    import Panel from './Panel';
    import Actions from './Actions';
    import Base from '../partials/Base';
    import { isBusy, hasAccess, active } from '../../store';

    $active = true;

    if (!$hasAccess) {
        $isBusy = true;
        fetch(Craft.getActionUrl('promptly/access'))
            .then(res => res.json())
            .then(res => {
                $isBusy = false;
                $hasAccess = res.access;
            });
    }

</script>
