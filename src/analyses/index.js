import sobol from './sobol/index.js';
import pcp from './pcp/index.js';
import featureImportance from './feature-importance/index.js';
import residuals from './residuals/index.js';
import modelCard from './model-card/index.js';

/**
 * A central registry of all available analyses in the application.
 * Keys should match the `id` defined within each analysis module.
 */
export const analyses = {
    'sobol': sobol,
    'pcp': pcp,
    'feature-importance': featureImportance,
    'residuals': residuals,
    'model-card': modelCard
};