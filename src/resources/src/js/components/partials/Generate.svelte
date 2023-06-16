<button {disabled}
    class:disabled
    class="btn submit"
    on:click={handleRequest}>
    <slot></slot>
</button>

<script context="module">
    import { getContext } from 'svelte';
    import { writable, get } from 'svelte/store';
    import { keywords } from './GenerateWithKeywords';
    import { errors, isBusy, isDev, hasAccess } from '../../store';
    import { fetchEventSource } from '@microsoft/fetch-event-source';

    export const answer = writable('');

    export let controller = new AbortController();

    function stream(endpoint, args = {}) {
        const hasAccessValue = get(hasAccess);
        const response = writable('');
        const queue = [];
        const queueHandler = () => {
            setTimeout(() => {
                if (queue.length) {
                    response.set(queue.shift());
                    queueHandler();
                }
            }, randomNumberBetween(50, 200));
        };

        controller = new AbortController();

        if (hasAccessValue.substring(0, 5) === 'gpt-4') {
            fetchEventSource(endpoint, {
                ...args,
                signal: controller.signal,
                onmessage: message => {
                    if (message.data === '[DONE]') {
                        return;
                    }

                    queue.push(JSON.parse(message.data).choices.shift());

                    if (queue.length === 1) {
                        queueHandler();
                    }
                }
            });
        } else {
            fetch(endpoint, args)
                .then(res => res.json())
                .then(res => {
                    queue.push(res.choices.shift());

                    if (queue.length === 1) {
                        queueHandler();
                    }
                });
        }

        return response;
    }

    function randomNumberBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
</script>

<script>
    /* global Craft */

    import { active } from '../../store';

    export let prompt = null;
    export let disabled;

    const redactor = getContext('redactor');
    const preview = redactor.api('source.getCode');

    let timeout;

    async function handleRequest() {
        const data = {
            [Craft.csrfTokenName]: Craft.csrfTokenValue,
            prompt: prompt ? prompt : $active.prompt,
            context: preview,
            keywords: $keywords
        };

        if (timeout) {
            clearTimeout(timeout);
        }

        const args = {
            body: new URLSearchParams(data),
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow'
        };

        $errors = [];
        $answer = '';
        $isBusy = true;

        const unsubscribe = stream('/admin/actions/promptly/generate', args).subscribe(value => {
            if (timeout) {
                clearTimeout(timeout);
            }

            if (value.finish_reason === 'stop') {
                unsubscribe();
                controller.abort();

                $keywords = '';
                $isBusy = false;

                if (!value.message) {
                    return;
                }
            }

            if (value.message && value.message.content) {
                $answer += value.message.content;
            } else if (value.delta && value.delta.content) {
                $answer += value.delta.content;
            } else if (value.text) {
                $answer += value.text;
            }

            timeout = setTimeout(() => {
                unsubscribe();
                controller.abort();

                $keywords = '';
                $isBusy = false;
                $errors = [ 'It looks like something went wrong with the request. Please try again.' ];
            }, 30 * 1000);
        });
    }
</script>
