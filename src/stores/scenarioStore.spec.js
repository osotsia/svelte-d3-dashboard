import { describe, it, expect, beforeEach, vi } from 'vitest';
import { scenarioStore } from './scenarioStore.svelte.js';
import { activeView } from './viewStore.svelte.js';

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
        // MODIFICATION: Access store state via direct properties instead of get()
        expect(scenarioStore.scenarios).toEqual({});
        expect(scenarioStore.workingState).toEqual(defaultScenario);
        expect(scenarioStore.activeScenarioName).toBe(null);
        expect(scenarioStore.isDirty).toBe(false);
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
        const expectedNormalizedScenario = { ...defaultScenario, parameters: { paramA: 5 } };
        // MODIFICATION: Access store state via direct properties
        expect(scenarioStore.scenarios['My Scenario']).toEqual(expectedNormalizedScenario);
    });

    it('updates workingState and sets isDirty to true', () => {
        // Act
        scenarioStore.updateWorkingState({ narrative: 'Test narrative' });

        // Assert
        // MODIFICATION: Access store state via direct properties
        expect(scenarioStore.workingState.narrative).toBe('Test narrative');
        expect(scenarioStore.isDirty).toBe(true);
    });

    it('saves the current scenario, updates localStorage, and resets isDirty', () => {
        // Arrange
        // MODIFICATION: Capture state before save directly
        const scenariosBeforeSave = { ...scenarioStore.scenarios };
        scenarioStore.updateWorkingState({ parameters: { paramA: 99 } });

        // Act
        scenarioStore.saveCurrentScenario('Test Save');

        // Assert
        // MODIFICATION: Access store state via direct properties
        expect(scenarioStore.activeScenarioName).toBe('Test Save');
        expect(scenarioStore.isDirty).toBe(false);
        expect(scenarioStore.scenarios['Test Save']).toEqual(scenarioStore.workingState);

        // Construct the expected object dynamically
        const expectedStoredData = {
            ...scenariosBeforeSave,
            'Test Save': scenarioStore.workingState
        };

        expect(localStorageMock.setItem).toHaveBeenCalledWith('workbenchScenarios', JSON.stringify(expectedStoredData));
    });
    
    it('loads an existing scenario and resets isDirty', () => {
        // Arrange
        const scenarioToLoad = { parameters: { paramA: 123 }, narrative: 'loaded', pinned: [], pcpSelections: {} };
        
        // MODIFICATION: Set up state using the store's public API for robustness
        scenarioStore.initialize(defaultScenario); // Start clean
        scenarioStore.updateWorkingState(scenarioToLoad);
        scenarioStore.saveCurrentScenario('Scenario to Load'); // Now 'Scenario to Load' exists in store.scenarios
        scenarioStore.updateWorkingState({ narrative: 'dirty state' }); // Make it dirty before loading

        // Act
        scenarioStore.loadScenario('Scenario to Load');

        // Assert
        // MODIFICATION: Access store state via direct properties
        expect(scenarioStore.workingState).toEqual(scenarioToLoad);
        expect(scenarioStore.activeScenarioName).toBe('Scenario to Load');
        expect(scenarioStore.isDirty).toBe(false);
    });

    it('creates a new scenario, resetting the state', () => {
        // Arrange
        scenarioStore.updateWorkingState({ narrative: 'Some changes' });
        scenarioStore.saveCurrentScenario('Old Scenario');

        // Act
        scenarioStore.newScenario();
        
        // Assert
        // MODIFICATION: Access store state via direct properties
        expect(scenarioStore.workingState).toEqual(defaultScenario);
        expect(scenarioStore.activeScenarioName).toBe(null);
        expect(scenarioStore.isDirty).toBe(false);
    });

    it('deletes a scenario and updates localStorage', () => {
        // Arrange
        // We need a known state to delete from.
        scenarioStore.saveCurrentScenario('Scenario A');
        scenarioStore.saveCurrentScenario('Scenario B');
        // MODIFICATION: Capture state before delete by spreading the object
        const scenariosBeforeDelete = { ...scenarioStore.scenarios };

        // Act
        scenarioStore.deleteScenario('Scenario A');
        
        // Assert
        // MODIFICATION: Access store state via direct properties
        expect(scenarioStore.scenarios['Scenario A']).toBeUndefined();
        expect(scenarioStore.scenarios['Scenario B']).toBeDefined();

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
        // MODIFICATION: Access store state via direct properties
        expect(scenarioStore.scenarios['Active Scenario']).toBeUndefined();
        expect(scenarioStore.workingState).toEqual(defaultScenario);
        expect(scenarioStore.activeScenarioName).toBe(null);
        expect(scenarioStore.isDirty).toBe(false);
    });
});