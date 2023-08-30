{#if $hasAccess}
    <slot></slot>
{:else if !$isBusy}
    <svelte:component this={Base} label="" {Actions} {Panel} />
{:else if !suspend}
    <div class="center">
        <Loading />
    </div>
{/if}

<script>
    import Panel from './Panel';
    import Actions from './Actions';
    import Base from '../partials/Base';
    import Loading from '../partials/Loading';
    import { isBusy, hasAccess, active } from '../../store';

    const { Craft } = window;

    let suspend = true;

    $active = true;

    setTimeout(() => suspend = false, 200);

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

<style lang="postcss">
    .center {
        @apply absolute transform inset-center w-3/4;
    }
</style>
