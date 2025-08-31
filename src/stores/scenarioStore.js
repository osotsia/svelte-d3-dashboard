import { writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'workbenchScenarios';

function loadFromStorage() {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const scenarios = stored ? JSON.parse(stored) : {};
        // Normalize loaded scenarios to ensure all keys exist
        for (const key in scenarios) {
            if (!scenarios[key].pinned) scenarios[key].pinned = [];
            if (!scenarios[key].pcpSelections) scenarios[key].pcpSelections = {};
            if (!scenarios[key].narrative) scenarios[key].narrative = '';
        }
        return scenarios;
    } catch (e) {
        console.error("Failed to load scenarios from localStorage", e);
        return {};
    }
}

function createScenarioStore() {
    let _defaultScenario = {}; // To be set by initialize()

    const { subscribe, set, update } = writable({
        scenarios: loadFromStorage(),
        workingState: {
            parameters: {},
            narrative: '',
            pinned: [],
            pcpSelections: {}
        },
        activeScenarioName: null,
        isDirty: false
    });

    const store = {
        subscribe,
        initialize: (defaultScenario) => {
            _defaultScenario = JSON.parse(JSON.stringify(defaultScenario)); // Deep copy
            update(s => ({
                ...s,
                workingState: JSON.parse(JSON.stringify(defaultScenario)) // Deep copy
            }));
        },

        // --- State Modifiers ---
        setParameters: (params) => update(s => ({
            ...s,
            workingState: { ...s.workingState, parameters: params },
            isDirty: true
        })),

        setNarrative: (narrative) => update(s => ({
            ...s,
            workingState: { ...s.workingState, narrative: narrative },
            isDirty: true
        })),

        setPinnedItems: (pinnedItems) => update(s => ({
            ...s,
            workingState: { ...s.workingState, pinned: pinnedItems },
            isDirty: true
        })),

        setPcpSelections: (selections) => update(s => ({
            ...s,
            workingState: { ...s.workingState, pcpSelections: selections },
            isDirty: true
        })),

        // --- Scenario Actions ---
        newScenario: () => update(s => {
            if (s.isDirty && !confirm('You have unsaved changes. Discard them and start a new scenario?')) {
                return s;
            }
            return {
                ...s,
                workingState: JSON.parse(JSON.stringify(_defaultScenario)),
                activeScenarioName: null,
                isDirty: false
            };
        }),

        loadScenario: (name) => update(s => {
            if (!s.scenarios[name]) return s;
            if (s.isDirty && !confirm(`You have unsaved changes. Discard them and load "${name}"?`)) {
                return s;
            }
            const loadedScenario = {
                narrative: '',
                pinned: [],
                pcpSelections: {},
                ...s.scenarios[name]
            };
            return {
                ...s,
                workingState: JSON.parse(JSON.stringify(loadedScenario)),
                activeScenarioName: name,
                isDirty: false
            };
        }),

        saveCurrentScenario: (name) => update(s => {
            if (!name || !name.trim()) return s;
            
            const trimmedName = name.trim();
            const newScenarios = { ...s.scenarios, [trimmedName]: s.workingState };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newScenarios));
            
            return {
                ...s,
                scenarios: newScenarios,
                activeScenarioName: trimmedName,
                isDirty: false
            };
        }),

        deleteScenario: (name) => update(s => {
            if (!s.scenarios[name] || !confirm(`Are you sure you want to delete scenario "${name}"?`)) {
                return s; // Abort, no state change
            }

            // Create a new object for the scenarios to ensure immutability
            const newScenarios = { ...s.scenarios };
            delete newScenarios[name];
            
            // Persist the change to localStorage
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newScenarios));

            // Create a new state object to return
            const newState = { ...s, scenarios: newScenarios };

            // If the deleted scenario was the active one, reset the working state
            if (s.activeScenarioName === name) {
                newState.workingState = JSON.parse(JSON.stringify(_defaultScenario));
                newState.activeScenarioName = null;
                newState.isDirty = false;
            }

            return newState;
        }),
    };

    return store;
}

export const scenarioStore = createScenarioStore();