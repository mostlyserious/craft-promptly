import Edit from '../components/Edit/Edit';
import Brainstorm from '../components/Brainstorm/Brainstorm';
import CustomPrompt from '../components/CustomPrompt/CustomPrompt';

export default [
    {
        label: '⚡ Custom Prompt',
        handle: 'custom',
        component: CustomPrompt
    },
    {
        label: '🧠 Brainstorm',
        handle: 'brainstorm',
        component: Brainstorm
    },
    {
        label: '✍️ Edit',
        handle: 'edit',
        component: Edit
    }
];
