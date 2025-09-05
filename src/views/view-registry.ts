// MODIFICATION: Renamed to .ts
import { modules } from '../modules/module-registry.js'; // This import will become .ts
import type { ModuleConfig } from '../lib/types.js'; // This import will become .ts

export const viewOrder = ['Report', 'Key Drivers', 'Surrogate Model', 'Data'];

const views: Record<string, ModuleConfig[]> = {};

viewOrder.forEach(viewName => {
    if (viewName !== 'Report') {
        views[viewName] = [];
    }
});

for (const moduleId in modules) {
    const moduleConfig = modules[moduleId];
    if (moduleConfig.view && views[moduleConfig.view]) {
        views[moduleConfig.view].push(moduleConfig);
    }
}

for (const viewName in views) {
    views[viewName].sort((a, b) => {
        const isAFullWidth = a.layout === 'full-width';
        const isBFullWidth = b.layout === 'full-width';
        if (isAFullWidth === isBFullWidth) return 0;
        return isAFullWidth ? 1 : -1;
    });
}

export const viewRegistry = views;