// MODIFICATION: Renamed to .svelte.ts
import { activeView } from './viewStore.svelte.js'; // Note: This import will become .ts after its own rename.
import type { Scenario, ScenarioMap } from '../lib/types';

// ... (persistence object is unchanged)
const persistence = {
    key: 'workbenchScenarios',
    load: (): ScenarioMap => {
        try {
            const stored = localStorage.getItem('workbenchScenarios');
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            alert("Error: Could not load saved scenarios. They may be corrupt. Please check the console for details.");
            console.error("Failed to load scenarios from localStorage", e);
            return {};
        }
    },
    save: (scenarios: ScenarioMap) => {
        try {
            localStorage.setItem('workbenchScenarios', JSON.stringify(scenarios));
        } catch (e) {
            alert("Error: Could not save scenarios. Your changes may not be persisted. LocalStorage might be full.");
            console.error("Failed to save scenarios to localStorage", e);
        }
    }
};

let _defaultScenario: Scenario = {} as Scenario;

function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

function normalizeScenario(scenarioData: Partial<Scenario>, defaultData: Scenario): Scenario {
    const parameters = { ...defaultData.parameters, ...(scenarioData.parameters || {}) };
    return { ...defaultData, ...scenarioData, parameters };
}

// MODIFICATION: Type annotations are already present from previous step, file rename enables stricter checking.
export const scenarioStore = $state({
    scenarios: {} as ScenarioMap,
    workingState: null as Scenario | null,
    activeScenarioName: null as string | null,
    isDirty: false,

    initialize(defaultScenario: Scenario) {
        _defaultScenario = deepCopy(defaultScenario);
        const scenarios = persistence.load();
        
        for (const key in scenarios) {
            scenarios[key] = normalizeScenario(scenarios[key], _defaultScenario);
        }
        
        this.scenarios = scenarios;
        this.workingState = deepCopy(_defaultScenario);
        this.activeScenarioName = null;
        this.isDirty = false;
    },

    updateWorkingState(partialState: Partial<Scenario>) {
        if (!this.workingState) return;
        this.workingState = { ...this.workingState, ...partialState };
        this.isDirty = true;
    },

    newScenario() {
        activeView.set('Report');
        this.workingState = deepCopy(_defaultScenario);
        this.activeScenarioName = null;
        this.isDirty = false;
    },

    loadScenario(name: string) {
        if (!this.scenarios[name]) return;
        activeView.set('Report');
        this.workingState = deepCopy(this.scenarios[name]);
        this.activeScenarioName = name;
        this.isDirty = false;
    },

    saveCurrentScenario(name: string) {
        if (!this.workingState) return;
        this.scenarios[name] = this.workingState;
        persistence.save(this.scenarios);
        this.activeScenarioName = name;
        this.isDirty = false;
        activeView.set('Report');
    },

    deleteScenario(name: string) {
        if (!this.scenarios[name]) return;
        
        delete this.scenarios[name];
        this.scenarios = { ...this.scenarios };
        persistence.save(this.scenarios);

        if (this.activeScenarioName === name) {
            this.workingState = deepCopy(_defaultScenario);
            this.activeScenarioName = null;
            this.isDirty = false;
        }
        activeView.set('Report');
    },
});