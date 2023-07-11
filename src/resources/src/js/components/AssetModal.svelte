<Modal bind:isOpen={$isActive}>
    <div class="sidebar" slot="sidebar">
        <div class="sidebar-inner">

            <div class="select-wrapper">
                <div class="select">
                    <select bind:value={size}>
                        <option value="1024x1024">Large</option>
                        <option value="512x512">Medium</option>
                        <option value="256x256">Small</option>
                    </select>
                </div>
            </div>

            <hr>

            <div class="field">
                <div class="heading">
                    <label for="">
                        Prompt <span class="required"></span>
                    </label>
                </div>
                <div class="autosize">
                    <textarea rows="1"
                        class="text fullwidth"
                        bind:value={prompt}
                        on:input={onInput}></textarea>
                </div>
            </div>

            {#if $isBusy}
                <Loading />
            {:else}
                <button class="btn submit"
                    {disabled}
                    class:disabled
                    on:click={handleRequest}>
                    {response.data && response.data.length ? 'Regenerate' : 'Generate'}
                </button>

                {#if response.data && response.data.length}
                    <button class="btn mt-4"
                        on:click={handleSave}>
                        Save
                    </button>
                {/if}
            {/if}

        </div>
    </div>

    {#if response.data}
        {#each response.data as image (image.url)}
            <img {...dimensions} class="promptly-image" src={image.url} alt={prompt} transition:fade>
        {/each}
    {/if}
</Modal>

<script context="module">
    import Modal from './Modal';
    import { writable } from 'svelte/store';
    import Loading from './partials/Loading';
    import { fade } from 'svelte/transition';
    import { errors, isBusy } from '../store';

    export let isActive = writable(false);
</script>

<script>
    /* global Craft */

    let dimensions = { width: undefined, height: undefined },
        size = '1024x1024',
        response = {},
        prompt = '';

    $: disabled = !prompt.trim();

    function onInput({ target: el }) {
        el.parentNode.style.height = 0;
        el.parentNode.style.height = `${el.scrollHeight | parseInt(getComputedStyle(el).borderWidth) * 2}px`;
    }

    async function handleRequest() {
        const data = {
            [Craft.csrfTokenName]: Craft.csrfTokenValue,
            prompt: prompt.trim(),
            size
        };

        const args = {
            body: new URLSearchParams(data),
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow'
        };

        $errors = [];
        response = '';
        $isBusy = true;


        fetch(Craft.getActionUrl('promptly/image'), args)
            .then(res => res.json())
            .then(res => {
                response = res;
                $isBusy = false;
                dimensions = { width: size.split('x')[0], height: size.split('x')[1] };
            });
    }

    async function handleSave() {
        const data = {
            [Craft.csrfTokenName]: Craft.csrfTokenValue,
            source: response.data.shift().url
        };

        const args = {
            body: new URLSearchParams(data),
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow'
        };

        $errors = [];
        $isBusy = true;

        fetch(Craft.getActionUrl('promptly/image/save'), args)
            .then(res => res.json())
            .then(res => {
                $isBusy = false;
                window.location = `/${Craft.cpTrigger}/assets/edit/${res.id}-${res.title.toLowerCase()}`;
            });
    }
</script>

<style lang="postcss">
    @import "tailwindcss/utilities";

    select,
    .select {
        @apply w-full;
    }

    hr {
        @apply my-2;
    }

    .autosize {
        @apply grid;

        & textarea {
            @apply col-span-full row-span-full resize-none;
        }
    }

    .field {
        @apply grid gap-1;
    }

    .field,
    .heading {
        @apply m-0;
    }

    .promptly-image {
        @apply absolute transform inset-center w-auto h-auto max-w-full max-h-[calc(100%-calc(var(--content-padding)*2))] aspect-square rounded;
    }
</style>
