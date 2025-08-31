/**
 * A simulated techno-economic model for Levelized Cost of Heat (LCOH).
 * @param {object} params - The model parameters.
 * @param {number} params.capital_cost - Capital cost.
 * @param {number} params.efficiency - System efficiency.
 * @param {number} params.interest_rate - Interest rate.
 * @param {number} params.fuel_cost - Fuel cost.
 * @returns {number} The calculated LCOH.
 */
export function technoEconomicModel(params) {
    const { capital_cost, efficiency, interest_rate, fuel_cost } = params;
    const base_lcoh = 100 + (capital_cost / 1e6) * 30 - (efficiency - 0.5) * 150 + Math.pow(efficiency - 0.5, 3) * 400;
    const finance_component = Math.exp(interest_rate * 15) * (1 + capital_cost / 7.5e6);
    const op_cost = fuel_cost * 25 * (1 / (0.1 + efficiency));
    const interaction = Math.cos(fuel_cost * 0.2 + interest_rate * 50) * 5;
    return base_lcoh + finance_component + op_cost + interaction;
}

export const parameterRanges = {
    capital_cost: { min: 1_000_000, max: 10_000_000, step: 100000, default: 5_000_000 },
    efficiency: { min: 0.50, max: 0.95, step: 0.01, default: 0.75 },
    interest_rate: { min: 0.02, max: 0.12, step: 0.005, default: 0.05 },
    fuel_cost: { min: 5, max: 50, step: 1, default: 20 }
};