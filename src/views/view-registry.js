import { modules } from '../modules/module-registry.js';

// Defines the order of views in the UI.
export const viewOrder = ['Report', 'Key Drivers', 'Surrogate Model', 'Data'];

const views = {};

// Initialize all views from the defined order.
viewOrder.forEach(viewName => {
    // 'Report' is a special case and will not have modules assigned this way.
    if (viewName !== 'Report') {
        views[viewName] = [];
    }
});

// Populate views with modules from the registry.
// @ts-ignore
for (const moduleId in modules) {
    const moduleConfig = modules[moduleId];
    if (moduleConfig.view && views[moduleConfig.view]) {
        views[moduleConfig.view].push(moduleConfig);
    }
}

// Sort modules within each view to handle layouts (e.g., full-width items last).
for (const viewName in views) {
    views[viewName].sort((a, b) => {
        const isAFullWidth = a.layout === 'full-width';
        const isBFullWidth = b.layout === 'full-width';
        if (isAFullWidth === isBFullWidth) return 0;
        return isAFullWidth ? 1 : -1;
    });
}

export const viewRegistry = views;