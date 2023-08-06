import throttle from './modules/throttle';
import { writable, readable } from 'svelte/store';

export const redactor = writable(null);
export const field = writable(null);
export const preview = writable('');
export const errors = writable([]);
export const isBusy = writable(false);
export const isActive = writable(false);
export const hasAccess = writable(false);
export const hasContent = writable(false);
export const insertion = writable(null);
export const active = writable(null);
export const category = writable(null);
export const isDev = readable(import.meta.env.MODE === 'development');

export const screen = writable({
    is2xs: matchMedia('(min-width: 380px)').matches,
    isXs: matchMedia('(min-width: 460px)').matches,
    isSm: matchMedia('(min-width: 640px)').matches,
    isMd: matchMedia('(min-width: 768px)').matches,
    isLg: matchMedia('(min-width: 1024px)').matches,
    isXl: matchMedia('(min-width: 1280px)').matches,
    is2xl: matchMedia('(min-width: 1536px)').matches
});

addEventListener('resize', throttle(() => {
    screen.set({
        is2xs: matchMedia('(min-width: 380px)').matches,
        isXs: matchMedia('(min-width: 460px)').matches,
        isSm: matchMedia('(min-width: 640px)').matches,
        isMd: matchMedia('(min-width: 768px)').matches,
        isLg: matchMedia('(min-width: 1024px)').matches,
        isXl: matchMedia('(min-width: 1280px)').matches,
        is2xl: matchMedia('(min-width: 1536px)').matches
    });
}, 1000 / 30, 'prepare'));
