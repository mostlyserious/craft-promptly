<button type="button" class="btn" on:click={onClick}>
    {@html markup(icon)} Generate
</button>

<script context="module">
    import markup from '../modules/markup';
    import icon from '../../img/icon.svg?raw';
</script>

<script>
    import { isActive } from './AssetModal';

    function onClick() {
        $isActive = !$isActive;
    }
</script>

<style lang="postcss">
    button {
        @apply mr-[7px] bg-[#a635cf] hover:bg-[#661fe0] text-white;

        & :global(svg) {
            @apply w-[14px] h-[14px] mr-[5px] opacity-80;
        }
    }
</style>
