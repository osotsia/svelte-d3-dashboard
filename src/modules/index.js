import sobol from './sobol/sobol.config.js';
import pcp from './pcp/pcp.config.js';
import featureImportance from './feature-importance/feature-importance.config.js';
import residuals from './residuals/residuals.config.js';
import modelCard from './model-card/model-card.config.js';
import { staticData } from './static-data/static_data.config.js';

/**
 * A central registry of all available analyses in the application.
 * Keys should match the `id` defined within each analysis module.
 */
export const analyses = {
    'sobol': sobol,
    'pcp': pcp,
    'feature-importance': featureImportance,
    'residuals': residuals,
    'model-card': modelCard,
    ...staticData
};