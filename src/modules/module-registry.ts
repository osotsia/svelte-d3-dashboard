// File: modules/module-registry.ts

import type { ModuleConfig } from '../lib/types';

/**
 * A central registry of all available modules in the application.
 * This file uses Vite's `import.meta.glob` feature to dynamically
 * import all `*.config.ts` files from the subdirectories.
 */

const moduleFiles = import.meta.glob<Record<string, any>>('./**/*.config.ts', { eager: true });

/**
 * The aggregated registry of all analysis modules.
 * This reducer iterates through each dynamically imported module file,
 * extracts both default and named exports, and merges them into a
 * single flat registry object. It exclusively uses immutable patterns
 * (spread syntax) for merging, ensuring consistency with the rest of the application.
 */
export const modules: Record<string, ModuleConfig> = Object.values(moduleFiles).reduce(
    (accumulator, moduleExports) => {
        // Use destructuring to separate the default export from all other named exports.
        const { default: moduleDefault, ...namedExports } = moduleExports;

        // Case 1: Handle the default export, if it exists and is valid.
        const defaultEntry = (moduleDefault?.id)
            ? { [moduleDefault.id]: moduleDefault as ModuleConfig }
            : {};
        
        // Log a warning if a default export is present but lacks a required 'id'.
        if (moduleDefault && !moduleDefault.id) {
            console.warn('Module configuration from a default export is missing an `id` property and will be skipped:', moduleDefault);
        }

        // Case 2: Handle all named exports, which are expected to be collections of modules.
        // This merges all exported objects into a single `namedEntries` object.
        const namedEntries = Object.values(namedExports).reduce(
            (collectionAccumulator, exportedCollection) => ({
                ...collectionAccumulator,
                ...(exportedCollection as Record<string, ModuleConfig>)
            }),
            {}
        );

        // Return a new object for the next iteration, combining the existing
        // accumulator with the modules found in the current file.
        return {
            ...accumulator,
            ...defaultEntry,
            ...namedEntries,
        };
    },
    {} as Record<string, ModuleConfig>
);