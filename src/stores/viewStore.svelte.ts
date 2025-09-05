// MODIFICATION: Renamed to .svelte.ts
let view = $state('Report');

export const activeView = {
    get value(): string { return view; },
    set(v: string) { view = v; }
};