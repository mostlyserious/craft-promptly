{#if $isBusy}
    <Loading />
{:else}
    <p>Please read all terms of use and accept below.</p>
    <button class="btn submit" on:click={acceptTerms}>
        Accept Terms
    </button>
{/if}

<script>
    import Loading from '../partials/Loading';
    import { isBusy, hasAccess } from '../../store';

    const { Craft } = window;

    function acceptTerms() {
        $isBusy = true;

        const args = {
            body: new URLSearchParams({ [Craft.csrfTokenName]: Craft.csrfTokenValue }),
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow'
        };

        fetch(Craft.getActionUrl('promptly/access'), args)
            .then(res => res.json())
            .then(res => {
                $isBusy = false;
                $hasAccess = res.access;
            });
    }
</script>
