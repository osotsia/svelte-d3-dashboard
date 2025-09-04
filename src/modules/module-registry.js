/**
 * A central registry of all available modules in the application.
 * This file uses Vite's `import.meta.glob` feature to dynamically
 * import all `*.config.js` files from the subdirectories.
 * This eliminates the need to manually import and register each module.
 *
 * It handles two types of exports from config files:
 * 1. A `default` export: Assumed to be a single module configuration object.
 *    The object's `id` property is used as the key in the final registry.
 * 2. A named export (e.g., `staticData`): Assumed to be an object where each
 *    key-value pair represents a module. These are merged into the final registry.
 */

// Use Vite's eager glob import to synchronously load all module configs.
const moduleFiles = import.meta.glob('./**/*.config.js', { eager: true });

export const modules = Object.values(moduleFiles).reduce((registry, moduleExports) => {
    // Case 1: Handle standard modules with a single 'default' export.
    if (moduleExports.default) {
        const config = moduleExports.default;
        if (!config.id) {
            console.warn('Module configuration is missing an `id` property and will be skipped:', config);
        } else {
            registry[config.id] = config;
        }
    }

    // Case 2: Handle files that export collections of modules (like static_data).
    // It iterates over all named exports in the file.
    for (const exportName in moduleExports) {
        if (exportName !== 'default') {
            const collection = moduleExports[exportName];
            // Merge the collection into the main registry.
            Object.assign(registry, collection);
        }
    }

    return registry;
}, {});