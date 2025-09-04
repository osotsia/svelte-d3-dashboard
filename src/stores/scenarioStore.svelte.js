import { activeView } from './viewStore.svelte.js';

const persistence = {
    key: 'workbenchScenarios',
    load: () => {
        try {
            const stored = localStorage.getItem('workbenchScenarios');
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error("Failed to load scenarios from localStorage", e);
            return {};
        }
    },
    save: (scenarios) => {
        try {
            localStorage.setItem('workbenchScenarios', JSON.stringify(scenarios));
        } catch (e) {
            console.error("Failed to save scenarios to localStorage", e);
        }
    }
};

let _defaultScenario = {};

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function normalizeScenario(scenarioData, defaultData) {
    return { ...defaultData, ...scenarioData };
}

// MODIFICATION: The entire exported object, including state and methods, is now a reactive `$state` object.
export const scenarioStore = $state({
    scenarios: {},
    workingState: null,
    activeScenarioName: null,
    isDirty: false,

    initialize(defaultScenario) {
        _defaultScenario = deepCopy(defaultScenario);
        const scenarios = persistence.load();
        
        for (const key in scenarios) {
            scenarios[key] = normalizeScenario(scenarios[key], _defaultScenario);
        }
        
        // Methods now use 'this' to refer to the state properties of this object.
        this.scenarios = scenarios;
        this.workingState = deepCopy(_defaultScenario);
        this.activeScenarioName = null;
        this.isDirty = false;
    },

    updateWorkingState(partialState) {
        this.workingState = { ...this.workingState, ...partialState };
        this.isDirty = true;
    },

    newScenario() {
        activeView.set('Report');
        this.workingState = deepCopy(_defaultScenario);
        this.activeScenarioName = null;
        this.isDirty = false;
    },

    loadScenario(name) {
        if (!this.scenarios[name]) return;
        activeView.set('Report');
        this.workingState = deepCopy(this.scenarios[name]);
        this.activeScenarioName = name;
        this.isDirty = false;
    },

    saveCurrentScenario(name) {
        this.scenarios[name] = this.workingState;
        persistence.save(this.scenarios);
        this.activeScenarioName = name;
        this.isDirty = false;
        activeView.set('Report');
    },

    deleteScenario(name) {
        if (!this.scenarios[name]) return;
        
        delete this.scenarios[name];
        // Re-assigning triggers reactivity for object deletions.
        this.scenarios = this.scenarios; 
        persistence.save(this.scenarios);

        if (this.activeScenarioName === name) {
            this.workingState = deepCopy(_defaultScenario);
            this.activeScenarioName = null;
            this.isDirty = false;
        }
        activeView.set('Report');
    },
});