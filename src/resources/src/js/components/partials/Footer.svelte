<div class="footer">
    <div class="buttons left secondary-buttons">

    </div>
    <div class="buttons right">
        <button type="button" class="btn" on:click={() => $isActive = false}>
            Cancel
        </button>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="btngroup"
            on:click|stopPropagation>
            <button type="submit"
                class="btn disabled submit"
                aria-disabled={$isBusy || !$insertion}
                class:disabled={$isBusy || !$insertion}
                on:click={insert}>
                <div class="label">Insert Results</div>
                <div class="spinner spinner-absolute"></div>
            </button>
            <button type="button"
                class="btn submit menubtn"
                aria-label="More actions"
                role="combobox"
                aria-controls=""
                aria-haspopup="listbox"
                aria-expanded="false"
                aria-disabled={$isBusy || !$insertion}
                class:disabled={$isBusy || !$insertion}
                on:click={() => dropdownActive = true}>
            </button>
        </div>
        <menu class="dropdown"
            class:is-active={dropdownActive}>
            <li>
                <button type="button"
                    on:click|stopPropagation={prepend}>
                    Prepend Results
                </button>
            </li>
            <li>
                <button type="button"
                    on:click|stopPropagation={append}>
                    Append Results
                </button>
            </li>
            <li>
                <button type="button"
                    on:click|stopPropagation={replace}>
                    Replace with Results
                </button>
            </li>
            <li>
                <button type="button"
                    on:click|stopPropagation={clipboard}>
                    Copy to Clipboard
                </button>
            </li>
        </menu>
    </div>
</div>

<script context="module">
    import { getContext } from 'svelte';
    import snarkdown from '@bpmn-io/snarkdown';
    import { isActive, isBusy, insertion } from '../../store';
</script>

<script>
    export let dropdownActive;

    const redactor = getContext('redactor');

    function prepare(content) {
        content = redactor.cleaner.paragraphize(content);
        content = snarkdown(content);
        content = redactor.cleaner.input(content);

        return content;
    }

    function insert() {
        if (!$insertion) {
            return;
        }

        redactor.insertion.insertHtml(prepare($insertion));
        $isActive = false;
    }

    function append() {
        if (!$insertion) {
            return;
        }

        redactor.insertion.set([
            redactor.api('source.getCode'),
            prepare($insertion)
        ].join(`\n`));
        $isActive = false;
    }

    function prepend() {
        if (!$insertion) {
            return;
        }

        redactor.insertion.set([
            prepare($insertion),
            redactor.api('source.getCode')
        ].join(`\n`));
        $isActive = false;
    }

    function replace() {
        if (!$insertion) {
            return;
        }

        redactor.insertion.set(prepare($insertion));
        $isActive = false;
    }

    function clipboard() {
        if (!$insertion) {
            return;
        }

        document.addEventListener('copy', copy);
        document.execCommand('copy');
        document.removeEventListener('copy', copy);
        $isActive = false;
    }

    function copy(event) {
        event.clipboardData.setData('text/html', prepare($insertion));
        event.clipboardData.setData('text/plain', prepare($insertion));
        event.preventDefault();
    }
</script>

<style lang="postcss">
    .dropdown {
        @apply absolute right-0 bottom-full mb-1 bg-white border rounded;
        @apply opacity-0 pointer-events-none transition;

        &.is-active {
            @apply opacity-100 pointer-events-auto;
        }

        & button {
            @apply w-full py-2 px-4 text-left;
        }
    }
</style>
