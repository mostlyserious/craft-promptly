<Actions {actions} />

<script>
    import Actions from '../partials/Actions';

    const actions = [
        {
            label: 'Correct Spelling & Grammar',
            handle: 'spellingGrammar',
            description: 'Ensure clean writing by checking and correcting spelling and grammar.',
            prompt: 'Return this content, and only this content, with all spelling, punctuation, capitalization, and grammer mistakes corrected.',
            heading: 'Ensure clean writing by checking and correcting spelling and grammar.',
            options: []
        },
        {
            label: 'Adjust Length',
            handle: 'length',
            description: 'Customize the length of your writing to suit your needs.',
            prompt: '',
            heading: 'Customize the length of your writing to suit your needs.',
            action: 'Adjust',
            options: [
                { label: 'Shorter', prompt: 'Please make this content shorter while retaining the same overall meaning.' },
                { label: 'Longer', prompt: 'Please expand on this content to make it longer while retaining the same overall meaning.' }
            ]
        },
        {
            label: 'Translate Language',
            handle: 'translate',
            description: 'Convert your content into 14 different languages.',
            prompt: '',
            heading: 'Convert your content into 14 different languages.',
            action: 'Translate',
            options: [
                { label: 'English', prompt: 'Translate this content into English.' },
                { label: 'Korean', prompt: 'Translate this content into Korean.' },
                { label: 'Chinese', prompt: 'Translate this content into Chinese.' },
                { label: 'Japanese', prompt: 'Translate this content into Japanese.' },
                { label: 'Spanish', prompt: 'Translate this content into Spanish.' },
                { label: 'Russian', prompt: 'Translate this content into Russian.' },
                { label: 'French', prompt: 'Translate this content into French.' },
                { label: 'Portuguese', prompt: 'Translate this content into Portuguese.' },
                { label: 'German', prompt: 'Translate this content into German.' },
                { label: 'Italian', prompt: 'Translate this content into Italian.' },
                { label: 'Dutch', prompt: 'Translate this content into Dutch.' },
                { label: 'Indonesian', prompt: 'Translate this content into Indonesian.' },
                { label: 'Filipino', prompt: 'Translate this content into Filipino.' },
                { label: 'Vietnamese', prompt: 'Translate this content into Vietnamese.' }
            ]
        },
        {
            label: 'Change Tone',
            handle: 'tone',
            description: 'Alter your writing style with 11 different tone options.',
            prompt: '',
            heading: 'Alter your writing style with 11 different tone options.',
            action: 'Change',
            options: [
                { label: 'Formal', prompt: 'Please rewrite this content to employ a formal tone suitable for a brand\'s voice, characterized by proper grammar, absence of contractions, and a respectful, polite manner.' },
                { label: 'Informal', prompt: 'Please rewrite this content to adopt an informal tone suitable for a brand\'s voice, exhibiting a more casual, conversational style that employs contractions and colloquial expressions.' },
                { label: 'Persuasive', prompt: 'Please rewrite this content to incorporate a persuasive tone suitable for a brand\'s voice, aiming to convince or influence the reader by integrating strong arguments, factual information, and emotional appeals.' },
                { label: 'Friendly', prompt: 'Please rewrite this content to imbue a friendly tone suitable for a brand\'s voice. It should be warm, welcoming, use positive language, and have a conversational style, without resorting to overly casual or personal introductions.' },
                { label: 'Authoritative', prompt: 'Please rewrite this content to reflect an authoritative tone suitable for a brand\'s voice, conveying a sense of expertise and confidence through clear, concise language and factual information.' },
                { label: 'Humorous', prompt: 'Please rewrite this content to adopt a humorous tone suitable for a brand\'s voice, aiming to entertain and amuse the reader through the use of wordplay, puns, and jokes.' },
                { label: 'Inspirational', prompt: 'Please rewrite this content to express an inspirational tone suitable for a brand\'s voice, aiming to motivate and uplift the reader by incorporating vivid imagery, anecdotes, and emotive language.' },
                { label: 'Empathetic', prompt: 'Please rewrite this content to reflect an empathetic tone suitable for a brand\'s voice, aiming to create a sense of understanding, compassion, and solidarity with the reader.' },
                { label: 'Engaging', prompt: 'Please rewrite this content to incorporate an engaging tone suitable for a brand\'s voice, seeking to captivate the reader\'s attention and encourage their active involvement.' },
                { label: 'Witty', prompt: 'Please rewrite this content to adopt a witty tone suitable for a brand\'s voice, aiming to entertain the reader through clever humor and quick thinking.' },
                { label: 'Direct', prompt: 'Please rewrite this content to express a direct tone suitable for a brand\'s voice, focusing on clear, straightforward, and concise language.' }
            ]
        }
    ];
</script>
