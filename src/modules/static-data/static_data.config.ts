import StaticDataItem from './StaticDataItem.svelte';
import BenchmarkTable from './BenchmarkTable.svelte';
// MODIFICATION: Import the ModuleConfig type
import type { ModuleConfig } from '../../lib/types';

/**
 * A central registry for static, user-defined data items and benchmarks.
 * These are treated like other analyses so they can be pinned to the report.
 *
 * MODIFICATION: Apply the correct type: a record where each value is a ModuleConfig.
 */
export const staticData: Record<string, ModuleConfig> = {
    'assumption-efficiency': {
        id: 'assumption-efficiency',
        title: 'System Efficiency Assumption',
        component: StaticDataItem,
        layout: 'default',
        view: 'Data', 
        explanation: 'Core assumption for system round-trip efficiency, including all subsystems.',
        props: {
            data: {
                'Value': '95%',
                'Source': 'Internal Cost Model V2.1, Q2 2024',
                'Justification': 'Bottom-up estimate for a 150 GWh system including refractories, power electronics, and EPC. +/- 2% uncertainty.'
            }
        }
    },
    'assumption-capital-costs': {
        id: 'assumption-capital-costs',
        title: 'Capital Cost Assumption',
        component: StaticDataItem,
        layout: 'default',
        view: 'Data', 
        explanation: 'Projected capital expenditure for the pilot system installation.',
        props: {
            data: {
                'Value': '$1.3M',
                'Source': 'Vendor Quote #A48-C2, Q1 2024',
                'Justification': 'Firm quote for a 10 MWth pilot system. Excludes land acquisition costs. Valid for 90 days.'
            }
        }
    },
    'assumption-labor': {
        id: 'assumption-labor',
        title: 'Operating Labor Assumption',
        component: StaticDataItem,
        layout: 'default',
        view: 'Data', 
        explanation: 'Estimated labor requirement for continuous plant operation.',
        props: {
            data: {
                'Value': '0.5 FTE',
                'Source': 'Operational Plan rev 3',
                'Justification': 'Assumes automated control system with on-call remote supervision. One full-time operator can supervise two equivalent systems.'
            }
        }
    },
    'benchmark-lcoh': {
        id: 'benchmark-lcoh',
        title: 'LCOH Benchmarks',
        component: BenchmarkTable,
        layout: 'full-width',
        view: 'Data', 
        explanation: 'Comparative LCOH benchmarks for alternative heating technologies under baseline assumptions.',
        props: {
            headers: ['Technology', 'Fuel Price ($/MMBtu)', 'Carbon Tax ($/tonne)', 'Boiler Efficiency (%)', 'Boiler CAPEX ($/MWth)', 'Estimated LCOH ($/Unit)'],
            rows: [
                ['Natural Gas Boiler', '3.50', '0', '85', '150,000', '850'],
                ['Natural Gas Boiler (w/ Tax)', '3.50', '50', '85', '150,000', '980'],
                ['Electric Resistance Boiler', '8.79', '0', '99', '100,000', '1150']
            ]
        }
    }
};