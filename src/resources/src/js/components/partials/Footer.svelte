<div class="footer">
    <div class="buttons left secondary-buttons">

    </div>
    <div class="buttons right">
        <button type="button" class="btn" on:click={() => $isActive = false}>
            Cancel
        </button>
        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
        <div class="btngroup"
            on:click|stopPropagation>
            <button type="submit"
                class="btn disabled submit"
                aria-disabled={$isBusy || !$insertion}
                class:disabled={$isBusy || !$insertion}
                on:click={sendToField($field.redactor ? 'insert' : 'replace')}>
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
                    on:click|stopPropagation={sendToField('prepend')}>
                    Prepend Results
                </button>
            </li>
            <li>
                <button type="button"
                    on:click|stopPropagation={sendToField('append')}>
                    Append Results
                </button>
            </li>
            {#if $field.redactor}
                <li>
                    <button type="button"
                        on:click|stopPropagation={sendToField('replace')}>
                        Replace with Results
                    </button>
                </li>
            {/if}
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
    import { field, isActive, isBusy, insertion } from '../../store';
</script>

<script>
    export let dropdownActive;

    function sendToField(method) {
        return event => {
            if ($field[method]($insertion)) {
                $isActive = false;
            }
        };
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
        event.clipboardData.setData('text/html', field._prepare($insertion));
        event.clipboardData.setData('text/plain', field._prepare($insertion));
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
