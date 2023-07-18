<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<form class="wrapper"
    on:keydown={onKeydown}
    bind:this={form}>
    <div class="field">
        <div class="heading">
            <label for="promptly-label">
                Label
                <span class="required"></span>
            </label>
        </div>
        <input type="text"
            id="promptly-label"
            class="text fullwidth"
            bind:value={prompt.label}
            required>
    </div>

    <div class="field">
        <div class="heading">
            <label for="promptly-description">
                Description
            </label>
        </div>
        <input type="text"
            for="promptly-prompt"
            class="text fullwidth"
            bind:value={prompt.description}>
    </div>

    <div class="field">
        <div class="heading">
            <label for="promptly-prompt">
                Prompt
                <span class="required"></span>
            </label>
        </div>
        <textarea id="promptly-description"
            class="nicetext text fullwidth"
            bind:value={prompt.prompt}
            required/>
    </div>

    <div>
        <button class="btn submit" on:click={addPrompt}>Save</button>
    </div>
</form>

<script>
    /* global Craft */

    import { actions } from './Actions';
    import { isBusy, active } from '../../store';

    const prompt = {
        label: '',
        handle: '',
        description: '',
        prompt: ''
    };

    let form;

    $: setHandle(prompt);

    $: if (form) {
        form.querySelector('input').focus();
    }

    function setHandle() {
        prompt.handle = random();
    }

    function addPrompt() {
        if (!form.reportValidity()) {
            return;
        }

        const body = new URLSearchParams({
            [Craft.csrfTokenName]: Craft.csrfTokenValue,
            label: prompt.label,
            content: prompt.prompt,
            description: prompt.description
        });

        const args = {
            body,
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow'
        };

        $isBusy = true;
        fetch(Craft.getActionUrl('promptly/prompts'), args)
            .then(res => res.json())
            .then(res => {
                $isBusy = false;

                const newActions = [ res, ...$actions ];

                $actions = newActions;
                $active = $actions[0];
            });
    }

    function random(length = 7) {
        return Math.random().toString(36).substring(2, length + 2);
    }

    function onKeydown(event) {
        if (event.code === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            addPrompt();
        }
    }
</script>

<style lang="postcss">
    .wrapper {
        @apply grid gap-4;
    }

    .field {
        @apply m-0;
    }
</style>
