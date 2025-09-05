// MODIFICATION: Renamed to .ts, using native TypeScript syntax.
import type { ParameterRanges, Parameters } from './types';

/**
 * A simulated techno-economic model for Levelized Cost of Heat (LCOH).
 * @param params - The model parameters.
 * @returns The calculated LCOH.
 * @throws {Error} if required parameters are missing or not numbers.
 */
export function technoEconomicModel(params: Parameters): number {
    const requiredParams = ['capital_cost', 'efficiency', 'interest_rate', 'fuel_cost'];
    
    for (const p of requiredParams) {
        if (params[p] === undefined || typeof params[p] !== 'number' || !isFinite(params[p])) {
            throw new Error(`Invalid or missing parameter: '${p}'.`);
        }
    }

    const { capital_cost, efficiency, interest_rate, fuel_cost } = params;
    const base_lcoh = 100 + (capital_cost / 1e6) * 30 - (efficiency - 0.5) * 150 + Math.pow(efficiency - 0.5, 3) * 400;
    const finance_component = Math.exp(interest_rate * 15) * (1 + capital_cost / 7.5e6);
    const op_cost = fuel_cost * 25 * (1 / (0.1 + efficiency));
    const interaction = Math.cos(fuel_cost * 0.2 + interest_rate * 50) * 5;
    return base_lcoh + finance_component + op_cost + interaction;
}

// MODIFICATION: Replaced JSDoc with native TS type annotation.
export const parameterRanges: ParameterRanges = {
    capital_cost: { min: 1_000_000, max: 10_000_000, step: 100000, default: 5_000_000 },
    efficiency: { min: 0.50, max: 0.95, step: 0.01, default: 0.75 },
    interest_rate: { min: 0.02, max: 0.12, step: 0.005, default: 0.05 },
    fuel_cost: { min: 5, max: 50, step: 1, default: 20 }
};