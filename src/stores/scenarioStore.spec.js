import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { scenarioStore } from './scenarioStore.js';
import { activeView } from './viewStore.js';

// Define a consistent default scenario for all tests
const defaultScenario = {
    parameters: { paramA: 1, paramB: 10 },
    narrative: '',
    pinned: [],
    pcpSelections: {}
};

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        removeItem: vi.fn((key) => {
            delete store[key];
        })
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});


describe('scenarioStore', () => {

    // Reset mocks and the store before each test to ensure isolation
    beforeEach(() => {
        localStorageMock.clear();
        localStorageMock.getItem.mockClear();
        localStorageMock.setItem.mockClear();
        // The store is a singleton; we must initialize it for each test.
        scenarioStore.initialize(defaultScenario);
    });

    it('initializes with a default state when localStorage is empty', () => {
        // Assert
        const state = get(scenarioStore);
        expect(state.scenarios).toEqual({});
        expect(state.workingState).toEqual(defaultScenario);
        expect(state.activeScenarioName).toBe(null);
        expect(state.isDirty).toBe(false);
        expect(localStorageMock.getItem).toHaveBeenCalledWith('workbenchScenarios');
    });

    it('initializes and normalizes scenarios from localStorage', () => {
        // Arrange
        const storedScenarios = {
            'My Scenario': { parameters: { paramA: 5 } } // Incomplete scenario
        };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(storedScenarios));

        // Act - Re-initialize to simulate startup with stored data
        scenarioStore.initialize(defaultScenario);

        // Assert
        const state = get(scenarioStore);
        const expectedNormalizedScenario = { ...defaultScenario, parameters: { paramA: 5 } };
        expect(state.scenarios['My Scenario']).toEqual(expectedNormalizedScenario);
    });

    it('updates workingState and sets isDirty to true', () => {
        // Act
        scenarioStore.updateWorkingState({ narrative: 'Test narrative' });

        // Assert
        const state = get(scenarioStore);
        expect(state.workingState.narrative).toBe('Test narrative');
        expect(state.isDirty).toBe(true);
    });

    it('saves the current scenario, updates localStorage, and resets isDirty', () => {
        // Arrange
        scenarioStore.updateWorkingState({ parameters: { paramA: 99 } });
        const stateBeforeSave = get(scenarioStore);
        const scenariosBeforeSave = stateBeforeSave.scenarios;

        // Act
        scenarioStore.saveCurrentScenario('Test Save');

        // Assert
        const stateAfterSave = get(scenarioStore);
        expect(stateAfterSave.activeScenarioName).toBe('Test Save');
        expect(stateAfterSave.isDirty).toBe(false);
        expect(stateAfterSave.scenarios['Test Save']).toEqual(stateAfterSave.workingState);

        // Construct the expected object dynamically
        const expectedStoredData = {
            ...scenariosBeforeSave,
            'Test Save': stateAfterSave.workingState
        };

        expect(localStorageMock.setItem).toHaveBeenCalledWith('workbenchScenarios', JSON.stringify(expectedStoredData));
    });
    
    it('loads an existing scenario and resets isDirty', () => {
        // Arrange
        const scenarioToLoad = { parameters: { paramA: 123 }, narrative: 'loaded', pinned: [], pcpSelections: {} };
        scenarioStore.initialize(defaultScenario); // Start clean
        get(scenarioStore).scenarios = { 'Scenario to Load': scenarioToLoad }; // Manually set up state
        scenarioStore.updateWorkingState({ narrative: 'dirty state' });

        // Act
        scenarioStore.loadScenario('Scenario to Load');

        // Assert
        const state = get(scenarioStore);
        expect(state.workingState).toEqual(scenarioToLoad);
        expect(state.activeScenarioName).toBe('Scenario to Load');
        expect(state.isDirty).toBe(false);
    });

    it('creates a new scenario, resetting the state', () => {
        // Arrange
        scenarioStore.updateWorkingState({ narrative: 'Some changes' });
        scenarioStore.saveCurrentScenario('Old Scenario');

        // Act
        scenarioStore.newScenario();
        
        // Assert
        const state = get(scenarioStore);
        expect(state.workingState).toEqual(defaultScenario);
        expect(state.activeScenarioName).toBe(null);
        expect(state.isDirty).toBe(false);
    });

    it('deletes a scenario and updates localStorage', () => {
        // Arrange
        // We need a known state to delete from.
        scenarioStore.saveCurrentScenario('Scenario A');
        scenarioStore.saveCurrentScenario('Scenario B');
        const scenariosBeforeDelete = get(scenarioStore).scenarios;

        // Act
        scenarioStore.deleteScenario('Scenario A');
        
        // Assert
        const stateAfterDelete = get(scenarioStore);
        expect(stateAfterDelete.scenarios['Scenario A']).toBeUndefined();
        expect(stateAfterDelete.scenarios['Scenario B']).toBeDefined();

        // Construct the expected object dynamically
        const expectedStoredData = { ...scenariosBeforeDelete };
        delete expectedStoredData['Scenario A'];

        expect(localStorageMock.setItem).toHaveBeenLastCalledWith('workbenchScenarios', JSON.stringify(expectedStoredData));
    });

    it('deletes the active scenario and resets workingState', () => {
        // Arrange
        scenarioStore.saveCurrentScenario('Active Scenario');

        // Act
        scenarioStore.deleteScenario('Active Scenario');

        // Assert
        const state = get(scenarioStore);
        expect(state.scenarios['Active Scenario']).toBeUndefined();
        expect(state.workingState).toEqual(defaultScenario);
        expect(state.activeScenarioName).toBe(null);
        expect(state.isDirty).toBe(false);
    });
});