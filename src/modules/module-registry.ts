// MODIFICATION: Renamed to .ts, using native TypeScript syntax.
import type { ModuleConfig } from '../lib/types';

/**
 * A central registry of all available modules in the application.
 * This file uses Vite's `import.meta.glob` feature to dynamically
 * import all `*.config.js` files from the subdirectories.
 */

const moduleFiles = import.meta.glob<Record<string, any>>('./**/*.config.js', { eager: true });

// MODIFICATION: Replaced JSDoc with native TS type annotation.
export const modules: Record<string, ModuleConfig> = Object.values(moduleFiles).reduce((registry, moduleExports) => {
    // Case 1: Handle standard modules with a single 'default' export.
    const moduleDefault = moduleExports.default as ModuleConfig | undefined;
    if (moduleDefault) {
        if (!moduleDefault.id) {
            console.warn('Module configuration is missing an `id` property and will be skipped:', moduleDefault);
        } else {
            registry[moduleDefault.id] = moduleDefault;
        }
    }

    // Case 2: Handle files that export collections of modules (like static_data).
    // It iterates over all named exports in the file.
    for (const exportName in moduleExports) {
        if (exportName !== 'default') {
            const collection = moduleExports[exportName] as Record<string, ModuleConfig>;
            // Merge the collection into the main registry.
            Object.assign(registry, collection);
        }
    }

    return registry;
}, {} as Record<string, ModuleConfig>);