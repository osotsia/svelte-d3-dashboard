import { writable, get } from 'svelte/store';
import { activeView } from './viewStore.js';

// Internal persistence helper
const persistence = {
    key: 'workbenchScenarios',
    load: () => {
        try {
            const stored = localStorage.getItem(persistence.key);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error("Failed to load scenarios from localStorage", e);
            return {};
        }
    },
    save: (scenarios) => {
        try {
            localStorage.setItem(persistence.key, JSON.stringify(scenarios));
        } catch (e) {
            console.error("Failed to save scenarios to localStorage", e);
        }
    }
};

function createScenarioStore() {
    let _defaultScenario = {};

    const { subscribe, update, set } = writable({
        scenarios: {},
        workingState: null, // Initialized via initialize()
        activeScenarioName: null,
        isDirty: false
    });

    function deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // Ensures a loaded scenario object has all the keys of the default template.
    function normalizeScenario(scenarioData, defaultData) {
        return { ...defaultData, ...scenarioData };
    }

    // Public API / Service Layer
    const service = {
        initialize: (defaultScenario) => {
            _defaultScenario = deepCopy(defaultScenario);
            const scenarios = persistence.load();
            
            // Normalize all loaded scenarios on startup to prevent errors
            for (const key in scenarios) {
                scenarios[key] = normalizeScenario(scenarios[key], _defaultScenario);
            }
            
            set({
                scenarios,
                workingState: deepCopy(_defaultScenario),
                activeScenarioName: null,
                isDirty: false
            });
        },

        // Generic updater for any part of the working state.
        updateWorkingState: (partialState) => {
            update(s => ({
                ...s,
                workingState: { ...s.workingState, ...partialState },
                isDirty: true
            }));
        },

        newScenario: () => {
            activeView.set('Report');
            update(s => ({
                ...s,
                workingState: deepCopy(_defaultScenario),
                activeScenarioName: null,
                isDirty: false
            }));
        },

        loadScenario: (name) => {
            const s = get({ subscribe });
            if (!s.scenarios[name]) return;

            activeView.set('Report');
            update(current => ({
                ...current,
                workingState: deepCopy(s.scenarios[name]),
                activeScenarioName: name,
                isDirty: false
            }));
        },

        saveCurrentScenario: (name) => {
            let scenarios;
            update(s => {
                scenarios = { ...s.scenarios, [name]: s.workingState };
                return {
                    ...s,
                    scenarios: scenarios,
                    activeScenarioName: name,
                    isDirty: false
                };
            });
            persistence.save(scenarios);
            activeView.set('Report');
        },

        deleteScenario: (name) => {
            const s = get({ subscribe });
            if (!s.scenarios[name]) return;
            
            const newScenarios = { ...s.scenarios };
            delete newScenarios[name];
            persistence.save(newScenarios);

            update(current => {
                const newState = { ...current, scenarios: newScenarios };
                if (current.activeScenarioName === name) {
                    newState.workingState = deepCopy(_defaultScenario);
                    newState.activeScenarioName = null;
                    newState.isDirty = false;
                }
                return newState;
            });
            activeView.set('Report');
        },
    };

    return {
        subscribe,
        ...service
    };
}

export const scenarioStore = createScenarioStore();