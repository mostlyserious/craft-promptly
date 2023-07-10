<button {disabled}
    class:disabled
    class="btn submit"
    on:click={handleRequest}>
    <slot></slot>
</button>

<script context="module">
    /* global TextDecoderStream */

    import { getContext } from 'svelte';
    import { writable, get } from 'svelte/store';
    import { keywords } from './GenerateWithKeywords';
    import { errors, isBusy, hasAccess } from '../../store';

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
            }, randomNumberBetween(20, 200));
        };

        controller = new AbortController();

        if (hasAccessValue.substring(0, 5) === 'gpt-4') {
            fetch(endpoint, Object.assign(args, { 'Content-Type': 'text/event-stream' })).then(res => {
                const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
                const interval = setInterval(() => {
                    reader.read().then(({ value, done }) => {
                        if (!value) {
                            return;
                        }

                        value = value.split(`\n\n`).map(v => v.trim()).filter(Boolean);

                        value.forEach(value => {
                            if (value.substring(0, 5) === 'data:') {
                                let message;

                                value = value.replace(/^data:\s*/, '').trim();

                                if (done || value === '[DONE]') {
                                    console.info('DONE');

                                    clearInterval(interval);

                                    return;
                                }

                                try {
                                    message = JSON.parse(value);
                                } catch (error) {
                                    clearInterval(interval);

                                    console.warn(value);

                                    return;
                                }

                                if (message.error) {
                                    response.set(message);

                                    return;
                                }

                                queue.push(message.choices.shift());

                                if (queue.length === 1) {
                                    queueHandler();
                                }
                            }
                        });
                    });
                }, 100);
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

            if (value) {
                if (value.error) {
                    unsubscribe();
                    controller.abort();

                    $keywords = '';
                    $isBusy = false;
                    $errors = [ value.error.message ];

                    return;
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

                $isBusy = true;
                $errors = [];

                if (value.message && value.message.content) {
                    $answer += value.message.content;
                } else if (value.delta && value.delta.content) {
                    $answer += value.delta.content;
                } else if (value.text) {
                    $answer += value.text;
                }
            }

            timeout = setTimeout(() => {
                unsubscribe();
                controller.abort();

                $keywords = '';
                $isBusy = false;
                $errors = [ 'It looks like something may have gone wrong with the request. Please try again.' ];
            }, 30 * 1000);
        });
    }
</script>
