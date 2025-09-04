/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMeta {
    readonly glob: (pattern: string, options?: { eager?: boolean; import?: string }) => Record<string, unknown>;
}