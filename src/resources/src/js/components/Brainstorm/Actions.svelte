<Actions {actions} />

<script>
    import Actions from '../partials/Actions';
    import Generate from '../partials/Generate';
    import GenerateWithKeywords from '../partials/GenerateWithKeywords';

    const actions = [
        {
            label: 'Topics',
            handle: 'topics',
            description: 'Discover unique ideas for page, blog, and article content.',
            prompt: 'Generate a list of 3 interesting and engaging blog post topics based on the given context. Response should be formatted as follows: <ul>{{EACH}}<li>{TOPIC}</li>{{END_EACH}}</ul>.',
            heading: 'Discover unique ideas for page, blog, and article content.',
            requiresContex: false,
            action: {
                component: GenerateWithKeywords,
                label: 'Generate Topics'
            }
        },
        {
            label: 'Openers',
            handle: 'openers',
            description: 'Begin your writing with an intriguing opening paragraph.',
            prompt: 'Write 3 compelling opening paragraphs for a blog post based on the given context. Each opening paragraph should be unique and provide a different perspective on the topic. Response should be formatted as follows: <ul>{{EACH}}<li>{PARAGRAPH}</li>{{END_EACH}}</ul>.',
            heading: 'Begin your writing with an intriguing opening paragraph.',
            requiresContex: false,
            action: {
                component: GenerateWithKeywords,
                label: 'Generate Openers'
            }
        },
        {
            label: 'Headlines',
            handle: 'headlines',
            description: 'Create headline options and choose which best suits your content.',
            prompt: 'Create a list of 5 engaging section headings for a blog post based on the given context. The headings should be concise and informative, capturing the reader\'s attention. Response should be formatted as follows: <ul>{{EACH}}<li>{HEADING}</li>{{END_EACH}}</ul>.',
            heading: 'Create headline options and choose which best suits your content.',
            requiresContex: false,
            action: {
                component: GenerateWithKeywords,
                label: 'Generate Headlines'
            }
        },
        {
            label: 'Outline',
            handle: 'outline',
            description: 'Develop a clear content outline for your blog post or page.',
            prompt: 'Create a outline of the given context. Preserve links only. Response should be formatted as follows: <ol>{{EACH}}<li>{TEXT}{{RECURSION}}</li>{{END_EACH}}</ol>.',
            heading: 'Develop a clear content outline for your blog post or page.',
            requiresContex: true,
            action: {
                component: Generate,
                label: 'Generate Outline'
            }
        },
        {
            label: 'Write',
            handle: 'write',
            description: 'Expand your content or summarize it succinctly.',
            prompt: '',
            heading: 'Expand your content or summarize it succinctly.',
            requiresContex: true,
            action: {
                component: Generate,
                label: 'Generate'
            },
            options: [
                {
                    label: 'Write a little',
                    prompt: 'Expand on this content by writting the next two to three sentences.'
                },
                {
                    label: 'Write a lot',
                    prompt: 'Expand on this content by writting the next one or two paragraphs.'
                },
                {
                    label: 'Write even more',
                    prompt: 'Expand on this content by writting the next three to four paragraphs.'
                },
                {
                    label: 'Write a summary',
                    prompt: 'Write a short but detailed summary.'
                }
            ]
        }
    ];
</script>
