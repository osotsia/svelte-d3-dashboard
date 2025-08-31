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
    const { subscribe, set, update } = writable({
        scenarios: loadFromStorage(),
        currentScenario: {
            parameters: {},
            narrative: '',
            pinned: [],
            pcpSelections: {} 
        },
        activeScenarioName: null
    });

    return {
        subscribe,
        setParameters: (params) => update(store => {
            const newScenario = { ...store.currentScenario, parameters: params };
            return { ...store, currentScenario: newScenario, activeScenarioName: findMatchingScenarioName(newScenario, store.scenarios) };
        }),
        setNarrative: (narrative) => update(store => {
            const newScenario = { ...store.currentScenario, narrative: narrative };
            return { ...store, currentScenario: newScenario, activeScenarioName: findMatchingScenarioName(newScenario, store.scenarios) };
        }),
        setPinnedItems: (pinnedItems) => update(store => {
            const newScenario = { ...store.currentScenario, pinned: pinnedItems };
            return { ...store, currentScenario: newScenario, activeScenarioName: findMatchingScenarioName(newScenario, store.scenarios) };
        }),
        setPcpSelections: (selections) => update(store => {
            const newScenario = { ...store.currentScenario, pcpSelections: selections };
            return { ...store, currentScenario: newScenario, activeScenarioName: findMatchingScenarioName(newScenario, store.scenarios) };
        }),
        saveCurrentScenario: (name) => update(store => {
            if (name && name.trim()) {
                const trimmedName = name.trim();
                const newScenarios = { ...store.scenarios, [trimmedName]: store.currentScenario };
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newScenarios));
                return { ...store, scenarios: newScenarios, activeScenarioName: trimmedName };
            }
            return store;
        }),
        loadScenario: (name) => update(store => {
            if (store.scenarios[name]) {
                const loadedScenario = {
                    narrative: '',
                    pinned: [],
                    pcpSelections: {},
                    ...store.scenarios[name]
                };
                return { ...store, currentScenario: loadedScenario, activeScenarioName: name };
            }
            return store;
        }),
        deleteScenario: (name) => update(store => {
            if (store.scenarios[name]) {
                const newScenarios = { ...store.scenarios };
                delete newScenarios[name];
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newScenarios));
                const newActiveName = store.activeScenarioName === name ? null : store.activeScenarioName;
                return { ...store, scenarios: newScenarios, activeScenarioName: newActiveName };
            }
            return store;
        }),
        initialize: (defaultScenario) => {
            update(store => ({ ...store, currentScenario: defaultScenario, activeScenarioName: findMatchingScenarioName(defaultScenario, store.scenarios) }));
        }
    };
}

function findMatchingScenarioName(currentScenario, scenarios) {
    if (!currentScenario || !currentScenario.parameters) return null;
    const currentNorm = {
        narrative: '',
        pinned: [],
        pcpSelections: {},
        ...currentScenario
    };
    const currentJSON = JSON.stringify(currentNorm, Object.keys(currentNorm).sort());
    for (const [name, savedScenario] of Object.entries(scenarios)) {
        const savedNorm = {
            narrative: '',
            pinned: [],
            pcpSelections: {},
            ...savedScenario
        };
        const savedJSON = JSON.stringify(savedNorm, Object.keys(savedNorm).sort());
        if (savedJSON === currentJSON) {
            return name;
        }
    }
    return null;
}

export const scenarioStore = createScenarioStore();